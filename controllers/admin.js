const {StatusCodes} = require('http-status-codes');

const {getAllUsers,findUserById} = require('../models/User');
const {getPostsByUserId,getAllPostsWithUser} = require('../models/Posts');


const listUsers = async (req,res)=>{
    try {
        const users = await getAllUsers();
        res.status(StatusCodes.OK).json({users,count:users.length})
    } catch (error) {
        console.error("Error in listing users",error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error:"Something went wrong"})
    }

}

//Getting posts of a specific user
const getUserPosts = async(req,res)=>{
    try {
        const {userId} = req.params;
        
        const user = await findUserById(userId);
        if(!user){
            res.status(StatusCodes.NOT_FOUND).json({error: "User not found"});
        }

        const posts = await getPostsByUserId(userId);
        res.status(StatusCodes.OK).json({user,posts});

    } catch (error) {
        console.error("Get user posts error: ",error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error:"Something went wrong"});
    }
}

//get every post on the platform with author info attached
const listAllPosts = async(req,res) =>{
    try {
        const posts = await getAllPostsWithUser();
        res.status(StatusCodes.OK).json({posts});
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error:"something went wrong"})
    }
}

module.exports = {
    listUsers,
    getUserPosts,
    listAllPosts
}
