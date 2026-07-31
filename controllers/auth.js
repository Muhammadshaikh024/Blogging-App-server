const {StatusCodes} = require('http-status-codes');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {createUser,findUserByEmail} = require('../models/User');


const register = async (req,res) =>{
    try {
        const {name,email,password} = req.body;

        if(!name || !email || !password){
            res.status(StatusCodes.BAD_REQUEST).json({msg:"Name,Email and password are required"})
        }

        const existingUser = await findUserByEmail(email);
        if(existingUser){
            res.status(StatusCodes.BAD_REQUEST).json({msg:"User already exists"})
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const user = await createUser(name,email,hashedPassword,'user');

        res.status(StatusCodes.CREATED).json({msg:"User registered successfully",user});
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error:"Something went wrong"});
    }
}

const login = async (req,res) =>{
    try {
        const {email,password} = req.body;

        if(!email || !password){
            res.status(StatusCodes.BAD_REQUEST).json({msg:"Please provide email and password"});
        }

        const user = await findUserByEmail(email);
        if(!user){
            res.status(StatusCodes.BAD_REQUEST).json({msg:"Invalid credentials"});
        }

        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            res.status(StatusCodes.BAD_REQUEST).json({msg:"Invalid password"});
        }

        const token = jwt.sign(
            {id:user.id, role:user.role},
            process.env.JWT_SECRET,
            {expiresIn:process.env.JWT_EXPIRES_IN}
        )

        res.status(StatusCodes.OK).json({
            msg:"Login successful",
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        })

    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:"Something went wrong"});
    }
}


module.exports = {
    login,register
}