import { PublicKey } from "@solana/web3.js";
import { randomUUIDv7, stringWidth, type ServerWebSocket } from "bun"
import type {IncomingMessage, OutgoingMessage, SignupIncomingMessage} from "common/types"
import nacl from "tweetnacl";
import nacl_util from "tweetnacl-util";
import {prismaClient} from "db/client";

const availableValidators: {
    validatorId: string,
    socket: ServerWebSocket<unknown>,
    publicKey: string
}[] = [];

const CALLBACKS: { [callbackId: string] : (data: IncomingMessage) => void } = {};   //this is a globally maintained CALLBACK object that stores the callbacks for each callbackId
const COST_PER_VALIDATION = 100;    //in lamports (1 lamport = 0.000000001 SOL)

//websocket handler
Bun.serve({
    fetch(req, server) {
        if (server.upgrade(req)) {
            return;
        }

        return new Response("upgrade failed", {
            status: 500
        })
    },
    port: 8080,
    websocket: {
        async message(ws: ServerWebSocket<unknown>, message: string) {
            const data: IncomingMessage = JSON.parse(message);

            if (data.type === 'signup') {
                const verified = await verifyMessage(
                    `Signed message for ${data.data.callbackId}, ${data.data.publicKey}`,
                    data.data.signedMessage,
                    data.data.publicKey
                );

                if (verified) {
                    await signuphandler(ws, data.data);
                }
            } else if (data.type === 'validate') {
                //@ts-ignore
                CALLBACKS[data.data.callbackId](data);
                delete CALLBACKS[data.data.callbackId];
            }
        },
        async close(ws: ServerWebSocket<unknown>) {
            availableValidators.splice(availableValidators.findIndex(v => v.socket === ws), 1);
        }
    }

})

async function signuphandler(ws: ServerWebSocket<unknown>, { ip, publicKey, signedMessage, callbackId }: SignupIncomingMessage) {
    const validatorDb = await prismaClient.validator.findFirst({
        where: {
            publicKey
        }
    });

    if (validatorDb) {
        ws.send(JSON.stringify({
            type: 'signup',
            data: {
                validatorId: validatorDb.id,
                callbackId
            }
        }));

        availableValidators.push({
            validatorId: validatorDb.id,
            socket: ws,
            publicKey: validatorDb.publicKey
        });
        return;
    }
    
    const validator = await prismaClient.validator.create({
        data: {
            ip,
            publicKey,
            location: "Unknown" // will replace this with actual location logic if needed
        }
    })

    ws.send(JSON.stringify({
        type: "signup",
        data: {
            validatorId: validator.id,
            callbackId
        }
    }))

    availableValidators.push({
        validatorId: validator.id,
        socket: ws,
        publicKey: validator.publicKey
    })
}


//used to verify the signed message from the validator
async function verifyMessage(message: string, publicKey: string, signature: string) {
    const messageBytes = nacl_util.decodeUTF8(message);

    //the below function takes the message, the signed gibberish and the public key of the validator and verifies if the signature is valid or not for the specific public key

    const result = nacl.sign.detached.verify(
        messageBytes,
        new Uint8Array(JSON.parse(signature)),  //Uint8Array because nacl expects the signature to be in Uint8Array format
        new PublicKey(publicKey).toBytes()
    );

    return result
}


//we are getting all websites in the db for the user and we send those websites to all validators who validate the websites and send the result back to us
setInterval(async () => {
    const websitetoMonitor = await prismaClient.websites.findMany({
        where: {
            disabled: false
        }
    })

    for (const website of websitetoMonitor) {
        availableValidators.forEach(validator => {
            const callbackId = randomUUIDv7();
            console.log(`Sending validation request for website ${website.url} to validator ${validator.validatorId}`);
            validator.socket.send(JSON.stringify({
                type: 'validate',
                data: {
                    url: website.url,
                    callbackId
                }
            }))

            CALLBACKS[callbackId] = async(data: IncomingMessage) => {
                if (data.type === 'validate') {
                    const {validatorId, status, latency, signedMessage} = data.data;
                    const verified = await verifyMessage(
                        `Validation for ${callbackId}, ${website.id}, ${status}, ${latency}, ${validatorId}`,
                        signedMessage,
                        validator.publicKey
                    );
                    if (!verified) {
                        return;
                    }

                    //this is  atransaction i.e we are creating a tick for the website and updating the validator's pending payouts in a single transaction (we want both operations to succeed or neither one of them)
                    await prismaClient.$transaction(async (tx) => {
                        await tx.websiteTick.create({
                            data: {
                                websiteId: website.id,
                                status,
                                latency,
                                validatorId,
                                createdAt: new Date()
                            }
                        })

                        await tx.validator.update({
                            where: {
                                id: validatorId
                            },
                            data: {
                                pendingPayouts: {
                                    increment: COST_PER_VALIDATION
                                }
                            }
                        })
                    })
                }
            }
        })
    }
}, 60*1000)