import type { NextFunction, Request, Response } from "express";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const header = req.headers["authorization"];

    req.userId = "1"    //hardcoded as of now
    next();
}