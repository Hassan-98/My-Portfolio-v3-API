import { Request, Response } from 'express';
//= Decorators
import { Controller, Get, Post } from '../../decorators';
import puppeteer from 'puppeteer';

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


  @Post('/hassan-cv')
  async generateCv(req: Request, res: Response): Promise<void> {
    const pdf = await generatePDF();
    res.set({ 'Content-Type': 'application/pdf', 'Content-Length': pdf.length })
    res.send(pdf)
  }

  @Get('/status')
  status(req: Request, res: Response): void {
    res.status(200).send(`Health Check Successed`);
  }
}

async function generatePDF(): Promise<Buffer> {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(process.env.CLIENT_URL + '/resume', { waitUntil: 'networkidle0' });
  const pdf = await page.pdf({ format: 'A4' });
  await browser.close();

  return pdf;
}

export default RootController;
