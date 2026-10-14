import joi from "joi"
import { generalRules } from "../../common/utils/generalRules.js"

       
  export  const SignUpSchema = {
    body:joi.object({
        FName:joi.string().required(),
        LName:joi.string().required(),
        email:generalRules.email.required(),
        password:generalRules.password.required(),
        age:joi.number().required(),
        gender:joi.string().valid("male","female").required(),
        phone:joi.string().required()
    }).required(),

    //file: generalRules.file.required(),
    files:joi.object({
      attachment: joi.array().items(generalRules.file.required()).required(),
      attachments: joi.array().items(generalRules.file.required()).required(),
    }).required()
   
  };

  export const signInSchema = {
    body: joi.object({
      email:generalRules.email.required(),
      password:generalRules.password.required()
    })
  };

  
export const refreshTokenSchema = {
    headers: joi.object({
        authorization: joi.string().required(),
        connection: joi.string(),
        "accept-encoding": joi.string(),
        accept: joi.string(),
        "user-agent": joi.string(),
        host: joi.string(),
        "content-length": joi.string(),
        "postman-token": joi.string(),
        "cache-control": joi.string(),
    })
}
export const shareProfileSchema = {
  params:joi.object({
    id:generalRules.id.required()
  })
};
export  const updateprofileSchema = {
  body:joi.object({
      FName:joi.string(),
      LName:joi.string(),
      age:joi.number(),
      gender:joi.string().valid("male","female"),
      phone:joi.string()
  }).required()
};

export const updatePasswordSchema = {
  body: joi.object({
    oldPassword:generalRules.password.required(),
    newPassword:generalRules.password.required()
  })
};