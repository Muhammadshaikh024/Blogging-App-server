require('dotenv').config()
const express = require('express');
const app = express();
const {connectDB} = require('./db/db');
const cors = require('cors');

app.use(express.json());
app.use(cors({
  origin: 'https://blogging-app-client-lyart.vercel.app',
  credentials:true
}));
//routers
const authRouter = require('./routes/auth');
const postsRouter = require('./routes/posts');
const adminRouter = require('./routes/admin');
//middleware
const {authenticate,authorizeAdmin}=require('./middleware/auth');
// routes
app.use('/api/v1/auth',authRouter)
app.use('/api/v1/admin',authenticate,authorizeAdmin,adminRouter)
app.use('/api/v1/posts',authenticate,postsRouter);



const port=process.env.PORT;


const start = () =>{
    try {
      connectDB(process.env.DATABASE_URL);
      app.listen(port,()=>{
        console.log(`server is listening on port ${port}`);
      })  
    } catch (error){
      console.error(error);
    }
}


start();


