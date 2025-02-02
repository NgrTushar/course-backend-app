const {Router}= require("express");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcryptjs")
const {adminModel, courseModel}=require("../db")
const {z}=require("zod");
const { JWT_SECRET_ADMIN }=require("../config");
const {adminMiddleware}=require("../middleware/admin")

const adminRouter=Router();


adminRouter.post('/signup',async function(req,res){
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
await adminModel.create({
    email:email,
    password:hashedpassword,
    firstName:firstName,
    lastName:lastName
});
res.json({
    message:"admin account signed up"
});
}catch(e){
    res.status(500).json({
        error:e
    });
}

});
adminRouter.post('/signin',async function(req,res){
const email=req.body.email;
const password=req.body.password;
console.log(email);
console.log(password);

const admin=await adminModel.findOne({
    email
})
if(!admin){
    res.status(403).json({
        message:"User email does not exist"
    });
}
console.log("password from database: "+admin.password);
console.log("plain-text-password"+password);
const passwordMatch= await bcrypt.compare(password,admin.password);
if(passwordMatch){
const token=jwt.sign({
    id:admin._id.toString()
},JWT_SECRET_ADMIN);
res.json({
    token
});
}else{
    res.status(403).json({
        message:"Incorrect Creds"
    });
}
});

adminRouter.post('/course',adminMiddleware, async function(req,res){
const adminId=req.userId;
const {title,description,imageUrl,price} =req.body;
const course= await courseModel.create({
    title,
    description,
    price,
    imageUrl,
    creatorId:adminId
})
res.json({
    message:"course created",
    courseId:course._id

})
});

adminRouter.put('/course',adminMiddleware,async function(req,res){
const adminId=req.userId;
    const title=req.body.title;
    const description=req.body.description;
    const price=req.body.price
    const imageUrl=req.body.imageUrl
    const courseId=req.body.courseId
    const course= await courseModel.updateOne({
        _id: courseId,
        creatorId:adminId
    },{
        title,
        description,
        price,
        imageUrl
    });
    res.json({
        message:"course updated",
        course:course
    });

});

adminRouter.get('/bulk',adminMiddleware,async function(req,res){
const adminId=req.userId;
const course=await courseModel.find({
creatorId:adminId
});
res.json({
    course
})
});
module.exports={
    adminRouter:adminRouter
}

