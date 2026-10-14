import mongoose from "mongoose";



const connectionDb = async()=>{
    await mongoose.connect('mongodb://127.0.0.1:27017/sara7aa')
    .then(()=>{
        console.log('Connected successfully to server');
    })
    .catch((err)=>{
        console.log(`error connecting to Mongodb:`,err)
    })
}
export default connectionDb