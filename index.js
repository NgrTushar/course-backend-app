const express=require('express');
const mongoose=require('mongoose');
const {userRouter}=require('./routes/user');
const {courseRouter}= require('./routes/course');
const {adminRouter}=require('./routes/admin');
const app=express();
app.use(express.json());

app.use('/user',userRouter);
app.use('/course',courseRouter);
app.use('/admin',adminRouter);

async function main(){
 await mongoose.connect("mongodb+srv://admin:AeyvWnUFeB9gaNFP@cluster0.g7e8q.mongodb.net/course-app");
app.listen(3000);
console.log("Listening to port 3000");
}
main();