import { PublicKey } from "@solana/web3.js";
import { randomUUIDv7, type ServerWebSocket } from "bun"
import type {IncomingMessage, OutgoingMessage} from "common/types"
import nacl from "tweetnacl";
import nacl_util from "tweetnacl-util";

const availableValidators: {
    validatorId: string,
    socket: ServerWebSocket<unknown>,
    publicKey: string
}[] = [];

const CALLBACKS: { [callbackId: string] : (data: IncomingMessage) => void } = {};   //this is a globally maintained CALLBACK object that stores the callbacks for each callbackId
const COST_PER_VALIDATION = 100;    //in lamports (1 lamport = 0.000000001 SOL)


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
                    `Signed message for ${data.data.callabackId}, ${data.data.publicKey}`,
                    data.data.signedMessage,
                    data.data.publicKey
                );

                if (verified) {
                    
                }
            }
        }
    }

})


async function verifyMessage(message: string, publicKey: string, signature: string) {
    const messageBytes = nacl_util.decodeUTF8(message);
    const result = nacl.sign.detached.verify(
        messageBytes,
        new Uint8Array(JSON.parse(signature)),  //Uint8Array because nacl expects the signature to be in Uint8Array format
        new PublicKey(publicKey).toBytes()
    );

    return result
}