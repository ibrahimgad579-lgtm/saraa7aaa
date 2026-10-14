import { Router } from "express";
import { getProfile, shareProfile, signIn, signUp ,signUpWithGmail,refreshToken, updateprofile, updatepassword} from "./user.serves.js";
import { authentication } from "../../common/middleware/authentication.js";
import { authorization } from "../../common/middleware/authorization.js";
import { RoleEnum } from "../../common/enum/user.enum.js";
import { Validation } from "../../common/middleware/validation.js";
import { SignUpSchema,refreshTokenSchema,shareProfileSchema,updateprofileSchema, signInSchema, updatePasswordSchema, } from "./user.validation.js";
import { multerLocal } from "../../common/middleware/multer.js";

const userRouter= Router();
userRouter.post("/signUp",
multerLocal({customPath:"admins",customTypes:['image/jpeg']}).fields([
    {name:"attachments",maxCount:2},
    {name:"attachment",maxCount:1}
]),
//.single("image"),
Validation(SignUpSchema) ,
signUp);
userRouter.post("/signUp/gmail",signUpWithGmail);
userRouter.post("/signin",Validation(signInSchema),signIn);
userRouter.get("/profile",authentication,authorization(Object.values(RoleEnum)),getProfile);
userRouter.get("/shaer-profile/:id",Validation(shareProfileSchema),shareProfile);
userRouter.post("/refresh-token",Validation(refreshTokenSchema),refreshToken);
userRouter.patch("/update-profile",Validation(updateprofileSchema),authentication,updateprofile);
userRouter.patch("/update-password",Validation(updatePasswordSchema),authentication,updatepassword);
export default userRouter;