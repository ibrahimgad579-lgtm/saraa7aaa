import mongoose from "mongoose";
import { GenderEnum, ProviderEnum, RoleEnum } from "../../common/enum/user.enum.js";

const userSchema = new mongoose.Schema({
    FName:{
        type:String,
        required:true,
        trim:true,
        minLength:2,
        masLenght:5
    },
    LName:{
        type:String,
        required:true,
        trim:true,
        minLength:2,
        masLenght:5
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true
    },
    password:{
        type:String,
        required: function(){
            return this.provider == ProviderEnum.system ? true:false
        },
        trim:true
    },
    age:{
        type:Number,
        required:function(){
            return this.provider == ProviderEnum.system ? true:false
        },
        min:20,
        max:60
    },
    gender:{
        type:String,
        enum:Object.values(GenderEnum),
        default:GenderEnum.male
    },
    profileImage:String,
    coverImage:[String],
    phone:String,
    role:{
        type:String,
        enum: Object.values(RoleEnum),
        default: RoleEnum.user
    },
    provider:{
        type:String,
        enum: Object.values(ProviderEnum),
        default:ProviderEnum.system
    },
    isConfirmed:{
        type:Boolean,
        default:false
    }
    

},{
    timeseries: true,
    statics:true,
    strictQuery:true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});

const userModel = mongoose.models.User || mongoose.model("User",userSchema);
export default userModel;