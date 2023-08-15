import naclUtil from "tweetnacl-util";
import * as forge from "node-forge";
import { Bytes } from "node-forge";


export class CryptUtil {

    static textToBase64(data: string) {
        return forge.util.encode64(data);
    }

    static base64ToText(data: string) {
        return forge.util.decode64(data);
    }

    static encodeUtf8(data: string) {
        return forge.util.encodeUtf8(data);
    }

    static decodeUtf8(data: string) {
        return forge.util.decodeUtf8(data);
    }

    static base64ToUint8(data: string) {
        return naclUtil.decodeBase64(data);
    }

    static uint8ToBase64(data: Uint8Array) {
        return naclUtil.encodeBase64(data);
    }

    //===============================================RSA================================================================

    static async createKeyPair() {
        const fg = forge;
        return new Promise((resolve, reject) => {
            fg.pki.rsa.generateKeyPair({bits: 2048, workers: -1}, (err: Error, keypair: any) => {
                if (err) {
                    return reject(err);
                }
                resolve(keypair);
            });
        })
    }

    static encryptMessageByRSA(message: string, publicKeyToEncrypt: string, privateKeyToSign: string) {
        const privateKey = forge.pki.privateKeyFromPem(privateKeyToSign);
        const publicKey = forge.pki.publicKeyFromPem(publicKeyToEncrypt)
        const digest = (Math.random() + 1).toString(36).substring(2);

        const md = forge.md.sha1.create();
        md.update(digest, 'utf8');

        return {
            signature: privateKey.sign(md),
            digest: digest,
            data: publicKey.encrypt(message),
        }
    }

    static decryptMessageByRSA(message: string, publicKeyToVerify: string, privateKeyToDecrypt: string, signature: string, digest: string) {
        const privateKey = forge.pki.privateKeyFromPem(privateKeyToDecrypt);
        const publicKey = forge.pki.publicKeyFromPem(publicKeyToVerify)

        try {
            publicKey.verify(digest, signature);
        } catch (e) {
            return "not decrypted"
        }

        return forge.util.decodeUtf8(privateKey.decrypt(message));
    }

    //===============================================AES================================================================

    static generateKeyAES(size: number): Bytes {
        return forge.random.getBytesSync(size);
    }

    static encryptMessageByAES(message: string | Uint8Array, key: string, digest?: string) {
        const cipher = forge.cipher.createCipher('AES-CBC', key);
        const iv = digest || forge.random.getBytesSync(key.length);

        cipher.start({iv: iv});
        cipher.update(forge.util.createBuffer(message));
        cipher.finish();

        return {
            digest: iv,
            data: cipher.output.data,
        };
    }

    static decryptMessageByAES(message: string, key: string, digest: string) {
        const decipher = forge.cipher.createDecipher('AES-CBC', key);
        decipher.start({iv: digest});
        decipher.update(forge.util.createBuffer(message));

        const result = decipher.finish();

        return result ? decipher.output.data : "not decrypted";
    }

}
