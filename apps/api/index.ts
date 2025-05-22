import express, { type Request, type Response } from "express";
import { authMiddleware } from "./middleware";
const app = express();
import { prismaClient } from "db/client";
import cors from "cors";

app.use(express.json())
app.use(cors())
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

app.get("/api/v1/website/status", authMiddleware, async (req: Request, res: Response) => {
    const websiteId = req.query.websiteId as string;
    const userId = req.userId;

    const data = await prismaClient.websites.findFirst({
        where: {
            id: websiteId,
            userId
        },
        include: {
            ticks: true
        }
    })

    res.json(data)
})

app.get("/api/v1/websites",authMiddleware, async(req: Request, res: Response) => {
    const userId = req.userId;

    const websites = await prismaClient.websites.findMany({
        where: {
            userId,
            disabled: false
        },
        include: {
            ticks: true
        }
    })

    res.json({
        websites
    })
})

app.delete("/api/v1/website",authMiddleware, async (req: Request, res: Response) => {
    const userId = req.userId;
    const websiteId = req.query.website as string;

    const data = await prismaClient.websites.update({
        where: {
            id: websiteId,
            userId
        },
        data: {
            disabled: true
        }
    })
})
app.listen(8080);