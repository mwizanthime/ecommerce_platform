const express = require('express');
const mysql= require('mysql');
const connection= mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'laravel'
});
connection.connect((err)=>{
    if (err) {
        console.error('error');
    }
    else{
        console.log('connected');
    }
});
module.exports=connection;