import {AuthDto} from "@/api/dto/authDto";
import {axiosApi} from "@/api/http/axios";
import {AccountDto} from "@/api/dto/accountDto";

export class AuthApi {

    static login(request: AuthDto): Promise<any> {
        return axiosApi.post<any>('auth/login', request)
            .then(response => {
                return response.data;
            })
    }

    static register(request: AuthDto): Promise<AccountDto> {
        return axiosApi.post<AccountDto>('auth/register', request)
            .then(response => {
                return response.data;
            })
    }

}
