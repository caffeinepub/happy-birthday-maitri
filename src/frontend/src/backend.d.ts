import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Message {
    author: string;
    message: string;
}
export interface MessageInput {
    text: string;
    author: string;
}
export interface backendInterface {
    deleteMessage(): Promise<void>;
    getAllMessages(): Promise<Array<Message>>;
    getMessageByAuthor(author: Principal): Promise<Message>;
    submitMessage(input: MessageInput): Promise<void>;
}
