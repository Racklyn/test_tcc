import axios from 'axios'

const AI_SERVICE_PORT = import.meta.env.AI_SERVICE_PORT
const BASE_URL = `http://localhost:${AI_SERVICE_PORT}`

const AIApi = axios.create({
    baseURL: BASE_URL,
})

export default AIApi