import axios from "axios"

import ApiConfig from "../constants";

const publicApi = axios.create({ baseURL: ApiConfig.baseURL });

interface IUserBody {
    username: string;
    password: string;
}

interface IGetIdByUsername {
    username: string;
}

export const PublicApi = {
    user: {
        signUp: (data: IUserBody) => publicApi.post('/auth/sign-up', data),
        signIn: (data: IUserBody) => publicApi.post('/auth/sign-in', data),
        getIdByUsername: (data: IGetIdByUsername) => publicApi.post('/auth/exist', data)
    }
}