//= Modules
import { Request, Response } from 'express';
//= Decorators
import { Controller, Get, Post, Patch, Delete, Use } from '../../decorators';
//= Service
import CertificateService from './certificates.service';
//= Middlewares
import { bodyValidator, paramsValidator } from '../../middlewares/validation.middleware';
import { Authenticated } from '../Auth/auth.middleware';
//= Utils
import { multer } from '../../storage/storage.util';
//= Validations
import { IDSchema, OrderSchema, CertificateSchema } from './certificates.validation';

const Service = new CertificateService();

@Controller('/certificates')
class CertificatesController {
  @Get('/')
  public async getAllCertificates(req: Request, res: Response) {
    const allCertificates = await Service.getAllCertificates(req.query);
    res.status(200).json({ success: true, data: allCertificates });
  };

  @Get('/:id')
  @Use(paramsValidator(IDSchema))
  public async getACertificateById(req: Request, res: Response) {
    const certificate = await Service.getCertificateById(req.params.id, req.query);
    res.status(200).json({ success: true, data: certificate });
  };

  @Post('/')
  @Use(Authenticated)
  @Use(multer.single('image'))
  @Use(bodyValidator(CertificateSchema, ['showInCv', 'showInWebsite', 'order']))
  public async addNewCertificate(req: Request, res: Response) {
    const uploaded_image = req.file as Express.Multer.File;
    const certificate = await Service.addNewCertificate({ data: req.body, image: uploaded_image });
    res.status(201).json({ success: true, data: certificate });
  };

  @Patch('/order')
  @Use(Authenticated)
  @Use(bodyValidator(OrderSchema))
  public async updateCertificateOrder(req: Request, res: Response) {
    await Service.updateCertificatesOrder(req.body);
    res.status(200).json({ success: true, data: null });
  };

  @Patch('/:id')
  @Use(Authenticated)
  @Use(paramsValidator(IDSchema))
  @Use(multer.single('image'))
  @Use(bodyValidator(CertificateSchema.partial(), ['showInCv', 'showInWebsite', 'order']))
  public async updateCertificate(req: Request, res: Response) {
    const uploaded_image = req.file as Express.Multer.File;
    const certificate = await Service.updateCertificate(req.params.id, req.body, uploaded_image);
    res.status(200).json({ success: true, data: certificate });
  };

  @Delete('/:id')
  @Use(Authenticated)
  @Use(paramsValidator(IDSchema))
  public async deleteCertificate(req: Request, res: Response) {
    await Service.deleteCertificate(req.params.id);
    res.status(200).json({ success: true, data: null });
  };
}

export default CertificatesController;

