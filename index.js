const express = require("express");
const { connection } = require("./config/db");
const { userRouter } = require("./routes/user.routes");
const { pictureRouter } = require("./routes/picture.route");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use("/users", userRouter);
app.use("/pictures", pictureRouter);

app.get("/", (req, res)=>{
    res.status(200).send({
        msg : "Welcome to the home page"
    })
})



app.listen(process.env.port, async()=>{
    try {
        await connection
        console.log("DB is connected");
        console.log(`Server is running on port ${process.env.port}`)
    } catch (err) {
        console.log(`Error is : ${err}`);
    }
})


