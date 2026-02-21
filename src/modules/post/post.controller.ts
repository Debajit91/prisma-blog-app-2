import { Request, Response } from "express";
import { postServices } from "./post.service";

const createPost = async(req: Request, res: Response)=>{
    try {
        console.log(req.user);
        const user = req.user;
        if(!user){
            return res.status(400).json({
                error: "Unauthorized!"
            })
        }
        const result = await postServices.createPost(req.body, user.id as string);
        res.status(201).json(result)
    } catch (error) {
        res.status(404).json({
            error: "Post Creation Failed",
            details: error
        })
    }
}


export const PostController = {
    createPost
}