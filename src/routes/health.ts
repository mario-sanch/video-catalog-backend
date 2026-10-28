import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { error } from "console";

const router = Router();

router.get('/health', async (_req: Request, res: Response){
    try{
        await prisma.$queryRaw`SELECT 1`;
        res.status(200).json({status: "Ok", db: "connected"});
    } catch(err) {
        console.error('Database connection failed:', error);
        res.status(503).json({status: 'error', db: 'disconnected'})
    }
});

export default router;