const express = require("express");
const { UserModel } = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userRouter = express.Router();

// To add/register a new user

userRouter.post("/register", (req, res)=>{
    const {username, email, password, city, age, gender} = req.body
    try {
        bcrypt.hash(password, 5, async(err, hash)=>{
            if(err){
                res.status(400).send({
                    error : err
                })
            }
            else{
                const user = new UserModel({username, email, password:hash, city, age, gender})
                await user.save();
                res.status(200).send({
                    msg : "New user has been registered successfully"
                })
            }
        })
    } catch (err) {
        res.status(400).send({
            error : err
        })
    }
})

// To login a user

userRouter.post("/login", async(req, res)=>{
    const {email, password} = req.body
    try {
        const user = await UserModel.findOne({email})
        bcrypt.compare(password, user.password, (err, result)=>{
            if(result){
                const token = jwt.sign({userID : user._id}, "rajat", {expiresIn : "7d"})
                res.status(200).send({
                    msg : "Login Successfull",
                    accessToken : token
                })
                
            }
            else{
                res.status(400).send({
                    error : err
                })
            }
        })
    } catch (err) {
        res.status(400).send({
            error : err
        })
    }
})

module.exports = {
    userRouter
}
