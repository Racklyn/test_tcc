import axios from 'axios'

const SCRAPER_SERVICE_PORT = import.meta.env.SCRAPER_SERVICE_PORT
const BASE_URL = `http://localhost:${SCRAPER_SERVICE_PORT}`

const ScraperApi = axios.create({
    baseURL: BASE_URL,
})

export default ScraperApi