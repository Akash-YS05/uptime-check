import express, { type Request, type Response } from "express";
import { authMiddleware } from "./middleware";
const app = express();


app.post("/api/v1/website", authMiddleware, (req: Request, res: Response) => {

})

app.get("/api/v1/website/status", authMiddleware, (req: Request, res: Response) => {

})

app.get("/api/v1/websites",authMiddleware, (req: Request, res: Response) => {

})

app.delete("/api/v1/website",authMiddleware, (req: Request, res: Response) => {

})
app.listen(3000);