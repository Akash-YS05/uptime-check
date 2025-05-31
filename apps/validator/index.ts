import { Keypair } from "@solana/web3.js";
import { randomUUIDv7 } from "bun";
import type {OutgoingMessage, SignupOutgoingMessage, ValidateOutgoingMessage} from "common/types"
import nacl from "tweetnacl";
import nacl_util from "tweetnacl-util";

const CALLBACKS: {[callbackId: string]: (data: SignupOutgoingMessage) => void} = {}

let validatorId: string | null = null;

async function main() {
    const keyppair = Keypair.fromSecretKey(
        Uint8Array.from(JSON.parse(process.env.PRIVATE_KEY!))

    );
    const ws = new WebSocket("ws://localhost:8080");

    ws.onmessage = async (event) => {
        const data: OutgoingMessage = JSON.parse(event.data);
        if (data.type === 'signup') {
            CALLBACKS[data.data.callbackId]?.(data.data)
            delete CALLBACKS[data.data.callbackId]
        } else if (data.type === 'validate') {
            await validateHandler(ws, data.data, keyppair);
        }
    }

    ws.onopen = async () => {
        const callbackId = randomUUIDv7();
        CALLBACKS[callbackId] = (data: SignupOutgoingMessage) => {
            validatorId = data.validatorId;
        }

        const signedMessage = await signMessage(`Signed message for ${callbackId}, ${keyppair.publicKey.toBase58()}`, keyppair);

        ws.send(JSON.stringify({
            type: 'signup',
            data: {
                callbackId,
                ip: '127.0.0.1',
                publicKey: keyppair.publicKey,
                signedMessage
            }
        }))
    }
}

async function validateHandler(ws: WebSocket, { url, callbackId, websiteId } : ValidateOutgoingMessage, keypair: Keypair) {
    console.log(`validating ${url} for website ${websiteId}`);
    const startTime = Date.now();
    const signature = await signMessage(`replying to ${callbackId}, ${websiteId}`, keypair);

    try {
        const response = await fetch(url);
        const endTime = Date.now();
        const latency = endTime - startTime;
        const status = response.status;

        console.log(url);
        console.log(status);

        ws.send(JSON.stringify({
            type: 'validate',
            data: {
                callbackId,
                signedMessage: signature,
                status: status >= 200 && status < 300 ? 'Good' : 'Bad',
                latency,
                websiteId,
                validatorId
            }
        }))
    } catch(error) {
        ws.send(JSON.stringify({
            type: 'validate',
            data: {
                callbackId,
                signedMessage: signature,
                status: 'Bad',
                latency: Date.now() - startTime,
                websiteId,
                validatorId
            }
        }))
        console.error(error);
        
    }
    
}

async function signMessage(message: string, keypair: Keypair) {
    const msgBytes = nacl_util.decodeUTF8(message);
    const signature = nacl.sign.detached(msgBytes, keypair.secretKey);

    return JSON.stringify(Array.from(signature));
}

main();

setInterval(async () => {

}, 1000)