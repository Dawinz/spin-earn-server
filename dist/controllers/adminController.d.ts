import { Request, Response } from 'express';
export declare const getUsers: (req: Request, res: Response) => Promise<void>;
export declare const getWithdrawals: (req: Request, res: Response) => Promise<void>;
export declare const getAnalytics: (req: Request, res: Response) => Promise<void>;
export declare const getDailyStats: (req: Request, res: Response) => Promise<void>;
export declare const updateUserStatus: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getConfig: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateConfig: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
