import { Pool } from "pg";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

pool.on('error', (err) => {
    console.error("[DATABASE] Unexpected error on idle client", err)
})

async function LoadDB() {
    try {
        const client = await pool.connect()
        console.log("[DATABASE] Connected successfully")
        client.release()
    } catch (err) {
        console.error("[DATABASE] Connection failed:", err.message)
        throw err
    }
}

export { LoadDB, pool }