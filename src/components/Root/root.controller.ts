import { Request, Response } from 'express';
//= Decorators
import { Controller, Get } from '../../decorators';

@Controller('')
class RootController {
  @Get('/')
  root(req: Request, res: Response): void {
    res.json({
      "API": "Hassan Ali Portfolio API",
      "Author": "Hassan Ali",
      "Created At": "2023-01-12",
      "Last Update": "2023-01-12",
      "Language": 'en',
      "Supported Languages": "En",
      "Contact Me": "7assan.3li1998@gmail.com"
    });
  }


  @Get('/status')
  status(req: Request, res: Response): void {
    res.status(200).send(`Health Check Successed`);
  }
}

export default RootController;
