import express from "express";
import connectionDb from "./DB/connection.js";
import userRouter from "./modules/Users/user.controller.js";
import cors from "cors"
const app = express();
const port = 3000;

const bootstrap = async()=>{
    app.use(express.json());
    app.use(cors({
        origin :"*"
    }))
    app.get("/",(req,res,next)=>{res.status(200).json({massage : "Hallo on my app.................."})});
    await connectionDb();
    app.use("/users",userRouter);
    
    app.use("{/*demoo}",(req,res,next)=>{
        throw new Error(`Url:${req.originalUrl} with method ${req.method}`,{cause:404})
    });

    app.use((err,req,res,next)=>{
        console.log(err);
        res.status(err.cause||501).json({massage:err.massage,stack:err.stack})
    })


    app.listen(port,()=>console.log(`app run on port ${port}`))

}
export default bootstrap