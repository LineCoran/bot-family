import axios from "axios"


const api = axios.create({
    baseURL: 'http://localhost:8000'
})

const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDc1MTQwNjcsImlhdCI6MTc0NzQ3MDg2NywiaWQiOjN9.ewyTswfP8UsGpOshaGDVd97tqmRC23NZ5goXsNkdavM'

// api.interceptors.request()

interface ICreateExpenseBody {
    amount: number;
    description: string;
    category_id: number;
}

export const ApiRequests = {
    expense: {
        createOne: (body: ICreateExpenseBody) => {
            return api.post('/api/expenses', body, { headers: {Authorization: token}})
        }
    }

}

ApiRequests.expense.createOne({ amount: 300, description: 'hello', category_id: 5})
.then(res => console.log(res.data.id))
.catch(err => console.log(err))