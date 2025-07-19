const express= require('express');
const app= express();
const port= 5000;
const db=require('./Dbconnection');
app.use(express.json());
app.get('/users',(req,res) => {
    db.query('select * from  users ',(err,results)=>{
        if(err){
            res.send('query error!',err);
        }
        else if(results.length === 0){
            res.json({result:'no data found'});
        }
        else{
            res.json({results});
        }
    });
});
app.delete('/users/:id',(req,res)=>{
    // const {name, email}=req.body;
    const sid= req.params.id;
    db.query('select * from users where id=?',[sid],(err,results)=>{
        if (err) {
            res.send('query error');
        }
        else if(results.length===0) {
            res.status(404).json('id not found');
        }else
    
    db.query('delete from users where id=?',[sid],(err,results)=>{
        if (err) {
            res.send('query error');
        } 
        
        else{
            res.send('users deleted successfully')
        }
    });});
    
});
app.post('/users/',(req,res)=>{
    const {name, email}=req.body;
db.query('insert into users(name,email) values(?,?)',[name,email],(err,results)=>{
    if (err) {
        res.json("query error");
    }
    else{
        res.json("inserted");
    }
});});
app.use((req,res)=>{
    res.status(404).json({Invalid:"Invalid API"});
});
app.listen(port,()=>{
    console.log("server is running!")
});