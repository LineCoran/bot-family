// @ts-nocheck
import axios, { AxiosInstance } from "axios"
import ApiConfig from "../constants";
import { Context } from "telegraf";

const api = axios.create({ baseURL: ApiConfig.baseURL });

interface ICreateExpenseBody {
    amount: number;
    description: string;
    category_id: number;
}

export class AuthApi {
    private token = '';
    private api = null as AxiosInstance;
  
    constructor(ctx: Context) {
        this.token = ctx.session.user?.token;
        if (!this.token) throw Error('no auth')

        this.api = axios.create({ baseURL: ApiConfig.baseURL });

      this.api.interceptors.request.use((config) => {
        config.headers.Authorization = `Bearer ${this.token}`;
        return config;
    });
    }

    expense = {
        createOne: (body: ICreateExpenseBody) => this.api.post('/api/expenses', body)
    };

    CategoryService = {
        getAll: () => this.api.get('/api/category'),
        createOne: (name: string) => this.api.post('/api/category', { category_name: name})
    }
  }