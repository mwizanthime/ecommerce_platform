const express= require('express');
const mysql= require('mysql');
const cors=require('cors');
const app=express();
const session=require('express-session');
app.use(cors({
    origin:'http://localhost:3000',
    credentials:true
}));
app.use(express.json());
const db=mysql.createConnection({
    host: 'localhost',
    user:'root',
    password:'',
    database:'elearning'
});


db.connect((err)=>{
    if(err){
        console.error(err);
    }else{
        console.log('connected successfully');
    }
})

//session


app.use(session({
    secret:'123',
    resave:false,
    saveUninitialized:false,
    cookie:{maxAge:3600000,httpOnly:true,secure:false}
}));


//login
app.post('/login',(req,res)=>{
    const {username,password}=req.body;
    db.query('select* from users where username=?',[username],(err,result)=>{
        if(err){
            console.error(err);
        }
        else{
        if(result.length===0){
            return res.json({message:'user not found!'});
        }
        else{
            const user=result[0];
            if(user.password===password){
                req.session.user={username:user.username}
                return res.json({message:'user logged in',username:req.session.user});
            }
            else{
            return res.json({message:'invalid password'});
        }
        }
        }
    });
});




//logout

app.post('/logout',(req,res)=>{
    req.session.destroy((err)=>{
        if(err){
            return res.json({message:'logout failed'});
    }else{
        res.json({message:'logout successful'});
    }
});
});

//dashboard

app.get('/dashboard',(req,res)=>{
    if(req.session.user){
        res.json(req.session.user);
    }else{
        res.json({message:'not logged in'});
    }
});



app.post('/create-account',(req,res)=>{
    const {username,password}=req.body;
    db.query('select * from users where username=?',[username],(err,result)=>{
        if(err){
            console.error(err);
            return res.status(500).json({message:'database error'});
        }
        if(result.length>0){
            return res.status(409).json({message:'username already taken'});
        }
        db.query('insert into users(username,password) values(?,?)',[username,password],(err,result)=>{
            if (err) {
                console.error(err);
                return res.status(500).json({message:'database error'});
            }
            return res.status(200).json({message:'user account created'});  
        });
    });
});

app.get('/get-courses',(req,res)=>{
    db.query('select * from courses',(err,results)=>{
        if(err){
            return res.status(500).json({message:'error fetching courses'});
        }
        return res.status(200).json(results);
    });
});

app.get('/students',(req,res)=>{
    db.query('select * from students',(err,results)=>{
        if(err){
            return res.status(500).json({message:'error fetching courses'});
        }
        return res.status(200).json(results);
    });
});

app.post('/add-student',(req,res)=>{
    const {name,age,c_id}=req.body;
    db.query('select * from students where name=?',[name],(err,result)=>{
        if (err) throw err;
        if (result.length>0){
            return res.status(500).json({message:'student with this name already exists'});
        }
        db.query('insert into students(name,age,c_id) values(?,?,?)',[name,age,c_id],(err,result)=>{
        if (err) throw err;
        return res.status(200).json({message:'student added successfully'});
        });
    });
});

app.put('/edit-student',(req,res)=>{
    const {id}=req.params;
    const {name,age,c_id}=req.body;
    db.query('update students set name=?,age=?,c_id where id=?',[name,age,c_id,id],(err,result)=>{
        if (err) throw err;
        return res.json({message:'student updated successfully'});
    });
});

app.delete('/delete-student/:id',(req,res)=>{
    const {id}=req.params;
    db.query('delete from students where id=?',[id],(err,reslut)=>{
        if(err) throw err;
        return res.json({message:'student deleted successfully'});
    });
});


app.post('/forgot-password',(req,res)=>{
    const {username,newPassword}= req.body;
    db.query('select * from users where username=?',[username],(err,result)=>{
        if(err){
            console.error(err);
            return res.json({message:'database error'}); 
        }
        if(result.length===0){
        return res.status(404).json({message:'username not fund'});
        }
        db.query('update users set password=? where username=?',[newPassword,username],(err,result)=>{
            if(err) throw err;
            return res.json({message:'password reset successfully'});
        });
    });
});

app.listen(5000,()=>{
    console.log(`server is running on 5000 port`)
})