import forge from "node-forge";

export class AuthorizationUtil {

    static generateKeyPair(bits: number): Promise<any> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    const keypair = forge.pki.rsa.generateKeyPair({ bits: bits, workers: 2 });
                    const privateKeyPem = forge.pki.privateKeyToPem(keypair.privateKey);
                    const publicKeyPem = forge.pki.publicKeyToPem(keypair.publicKey);
                    resolve({ privateKeyPem, publicKeyPem });
                } catch (error) {
                    reject(error);
                }
            }, 100); // Задержка в 100 миллисекунд для обновления интерфейса
        });
    }

}
