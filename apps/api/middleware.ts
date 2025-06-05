import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_PUBLIC_KEY } from "./config";
export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
    const token = req.headers["authorization"];

    if (!token || typeof token !== "string") {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }

    try {
        const decoded = jwt.verify(token, JWT_PUBLIC_KEY as string);
        if (!decoded || typeof decoded !== "object" || !decoded.sub) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        req.userId = decoded.sub;
        next();
    } catch (err) {
        res.status(401).json({ error: "Invalid token" });
    }
}