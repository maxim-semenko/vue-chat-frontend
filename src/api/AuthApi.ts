import {AuthDto} from "@/dto/authDto";
import {axiosApi} from "@/http/axios";

export class AuthApi {

    static login(request: AuthDto): Promise<any> {
        return axiosApi.post<any>('auth/login', request)
            .then(response => {
                return response.data;
            })
    }

    static register(request: AuthDto): Promise<any> {
        return axiosApi.post<any>('auth/register', request)
            .then(response => {
                return response.data;
            })
    }

}