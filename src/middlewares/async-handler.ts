import { RequestHandler, Request, Response, NextFunction } from "express";

export default function asyncHandler(controller: string, requestHandler: RequestHandler) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      await requestHandler(req, res, next);
    } catch (err: any) {
      const status: number = err.status || 500;
      const message: string = err.message || 'Something went wrong';

      console.error(`Error occurred in -> ${req.method.toUpperCase()} ${controller}`);
      console.error('\n\x1b[31m%s\x1b[0m\n', message);
      console.error(err.stack);

      res.status(status).json({ success: false, data: null, message });
    }
  }
}
