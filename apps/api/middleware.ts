import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_PUBLIC_KEY } from "./config";
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = req.headers["authorization"];

    if (!token || typeof token !== "string") {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const decoded = jwt.verify(token, JWT_PUBLIC_KEY as string);
    if (!decoded || typeof decoded !== "object" || !decoded.sub) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    req.userId = decoded.sub;

    next();

}