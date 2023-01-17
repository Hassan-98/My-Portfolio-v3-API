//= Modules
import { Request, Response } from 'express';
//= Decorators
import { Controller, Get, Post, Patch, Delete, Use } from '../../decorators';
//= Service
import BookService from './book.service';
//= Middlewares
import { Authenticated } from '../Auth/auth.middleware';
//= Types
import { ExtendedRequest } from '../../types/request.type'

const Service = new BookService();

@Controller('/books')
class AuthController {
  @Get('/')
  @Use(Authenticated)
  public async getAll(req: ExtendedRequest, res: Response) {
    let books = await Service.getAllBooks(req.user);
    res.status(200).json({ success: true, data: books });
  };
}

export default AuthController;

