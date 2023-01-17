import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

const connection = mongoose.connection;

const controllerHandlerWithTransaction = async (req: Request, res: Response, next: NextFunction) => {
  const session = await connection.startSession();
  try {
    session.startTransaction();
    /**
     * 
     * Handling The Controller
     * 
    */
    await session.commitTransaction();
  } catch (error: any) {
    await session.abortTransaction();
    next(error);
  }
  session.endSession();
}
