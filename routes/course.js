const {Router}=require('express');


const courseRouter=Router();

courseRouter.post('/preview',function(req,res){
res.json({
    message:"coursePreview"
})
});
courseRouter.get('/purchase',function(req,res){
res.json({
    message:"purchaseCourse"
})
});
module.exports={
    courseRouter:courseRouter
}