const {getPool} = require('../db/db');

const createPost = async (userId,title,content) =>{
    const pool  = getPool();

    const result = await pool.query(
        `INSERT INTO posts (user_id, title, content)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [userId, title, content]
    );

    return result.rows[0];
}

const getPostsByUserId = async (userId) =>{
    const pool = getPool();

    const result = await pool.query(
        `select * from posts where user_id = $1 ORDER BY created_at desc`,[userId]
    );

    return result.rows;
}

const getPostById = async(postId) =>{
    const pool=getPool();

    const result = await pool.query(
        `select * from posts where id = $1`,[postId]
    );

    return result.rows[0];
}

const updatePost = async(postId,title,content)=>{
    const pool = getPool();

    const result = await pool.query(
        `update posts set title = $1,content=$2,updated_at=NOW() where id = $3 returning *`,[title,content,postId]
    );

    return result.rows[0];
}

// Delete a post
const deletePost = async (postId) => {
    const pool = getPool();
    const result = await pool.query(
        `DELETE FROM posts WHERE id = $1 RETURNING *`,
        [postId]
    );
    return result.rows[0];
}

const getAllPostsWithUser = async ()=>{
    const pool=getPool();
    const result = await pool.query(
        `select posts.*,users.name as author_name,users.email as author_email from posts
         join users on posts.user_id = users.id
         order by posts.created_at desc`
    );

    return result.rows;
}

module.exports = {
    createPost,
    getPostsByUserId,
    getPostById,
    updatePost,
    deletePost,
    getAllPostsWithUser
}