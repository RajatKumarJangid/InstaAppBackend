const express = require("express");
const { PictureModel } = require("../models/picture.model");
const { auth } = require("../middlewares/auth.middleware");
const { userRouter } = require("./user.routes");

const pictureRouter = express.Router();

// To add a picture

pictureRouter.post("/", auth, async(req, res)=>{
    const {quote, photo, device, commentsCount} = req.body;
    const userID = req.body.userID;
    try {
        const picture = new PictureModel({quote, photo, device, commentsCount, userID})
        await picture.save();
        res.status(200).send({
            msg : "Picture has been added successfully"
        })
    } catch (err) {
        res.status(400).send({
            error : err
        })
    }
})

// To view their picture

pictureRouter.get("/view/:id", auth, async(req, res)=>{
    const {id} = req.params
    try {
        const picture = await PictureModel.findOne({_id : id})
        res.status(200).send({
            msg : "Here are your pictures",
            picture
        })
    } catch (err) {
        res.status(400).send({
            error : err
        })
    }
})

// To view their entire album

pictureRouter.get("/view", auth, async(req, res)=>{
    try {
        const picture = await PictureModel.find({userID : req.body.userID})
        res.status(200).send({
            msg : "Here are all your pictures",
            picture
        })
    } catch (err) {
        res.status(400).send({
            error : err
        })
    }
})

// To edit their picture

pictureRouter.patch("/:id", auth, async(req, res)=>{
    const { id } = req.params
    try {
        const picture = await PictureModel.findOne({_id : id})
        if(picture.userID === req.body.userID){
           await PictureModel.findByIdAndUpdate({_id : id}, req.body)
           res.status(200).send({
            msg : "Updation successfull"
           })
        }
        else{
            res.status(400).send({
                msg : "You are not authorized to update this post"
            })
        }
    } catch (err) {
        res.status(400).send({
            error : err
        })
    }
})

// To delete a picture

pictureRouter.delete("/:id", auth, async(req, res)=>{
    const { id } = req.params
    try {
        const picture = await PictureModel.findOne({_id : id})
        if(picture.userID === req.body.userID){
            await PictureModel.findByIdAndDelete({_id : id})
            res.status(200).send({
                msg : "Deletion Successfull"
            })
        }
        else{
            res.status(400).send({
                msg : "You are not authorized to delete this picture"
             })
        }
    } catch (err) {
        res.status(400).send({
            error : err
        })
    }
})


module.exports = {
    pictureRouter
}
