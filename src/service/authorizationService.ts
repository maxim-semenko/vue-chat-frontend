import forge from "node-forge";

export class AuthorizationService {

    static generateKeyPair(): Promise<any> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    const keypair = forge.pki.rsa.generateKeyPair({ bits: 2048, workers: 2 });
                    const privateKeyPem = forge.pki.privateKeyToPem(keypair.privateKey);
                    const publicKeyPem = forge.pki.publicKeyToPem(keypair.publicKey);
                    console.log( privateKeyPem, publicKeyPem )
                    resolve({ privateKeyPem, publicKeyPem });
                } catch (error) {
                    reject(error);
                }
            }, 100); // Задержка в 100 миллисекунд для обновления интерфейса
        });
    }

}