import { Request, Response, NextFunction } from 'express';
import * as dotenv from "dotenv";

export const authorize = () => async (req: Request, res: Response, next: NextFunction) => {
  dotenv.config();
  const AUTH_TOKEN = process.env.AUTH_TOKEN || "GTI525_API_ACCESS_GRANTED";
  try {
    let apiToken = req.headers.authorization;

    if (!apiToken) {
      return res.status(401).json({ message: 'Invalid token ' });
    }

    if (apiToken.toLowerCase().startsWith('bearer')) {
        apiToken = apiToken.slice('bearer'.length).trim();
    }

    const hasAccessToEndpoint = apiToken === AUTH_TOKEN;

    if (!hasAccessToEndpoint) {
      return res.status(401).json({ message: 'No enough privileges to access endpoint' });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Failed to authenticate user' });
  }
};