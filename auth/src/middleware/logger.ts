import { Request, Response, NextFunction } from "express";

export function logger(req: Request, res: Response, next: NextFunction): void {
  console.log(`[AUTH]: URL HIT LOGGING - ${req.url}`);
  next();
}
