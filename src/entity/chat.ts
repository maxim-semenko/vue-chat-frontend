import {ChatType} from "@/entity/chatType";

export interface Chat {
    id: string,
    title: string,
    keyAES: string,
    isUnreadMessagesExist: boolean,
    countUnreadMessages: number,
    type: ChatType,
}