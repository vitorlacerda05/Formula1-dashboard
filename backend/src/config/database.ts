import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'postgres',
  password: process.env.DB_PASSWORD || 'admin',
  port: parseInt(process.env.DB_PORT || '5432'),
  ssl: process.env.DB_SSL_ENABLED === 'true' ? {
    rejectUnauthorized: false,
  } : false,
  statement_timeout: parseInt(process.env.DB_STATEMENT_TIMEOUT || '10000')
})

pool.on('connect', (client) => {
  const schema = process.env.DB_SCHEMA || 'public'
  client.query(`SET search_path TO ${schema}`)
})

export default pool 