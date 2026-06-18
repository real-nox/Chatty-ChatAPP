import { Pool } from "pg"

const pool = new Pool({
    connectionString: process.env.DB_URL,
    ssl: {
        rejectUnauthorized: false,
    }
})

async function LoadDB() {
    const res = await pool.connect()

    if (res) {
        console.log("[DATABASE] Connected successfully")
        res.release()
        return
    }
}

export { LoadDB, pool }