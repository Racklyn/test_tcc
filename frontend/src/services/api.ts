import axios from 'axios'

const WEB_SERVICE_PORT = import.meta.env.WEB_SERVICE_PORT
const BASE_URL = `http://localhost:${WEB_SERVICE_PORT}` //TODO: verificar se funciona no Docker

const api = axios.create({
    baseURL: BASE_URL,
})

export default api