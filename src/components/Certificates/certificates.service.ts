//= Models
import CERTIFICATE, { ICertificateModel } from './certificates.model';
//= Utils
import { uploadFileToStorage } from '../../storage/storage.util';
import queryBuilder from '../../utils/queryBuilder';
import errorMessages from '../../utils/error-messages';
//= Middlwares
import { HttpError } from '../../middlewares/error.handler.middleware';
//= Types
import { ICertificate, ICertificateDocument } from './certificates.types';
import type { QueryParams } from '../../utils/queryBuilder';


class CertificateService {
  public MODEL: ICertificateModel = CERTIFICATE;

  public async getAllCertificates(params?: QueryParams): Promise<ICertificate[]> {
    const { limit, skip } = params || {};
    const { filter, projection, population, sortition } = queryBuilder(params || {});

    console.log(population);

    let certificates: ICertificate[] = await this.MODEL.find(filter, projection, { ...population, ...sortition, ...(limit ? { limit } : {}), ...(skip ? { skip } : {}) }).lean();

    if (!certificates.length) throw HttpError(400, errorMessages.NOT_EXIST("Certificates"));

    return certificates;
  }

  public async getCertificateById(id: string, queryOptions?: QueryParams): Promise<ICertificate> {
    const { projection, population } = queryBuilder(queryOptions || {});

    let certificate = await this.MODEL.findById(id, projection, { ...population }).lean();

    if (!certificate) throw HttpError(400, errorMessages.NOT_EXIST("Certificate", id));

    return certificate;
  }

  public async addNewCertificate({ data, image }: { data: ICertificate, image?: Express.Multer.File }): Promise<ICertificateDocument> {
    let Image;

    if (!data.image) {
      if (!image) throw HttpError(400, errorMessages.REQUIRED('image'));
      Image = await uploadFileToStorage({ file: image, fileType: 'image', folder: data.title });
      data.image = Image.url;
    }

    const certificate = await this.MODEL.create(data);
    return certificate;
  }

  public async updateCertificate(id: string, updates: Partial<ICertificate>, image?: Express.Multer.File): Promise<ICertificateDocument> {
    let certificate: ICertificateDocument | null = await this.MODEL.findById(id);

    if (!certificate) throw HttpError(400, errorMessages.NOT_EXIST("Certificate", id));

    if (image) {
      let uploaded_image = await uploadFileToStorage({ file: image, fileType: 'image', folder: certificate.title });
      certificate.image = uploaded_image.url;
    }

    Object.keys(updates).forEach((key) => {
      if (certificate) certificate.set(key, updates[key as keyof ICertificate]);
    });

    await certificate.save();

    return certificate;
  }

  public async updateCertificatesOrder(newOrder: { id: string, order: number }[]): Promise<boolean> {
    const writes = newOrder.map(Order => ({
      updateOne: {
        filter: { _id: Order.id },
        update: { $set: { order: Order.order } }
      }
    }));

    await this.MODEL.bulkWrite(writes);

    return true;
  }

  public async deleteCertificate(id: string): Promise<boolean> {
    let isDeleted = await this.MODEL.findByIdAndDelete(id);
    if (!isDeleted) throw HttpError(400, errorMessages.NOT_EXIST("Certificate", id));
    return true;
  }
}

export default CertificateService;
