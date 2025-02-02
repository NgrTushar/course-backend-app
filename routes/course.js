const {Router}=require('express');
const { userMiddleware } = require('../middleware/user');
const { purchaseModel, courseModel } = require('../db');


const courseRouter=Router();

courseRouter.get('/preview',async function(req,res){

const courses=await courseModel.find({});
    
res.json({
    message:"coursePreview",
    courses
});

});
courseRouter.post('/purchase',userMiddleware,async function(req,res){
const userId=req.userId;
    const courseId=req.body.courseId;
    await purchaseModel.create({
    courseId:courseId,
    userId:userId
})
    res.json({
    message:"purchased a Course"
})
});
module.exports={
    courseRouter:courseRouter
}