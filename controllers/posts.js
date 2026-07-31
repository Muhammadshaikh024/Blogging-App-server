const {
    createPost,
    getPostsByUserId,
    getPostById,
    updatePost,
    deletePost,
    getAllPostsWithUser
} = require('../models/Posts');
const {StatusCodes} = require('http-status-codes')

const create = async(req,res) =>{
    try {
        const {title,content} = req.body;
        const userId = req.user.id;

        if(!title || !content){
            res.status(StatusCodes.BAD_REQUEST).json({msg:"Title and content are required"})
        }

        const post = await createPost(userId,title,content);
        res.status(StatusCodes.CREATED).json({msg:"Post created",post})
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error:"Something went wrong"})
    }
}

const getMyPosts = async (req,res)=>{
    try {
        const userId = req.user.id;
        const posts = await getPostsByUserId(userId);
        res.status(StatusCodes.OK).json({posts})
    } catch (error) {
        console.log(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error:"Something went wrong"})
    }
}

const update = async (req,res)=>{
    try {
        const {id} = req.params;
        const {title,content} = req.body;
        const userId = req.user.id;

        if(!title || !content){
            res.status(StatusCodes.BAD_REQUEST).json({msg:"Title and content are required"})
        }

        const post = await getPostById(id);
        if(!post){
            res.status(StatusCodes.NOT_FOUND).json({msg: `Post with id: ${id} does not exist`})
        }

        if(post.user_id!==userId){
            res.status(StatusCodes.FORBIDDEN).json({msg:"Access not granted"})
        }

        const updatedPost = await updatePost(id,title,content);
        res.status(StatusCodes.OK).json({msg: "Post updated",post:updatedPost})    
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error:"Something went wrong"})
    }

    
}

const remove = async (req,res)=>{
    try {
        const {id} = req.params;
        const userId = req.user.id;

        const post = await getPostById(id);
        if(!post){
            res.status(StatusCodes.NOT_FOUND).json({error:'Post not found'});
        }

        if(post.user_id !== userId){
            res.status(StatusCodes.FORBIDDEN).json({error: 'Access not granted'})
        }

        await deletePost(id);
        res.status(StatusCodes.OK).json({msg:'Post deleted'})

    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error:"Something went wrong"})
    }
}


module.exports = {create,getMyPosts,update,remove}