import { axiosApi } from "@/api/http/axios";

export class UtilApi {

    static getServerPublicKey(): Promise<string> {
        return axiosApi.get<string>('utils/public-key')
            .then(response => {
                return response.data;
            })
    }

}
