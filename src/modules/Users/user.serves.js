import userModel from "../../DB/models/user.model.js";
import * as dbService from "../../DB/db.serves.js"
import { Decrypt, Encrypt } from "../../common/middleware/security/encrypt.js";
import { Compare, Hash } from "../../common/middleware/security/hash.js";
import jwt from "jsonwebtoken";
import {OAuth2Client} from'google-auth-library';
import { ProviderEnum } from "../../common/enum/user.enum.js";
import { compare, hash } from "bcrypt";
const client = new OAuth2Client();




//=============signUp===================
export const signUp = async (req, res, next) => {
    console.log(req.files);
  
    const paths = [];
  
    for (const file of req.files?.attachments ?? []) {
      paths.push(file.path);
    }
  
    const profileImage = req.files?.attachment?.[0]?.path;
  
    const {
      FName,LName,email,password,phone,age, gender,} = req.body;
  
    const emailExist = await dbService.findOne({
      model: userModel,
      filter: { email: email.toLowerCase() },
    });
  
    if (emailExist) {
      throw new Error("Email already exist");
    }
  
    const user = await dbService.create({
      model: userModel,
      data: {
        FName,
        LName,
        email: email.toLowerCase(),
        password: await Hash(password),
        age,
        gender,
        profileImage,
        coverImages: paths,
        phone: Encrypt(phone),
      },
    });
  
    return res.status(201).json({
      message: "Done",
      user,
    });
  };
//================signUpWithGmail=============
export const signUpWithGmail = async (req, res, next) => {
        const { idToken } = req.body;

        const decoded = await client.verifyIdToken({
            idToken,
            audience: "67067998770-us3aa8sdffh465lpjk9q2mj9ce2254j5.apps.googleusercontent.com", 
        });
        const {  email, family_name , given_name, email_verified , picture} = decoded.getPayload();
        let user = await dbService.findOne({
            model:userModel,
            filter: {email:email.toLowerCase()}
        })
        if(!user){
            user = await dbService.create({
                model:userModel,
                data:{
                    FName:given_name,
                    LName:family_name,
                    email,
                    isConfirmed:email_verified,
                    profileImage:picture,
                    provider:ProviderEnum.google
                }
            })
        }
        if(user.provider=="system"){
            throw new Error("Login with system only")
        }
        const access_token =jwt.sign({ id: user._id},"GADALLA",{
              expiresIn:60*5
         });
         const refresh_token=jwt.sign({ id: user._id},"ibrahim");
 
 
         return res.status(200).json({ message: "Done", token:{
                access_token ,
                refresh_token
            }})
        
     
    }; 
//==================signIn===================
export const signIn = async (req, res, next) => {
    
        const { email, password } = req.body

        const user = await dbService.findOne({
            model:userModel,
            filter:{ email: email.toLowerCase(), provider: ProviderEnum.system}
        })

        if (!user) {
           throw new Error("email not exist or you can login on your signup",{cause:400})
        }

     /*    if (user.isConfirmed !== true) {
            return res.status(400).json({
                message: "email not confirmed"
            })
        } */

        if (!await Compare(password,user.password)) {
           throw new Error("Invalid password",{cause:404})
        }

        const access_token =jwt.sign({ id: user._id},"GADALLA",{
           /*  expiresIn:60*5,
            noTimestamp:true,
            notBefore:10 */
        });
        const refresh_token=jwt.sign({ id: user._id},"ibrahim");


        return res.status(200).json({ message: "Done", token:{access_token , refresh_token}})
    };
//============getProfile====================
export const getProfile = async (req, res, next) => {
    
        return res.status(200).json({ message: "Done", user:req.user})
    }; 
//===============shareProfile=================
export const shareProfile = async (req, res, next) => {
    const {id}= req.params;

    let user = await dbService.findById({
        model:userModel,
        id,
        options:{password:0,
        profileImage:0}
    });
    if(!user){
        throw new Error("user not exist ",{cause:404})
    }

    user.phone = Decrypt(user.phone)

    return res.status(200).json({ message: "Done", user})
};     
//=================refreshToken===============    
export const refreshToken = async(req,res,next) => {

    const { authorization } = req.headers

    if(!authorization){
        throw new Error("token is not exist",{cause:500});
    }

    const decoded = jwt.verify(authorization,"ibrahim")
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

    const access_token =jwt.sign({ id: user._id},"GADALLA",{
        /*  expiresIn:60*5,
         noTimestamp:true,
         notBefore:10 */
     });

    return res.status(200).json({
        message: "Done",
        access_token
    })



};
//=============UPdateprofile===================
export const updateprofile = async (req, res, next) => {
    
    const { FName,LName,phone,age, gender,} = req.body;

    let updateQuery = {};
    if(FName !== undefined){
        updateQuery.FName = FName;
    };

    if(LName !== undefined){
        updateQuery.LName = LName;
    };
    if(age !== undefined){
        updateQuery.age = age;
    };
    if(phone !== undefined){
        updateQuery.phone = Encrypt(phone)
    };
    if(gender !== undefined){
        updateQuery.gender = gender;
    };

    let user = await dbService.findByIdAndUpdate({
        model:userModel,
        id:req.user._id,
        update:updateQuery,
    })
  
    
    return res.status(201).json({
      message: "Done",
      user,
    });
  };
//=============UPdatepassword===================
export const updatepassword = async (req, res, next) => {
    
    const { oldPassword, newPassword} = req.body;

    if(!await Compare(oldPassword,req.user.password)){
        throw new Error("InValid old password")
    }
    req.user.password = await Hash(newPassword);
    await req.user.save()
    
    return res.status(201).json({
      message: "Done",
      user:req.user,
    });
  }   
       
