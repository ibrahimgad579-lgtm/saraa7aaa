import jwt from "jsonwebtoken";
import userModel from "../../DB/models/user.model.js";
import * as dbService from "../../DB/db.serves.js"


export const authentication = async(req, res ,next )=>{
    const { authorization } = req.headers

    if(!authorization){
        throw new Error("token is not exist",{cause:500});
    }

    const decoded = jwt.verify(authorization,"GADALLA")
    if(!decoded?.id){
        throw new Error("InValid token",{cause:404})
    }
    const user = await dbService.findOne({
        model:userModel,
        filter:{
            _id: decoded.id
        }
    });
    if(!user){
        throw new Error("user not exist",{cause:404})
    };

    req.user = user;

    next()
}