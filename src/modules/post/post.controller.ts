import { Request, Response } from "express";
import { postServices } from "./post.service";

const createPost = async(req: Request, res: Response)=>{
    try {
        const result = await postServices.createPost(req.body);
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