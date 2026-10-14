import { hashSync,compareSync } from "bcrypt";


export const Hash = async(text,salt_rounds = 12) =>{
    return hashSync(text,salt_rounds)
};
export const Compare = async(text, cipherText)=>{
    return compareSync(text,cipherText)
}