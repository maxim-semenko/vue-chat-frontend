import { EncryptedKeyDto } from "@/api/dto/encryptedKeyDto";

export interface AccountDto {
    id: string,
    username: string,
    password: string,
    firstname?: string,
    lastname?: string,
    encodedPrivateKey: EncryptedKeyDto,
    publicKey: string,
}
