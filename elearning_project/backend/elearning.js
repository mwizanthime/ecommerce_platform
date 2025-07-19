const express = require('express');
const mysql= require('mysql');
const port= 5000;
const app = express();
const cors=require('cors');
// const multer=require('multer');
const session=require('express-session');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.json());
app.use(cors({
    origin:'http://localhost:3000',
    credentials:true
}));
const db= mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'elearningProject'
});
db.connect((err)=>{
    if (err) {
        console.log('failed to connect');
    }
    else{
        console.log('connected');
    }
});



//session


app.use(session({
    secret:'123',
    resave:false,
    saveUninitialized:false,
    cookie:{maxAge:30000,httpOnly:true,secure:false}
}));


//upload file

// const imageUploadPath = 'C:/xampp/htdocs/php/react/my-app/src/uploads';

// const storage = multer.diskStorage({
//   destination: function(req, file, cb) {
//     cb(null, imageUploadPath)
//   },
//   filename: function(req, file, cb) {
//     cb(null, `${file.fieldname}_dateVal_${Date.now()}_${file.originalname}`)
//   }
// })

// const profile = multer({storage: storage})


// app.post('/add-student',profile.array('my-profile'),(req,res)=>{
app.post('/add-student',(req,res)=>{
    const {studentName,studentEmail,studentPassword,studentBio,studentGender,courseId}=req.body;
    db.query('select * from students where studentName=?',[studentName],(err,result)=>{
        if (err){
            return res.json({message:'query error'});
        } 
        if (result.length>0){
            return res.status(500).json({message:'student with this name already exists'});
        }else{
        db.query('insert into students(studentName,studentEmail,studentPassword,studentBio,studentProfile,studentGender,courseId) values(?,?,?,?,?,?)',[studentName,studentEmail,studentPassword,studentBio,studentGender,courseId],(err,result)=>{
        if (err){
            return res.status(500).json({message:'error to insert'});
        }else{
        return res.status(200).json({message:'student added successfully'});
    }
        });
    }
    });
});


app.get('/get-courses',(req,res)=>{
    db.query('select * from courses',(err,results)=>{
        if(err){
            return res.status(500).json({message:'error fetching courses'});
        }
        return res.json({message:results});
    });
});



//login
app.post('/login',(req,res)=>{
    const {studentEmail,studentPassword}=req.body;
    db.query('select* from users where studentEmail=?',[studentEmail],(err,result)=>{
        if(err){
            console.error(err);
        }
        else{
        if(result.length===0){
            return res.json({message:'email not found!'});
        }
        else{
            const student=result[0];
            if(student.studentPassword===studentPassword){
                req.session.student={email:student.email}
                return res.json({message:'student logged in',email:req.session.student});
            }
            else{
            return res.json({message:'invalid password'});
        }
        }
        }
    });
});



app.listen(port,()=>{
    console.log(`backend is running on ${port} port`)
})
