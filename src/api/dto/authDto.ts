import { EncryptedKeyDto } from "@/api/dto/encryptedKeyDto";

export interface AuthDto {
    username: string,
    password: string,
    firstname?: string,
    lastname?: string,
    publicKey?: string,
    keyAes: EncryptedKeyDto,
    keyRsa: EncryptedKeyDto,
}
