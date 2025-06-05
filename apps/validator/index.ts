import type { OutgoingMessage, SignupOutgoingMessage, ValidateOutgoingMessage } from "common/types";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";
import nacl_util from "tweetnacl-util";

const CALLBACKS: {[callbackId: string]: (data: SignupOutgoingMessage) => void} = {}

let validatorId: string | null = null;
Bun.serve({
    port: Number(process.env.PORT) || 3000,
    fetch(req) {
      return new Response("Validator is running");
    },
  });
  
async function main() {
    console.log("Starting validator client...");
    
    if (!process.env.PRIVATE_KEY) {
        console.error("PRIVATE_KEY environment variable is required");
        process.exit(1);
    }
    
    const keypair = Keypair.fromSecretKey(
        Uint8Array.from(JSON.parse(process.env.PRIVATE_KEY!))
    );
    
    console.log("Validator public key:", keypair.publicKey.toString());
    
    const ws = new WebSocket("wss://uptime-check.onrender.com");

    ws.onopen = async () => {
        console.log("Connected to hub server");
        
        const callbackId = crypto.randomUUID();
        CALLBACKS[callbackId] = (data: SignupOutgoingMessage) => {
            validatorId = data.validatorId;
            console.log("Signed up with validator ID:", validatorId);
        }
        
        const signedMessage = await signMessage(`Signed message for ${callbackId}, ${keypair.publicKey}`, keypair);
        console.log("Sending signup message");

        ws.send(JSON.stringify({
            type: 'signup',
            data: {
                callbackId,
                ip: '127.0.0.1',
                publicKey: keypair.publicKey.toString(),
                signedMessage,
            },
        }));
    }

    ws.onmessage = async (event) => {
        console.log("Received message:", event.data);
        const data: OutgoingMessage = JSON.parse(event.data);
        
        if (data.type === 'signup') {
            if (CALLBACKS[data.data.callbackId]) {
                //@ts-ignore
                CALLBACKS[data.data.callbackId](data.data);
                delete CALLBACKS[data.data.callbackId];
            }
        } else if (data.type === 'validate') {
            await validateHandler(ws, data.data, keypair);
        }
    }

    ws.onerror = (error) => {
        console.error("WebSocket error:", error);
    }

    ws.onclose = () => {
        console.log("Connection closed. Attempting to reconnect in 5 seconds...");
        setTimeout(() => {
            main(); // Reconnect
        }, 5000);
    }
}

async function validateHandler(ws: WebSocket, { url, callbackId, websiteId }: ValidateOutgoingMessage, keypair: Keypair) {
    console.log(`Validating ${url} (websiteId: ${websiteId})`);
    const startTime = Date.now();
    const signature = await signMessage(`Replying to ${callbackId}`, keypair);

    try {
        // Creating AbortController for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        const response = await fetch(url, {
            signal: controller.signal,
        });
        
        clearTimeout(timeoutId); // Clear timeout if request succeeds
        const endTime = Date.now();
        const latency = endTime - startTime;
        const status = response.status;

        console.log(`${url} - Status: ${status}, Latency: ${latency}ms`);
        
        ws.send(JSON.stringify({
            type: 'validate',
            data: {
                callbackId,
                status: status >= 200 && status < 300 ? 'Good' : 'Bad', 
                latency,
                websiteId,
                validatorId,
                signedMessage: signature,
            },
        }));
    } catch (error) {
        const latency = Date.now() - startTime;
        console.error(`Failed to validate ${url}:`, error);
        
        ws.send(JSON.stringify({
            type: 'validate',
            data: {
                callbackId,
                status: 'Bad',
                latency,
                websiteId,
                validatorId,
                signedMessage: signature,
            },
        }));
    }
}

async function signMessage(message: string, keypair: Keypair) {
    const messageBytes = nacl_util.decodeUTF8(message);
    const signature = nacl.sign.detached(messageBytes, keypair.secretKey);

    return JSON.stringify(Array.from(signature));
}

main();

setInterval(() => {
    console.log(`Validator running. ID: ${validatorId || 'Not registered'}`);
}, 30000);