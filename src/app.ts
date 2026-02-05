import express, { Application } from "express";

const app:Application = express();

app.get("/", (req, res)=>{
    res.send("Hello! This is Prisma Blog App");
})

export default app;