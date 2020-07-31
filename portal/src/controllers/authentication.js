const express = require('express');
const router = express.Router();
const User = require("../models/user");
const Question = require("../models/question");
const jwt =  require('jsonwebtoken')
const config = require('./config');
const verifyToken = require("./verifyToken");
const path = require("path");
const cookieParser = require("cookie-parser");


// Para que el usuario se registre
router.post("/register",async (req,res,next)=>{
    const {name,bDay,email,pass} = req.body
   
    const user = new User({
        name,
        bDay,
        email,
        pass
    });
    user.pass = await user.encryptPassword(user.pass);
    //lo guarda el la DB
    await user.save(function(err){
        if(err){
            if (err.name === 'MongoError' && err.code === 11000) {
                // Duplicate username
                return res.status(422).send({ succes: false, message: 'Ya existe un usuarion con ese correo' });
            }
        
              // Some other error
              return res.status(422).send(err);
        }
        const token =  jwt.sign({id:user._id , isAdmin:user.supUs, name: user.name},config.secret,{expiresIn: 60*60*24});
        //res.json({auth:true, token});
        res.cookie('token', token , {
            httpOnly:true,
        });
        res.redirect('/quiz');
    });
})

// Para que el usuario haga login
router.post("/login",async (req,res,next)=>{
    const {email,pass} = req.body;

    const user = await User.findOne({email:email});
    if (!user){
        return res.status(404).send("No se encontró al usuario");
    }
    else {
        const valid =  await user.validatePassword(pass)
        if (!valid){
            return res.status(401).json({auth:false,token:null});
        }
        else {
            const token =  jwt.sign({id:user._id , isAdmin:user.supUs, name: user.name}, config.secret,{
            expiresIn: 60*60*24
        })
        res.cookie('token', token , {
            httpOnly:true,
        });
        res.redirect('/quiz');
        }
    }
})

router.get('/quiz',verifyToken, async (req,res,next) =>{
    userName = req.userName;
    userAdmin = req.userAdmin;
    const questions = await Question.find();
    res.render('quiz', {userName, userAdmin, questions});
})

router.get('/config',verifyToken, async (req,res,next) =>{
    userAdmin = req.userAdmin;
    if(userAdmin == true){
        const questions = await Question.find();
        res.render('config_questions', {questions});
    }
})

router.get("/profile",verifyToken, async (req,res,next)=>{
     
     const user = await User.findById(req.userId);
     if(!user){
         return res.status(404).send("No user found");
     }
     else {
         res.json(user);
     }
    
})

router.post('/add',verifyToken, async (req,res,next) =>{
    const quest = req.body.quest; 
    const options = [req.body.A, req.body.B, req.body.C, req.body.D];
    const ans = req.body.ans;
    const question = new Question({quest, options, ans});
    await question.save();
    res.redirect('/config');
})




router.get('/edit/:id',verifyToken, async (req,res,next) =>{
    const question = await Question.findById(req.params.id);
    res.render('edit', {question});
})

router.post('/edit/:id',verifyToken, async(req,res) =>{
    let id = req.params.id;
    const quest = req.body.quest; 
    const options = [req.body.A, req.body.B, req.body.C, req.body.D];
    const ans = req.body.ans;
    await Question.updateOne({_id: id},{quest, options, ans});
    res.redirect('/config');
})


router.get('/delete/:id',  async (req,res) =>{
    var id = req.params.id;
    await Question.remove({_id: id});
    res.redirect('/config');
})


router.post('/checkAns', async (req,res,next) =>{
    console.log(req.body);
   
    res.send("SCORE");
})


router.get("/logout", (req,res)=>{
     res.cookie("token","",{
       maxAge:-1
     }) ;
     res.redirect("/");
})

router.get("*",(req,res)=>{
    res.redirect("/quiz");
})

module.exports = router;