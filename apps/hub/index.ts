import { randomUUIDv7, type ServerWebSocket } from "bun";
import type { IncomingMessage, SignupIncomingMessage } from "common/types";
import { prismaClient } from "db/client";
import { PublicKey } from "@solana/web3.js";
import nacl from "tweetnacl";
import nacl_util from "tweetnacl-util";

// Add graceful shutdown handling
process.on('SIGINT', async () => {
    console.log('Shutting down gracefully...');
    await prismaClient.$disconnect();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('Shutting down gracefully...');
    await prismaClient.$disconnect();
    process.exit(0);
});

const availableValidators: { validatorId: string, socket: ServerWebSocket<unknown>, publicKey: string }[] = [];

const CALLBACKS : { [callbackId: string]: (data: IncomingMessage) => void } = {}
const COST_PER_VALIDATION = 100; // in lamports

Bun.serve({
    fetch(req, server) {
      if (server.upgrade(req)) {
        return;
      }
      return new Response("Upgrade failed", { status: 500 });
    },
    port: process.env.PORT || 8081,
    websocket: {
        async message(ws: ServerWebSocket<unknown>, message: string) {
            console.log("Received message:", message);
            const data: IncomingMessage = JSON.parse(message);
            
            if (data.type === 'signup') {
                console.log("Processing signup for:", data.data.publicKey);
                
                const verified = await verifyMessage(
                    `Signed message for ${data.data.callbackId}, ${data.data.publicKey}`,
                    data.data.publicKey,
                    data.data.signedMessage
                );
                
                console.log("Signature verified:", verified);
                
                if (verified) {
                    await signupHandler(ws, data.data);
                } else {
                    console.log("Signature verification failed");
                }
            } else if (data.type === 'validate') {
                console.log("Processing validation response for:", data.data.callbackId);
                if (CALLBACKS[data.data.callbackId]) {
                    //@ts-ignore
                    CALLBACKS[data.data.callbackId](data);
                    delete CALLBACKS[data.data.callbackId];
                } else {
                    console.log("No callback found for:", data.data.callbackId);
                }
            }
        },
        async close(ws: ServerWebSocket<unknown>) {
            const index = availableValidators.findIndex(v => v.socket === ws);
            if (index !== -1) {
                //@ts-ignore
                console.log("Validator disconnected:", availableValidators[index].validatorId);
                availableValidators.splice(index, 1);
            }
        }
    },
});

async function signupHandler(ws: ServerWebSocket<unknown>, { ip, publicKey, signedMessage, callbackId }: SignupIncomingMessage) {
    console.log("Signup handler called for:", publicKey);
    
    const validatorDb = await prismaClient.validator.findFirst({
        where: {
            publicKey,
        },
    });

    if (validatorDb) {
        console.log("Existing validator found:", validatorDb.id);
        ws.send(JSON.stringify({
            type: 'signup',
            data: {
                validatorId: validatorDb.id,
                callbackId,
            },
        }));

        availableValidators.push({
            validatorId: validatorDb.id,
            socket: ws,
            publicKey: validatorDb.publicKey,
        });
        return;
    }
    
    console.log("Creating new validator");
    const validator = await prismaClient.validator.create({
        data: {
            ip,
            publicKey,
            location: 'unknown',
        },
    });

    console.log("New validator created:", validator.id);

    ws.send(JSON.stringify({
        type: 'signup',
        data: {
            validatorId: validator.id,
            callbackId,
        },
    }));

    availableValidators.push({
        validatorId: validator.id,
        socket: ws,
        publicKey: validator.publicKey,
    });
}

async function verifyMessage(message: string, publicKey: string, signature: string) {
    try {
        const messageBytes = nacl_util.decodeUTF8(message);
        
        // Parse the signature from JSON array format and convert to Uint8Array
        const signatureArray = JSON.parse(signature);
        const signatureBytes = new Uint8Array(signatureArray);
        
        const result = nacl.sign.detached.verify(
            messageBytes,
            signatureBytes,
            new PublicKey(publicKey).toBytes(),
        );

        return result;
    } catch (error) {
        console.error("Signature verification error:", error);
        return false;
    }
}

// Monitor websites every minute with controlled concurrency
setInterval(async () => {
    console.log(`Checking websites. Available validators: ${availableValidators.length}`);
    
    if (availableValidators.length === 0) {
        console.log("No validators available");
        return;
    }
    
    const websitesToMonitor = await prismaClient.websites.findMany({
        where: {
            disabled: false,
        },
    });

    console.log(`Found ${websitesToMonitor.length} websites to monitor`);

    // Process websites in batches to avoid overwhelming the database
    const batchSize = 5;
    for (let i = 0; i < websitesToMonitor.length; i += batchSize) {
        const batch = websitesToMonitor.slice(i, i + batchSize);
        
        for (const website of batch) {
            availableValidators.forEach(validator => {
                const callbackId = randomUUIDv7();
                console.log(`Sending validation request for ${website.url} to validator ${validator.validatorId}`);
                
                validator.socket.send(JSON.stringify({
                    type: 'validate',
                    data: {
                        url: website.url,
                        websiteId: website.id,
                        callbackId
                    },
                }));

                CALLBACKS[callbackId] = async (data: IncomingMessage) => {
                    if (data.type === 'validate') {
                        console.log(`Received validation response for ${website.url}:`, data.data);
                        
                        const { validatorId, status, latency, signedMessage } = data.data;
                        
                        const verified = await verifyMessage(
                            `Replying to ${callbackId}`,
                            validator.publicKey,
                            signedMessage
                        );
                        
                        if (!verified) {
                            console.log("Validation response signature verification failed");
                            return;
                        }

                        console.log(`Storing validation result: ${website.url} - ${status} (${latency}ms)`);

                        try {
                            await prismaClient.$transaction(async (tx) => {
                                await tx.websiteTick.create({
                                    data: {
                                        websiteId: website.id,
                                        validatorId,
                                        status,
                                        latency,
                                        createdAt: new Date(),
                                    },
                                });

                                await tx.validator.update({
                                    where: { id: validatorId },
                                    data: {
                                        pendingPayouts: { increment: COST_PER_VALIDATION },
                                    },
                                });
                            }, {
                                maxWait: 5000, // 5 seconds
                                timeout: 10000, // 10 seconds
                            });
                        } catch (transactionError) {
                            console.error(`Transaction failed for ${website.url}:`, transactionError);
                            // Optionally, you could implement a retry mechanism here
                        }
                    }
                };
                
                // Set a timeout to clean up callbacks that don't get responses
                setTimeout(() => {
                    if (CALLBACKS[callbackId]) {
                        console.log(`Timeout for callback ${callbackId}`);
                        delete CALLBACKS[callbackId];
                    }
                }, 30000); // 30 second timeout
            });
        }
        
        // Small delay between batches to reduce database load
        if (i + batchSize < websitesToMonitor.length) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
}, 60 * 1000);