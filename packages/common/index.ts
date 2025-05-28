//incoming - message coming to the websocket server
//outgoing - message coming from websocket server

export interface SignupIncomingMessage {
    ip: string;
    publicKey :string;
    signedMessage: string;
    callabackId: string
}

export interface ValidateIncomingMessage {
    callbackId: string;
    signedMessage: string;
    status: 'Good' | 'Bad';
    latency: number;
    websiteId: string;
    validatorId: string;
}

export interface SignupOutgoingMessage {
    validatorId: string;
    callbackId: string;
}

export interface ValidateOutgoingMessage {
    url: string;
    callbackId: string;
    websiteId: string;
}

export type IncomingMessage = {
    type: 'singup'
    data: SignupIncomingMessage
} | {
    type: 'validate'
    data: ValidateIncomingMessage
}

export type OutgoingMessage = {
    type: 'signup'
    data: SignupOutgoingMessage
} | {
    type: 'validate'
    data: ValidateOutgoingMessage
}

