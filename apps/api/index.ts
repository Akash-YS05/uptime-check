import express, { type Request, type Response } from "express";
import { authMiddleware } from "./middleware";
const app = express();
import { prismaClient } from "db/client";

app.use(express.json())

app.post("/api/v1/website", authMiddleware, async (req: Request, res: Response) => {
    const userId = req.userId!;
    const { url } = req.body;

    const data = await prismaClient.websites.create({
        data:{
            userId,
            url
        }
    })

    res.json({
        id: data.id
    })

})

app.get("/api/v1/website/status", authMiddleware, (req: Request, res: Response) => {

})

app.get("/api/v1/websites",authMiddleware, (req: Request, res: Response) => {

})

app.delete("/api/v1/website",authMiddleware, (req: Request, res: Response) => {

})
app.listen(3000);