const {Router}=require("express");
const { userModel } = require("../db");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcryptjs");
const {z}=require("zod");
const {JWT_SECRET_USER}=require("../config");

const userRouter=Router(); 

userRouter.post('/signup',async function(req,res){
    console.log(req.body);
    const requiredObject=z.object({
    email:z.string().min(3).max(100).email(),
    password:z.string().min(3).max(100),
    firstName:z.string().min(3).max(50),
    lastName:z.string().min(3).max(50)
});

const parsedData=requiredObject.safeParse(req.body);
if(!parsedData.success){
    console.log("zod error");
    res.status(400).json({
        message:parsedData.error,
    });
}

try{
    const email= req.body.email;
const password= req.body.password;
const firstName= req.body.firstName;
const lastName= req.body.lastName;
const hashedpassword=await bcrypt.hash(password,5);
console.log(hashedpassword);
await userModel.create({
    email:email,
    password:hashedpassword,
    firstName:firstName,
    lastName:lastName
});
res.json({
    message:"user has signed up"
});
}catch(e){
    res.status(500).json({
        error:e
    });
}
});

userRouter.post('/signin',async function(req,res){
    const email=req.body.email;
    const password=req.body.password;
    console.log(email);
    console.log(password);
    
    const user=await userModel.findOne({
        email
    })
    if(!user){
        res.status(403).json({
            message:"User email does not exist"
        });
    }
    console.log("password from database: "+user.password);
    console.log("plain-text-password"+password);
    const passwordMatch= await bcrypt.compare(password,user.password);
    if(passwordMatch){
    const token=jwt.sign({
        id:user._id.toString()
    },JWT_SECRET_USER);
    res.json({
        token
    });
    }else{
        res.status(403).json({
            message:"Incorrect Creds"
        });
    }
});

userRouter.get('/purchases',function(req,res){
res.json({
message:"userPurchases"
})
});

module.exports={
    userRouter:userRouter
}