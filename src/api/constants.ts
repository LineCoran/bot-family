const ApiConfig = {
    baseURL: process.env.API_URL || 'http://localhost:8000'
} as const;

console.log('url', ApiConfig.baseURL)

export default ApiConfig;