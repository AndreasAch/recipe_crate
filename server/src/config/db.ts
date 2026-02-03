import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const useLocal = process.env.USE_LOCAL_DB === "true";

const connectionString = useLocal ? process.env.LOCAL_DATABASE_URL : process.env.DATABASE_URL;

console.log(`🔌 Database: Connecting to ${useLocal ? "LOCAL" : "PRODUCTION"} instance`);

const pool = new Pool({
	connectionString,
	ssl: useLocal ? false : { rejectUnauthorized: false },
});

export default pool;
