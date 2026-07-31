const { Pool } = require('pg');
require('dotenv').config();

let pool;
const connectDB = (URL) => {
    if(pool) return pool;
    
    pool = new Pool({
        connectionString: URL,
        ssl: { rejectUnauthorized: false }, // required by many cloud providers
    });

    pool.on("error", (err) => {
        console.error("Unexpected PG client error", err);
    });

    return pool;
}

const getPool = ()=>{
    if(!pool){
        throw new Error("Pool not initialized. Call connectDB first");
    }

    return pool;
}

module.exports = {getPool, connectDB };