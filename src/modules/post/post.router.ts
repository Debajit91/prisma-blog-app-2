import express, { NextFunction, Request, Response } from "express";
import { PostController } from "./post.controller";
import {auth as betterAuth} from "../../lib/auth";
import { success } from "better-auth/*";

const router= express.Router();

const auth=(...roles: any)=>{
    
    return async(req: Request, res: Response, next: NextFunction)=>{
        const session = await betterAuth.api.getSession({
            headers: req.headers as any
        })

        if(!session){
            return res.status(401).json({
                success:false,
                message:"You are not authorized!"
            })
        }

        if(!session.user.emailVerified){
            return res.status(403).json({
                success: false,
                message: "Email verification required. Please Verify your email!"
            })
        }

        console.log(session)
        // next();
    }

    
}

router.post("/", 
    auth("USER"),
    PostController.createPost
)

export const postRouter = router;