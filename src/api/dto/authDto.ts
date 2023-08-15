export interface AuthDto {
    username: string,
    password: string,
    firstname?: string,
    lastname?: string,
    publicKey: string,
    encodedPrivateKey: string,
    encodedEncryptionSecurityKey: string,
}
