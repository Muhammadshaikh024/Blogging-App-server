const {getPool} = require('../db/db');

//create a new user
const createUser = async (name,email,hashedPassword,role='user') =>{
    const pool=getPool();

    const result = await pool.query(
        `insert into users (name,email,password,role) values ($1,$2,$3,$4)
        returning id,name,email,role,created_at`,
        [name,email,hashedPassword,role]
    
    );

    return result.rows[0];
}

const findUserByEmail = async (email) =>{
    const pool  = getPool();

    const result = await pool.query(
        `select * from users where email = $1`,[email]
    );

    return result.rows[0];
}

const findUserById = async (id)=>{
    const pool = getPool();

    const result = await pool.query(
        `select id,name,email,role,created_at from users where id = $1`,[id]
    );

    return result.rows[0];
}

// Get all users (admin only)
const getAllUsers = async () => {
    const pool = getPool();
    const result = await pool.query(
        `SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC`
    );
    return result.rows;
}


module.exports = {
    createUser,
    findUserByEmail,
    findUserById,
    getAllUsers
}