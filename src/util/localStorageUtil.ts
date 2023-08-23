import { User } from "@/entity/user";

export class LocalStorageUtil {

    static saveAuthorizedUserToStorage(authorizedUser: User) {
        const localStorageState = {
            user: {
                id: authorizedUser.id,
                username: authorizedUser.username,
                firstname: authorizedUser.firstname,
                lastname: authorizedUser.lastname,
                publicKeyPem: authorizedUser.publicKeyPem,
                privateKeyPem: authorizedUser.privateKeyPem,
            },
        };
        localStorage.setItem('vue-chat', JSON.stringify(localStorageState));
    }

    static getAuthorizedUserFromStorage() : User | null {
        const data = localStorage.getItem('vue-chat')
        if (data !== null) {
            const json = JSON.parse(data);
            return json.user
        }
        return null;
    }

    static removeAuthorizedUserFromStorage() {
        localStorage.removeItem('vue-chat');
    }


}
