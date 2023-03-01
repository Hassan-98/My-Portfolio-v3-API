//= Models
import CONTACT, { IContactModel } from './contact.model';
//= Modules
import nodemailer from 'nodemailer';
//= Utils
import queryBuilder from '../../utils/queryBuilder';
import errorMessages from '../../utils/error-messages';
//= Middlwares
import { HttpError } from '../../middlewares/error.handler.middleware';
//= Types
import { IContact, IContactDocument } from './contact.types';
import type { QueryParams } from '../../utils/queryBuilder';
//= Email Template
import { emailTemplateCreator } from "../../emails/contactUsMail";


class StackService {
  public MODEL: IContactModel = CONTACT;
  private transporter = nodemailer.createTransport({
    host: "smtp.mailgun.org",
    port: 587,
    auth: {
      user: process.env.MAILGUN_USERNAME,
      pass: process.env.MAILGUN_PASSWORD
    }
  });

  public async getMessages(queryOptions: QueryParams): Promise<IContact[]> {
    const { limit, skip } = queryOptions || {};
    const { filter, projection, sortition } = queryBuilder(queryOptions || {});

    let contacts: IContact[] = await this.MODEL.find(filter, projection, { ...sortition, ...(limit ? { limit } : {}), ...(skip ? { skip } : {}) }).lean();

    if (!contacts.length) throw HttpError(400, errorMessages.NOT_EXIST("Contact Messages"));

    return contacts;
  }

  public async getMessageById(idOrName: string, queryOptions: QueryParams): Promise<IContact> {
    const { projection } = queryBuilder(queryOptions || {});

    let contact: IContact = await this.MODEL.findById(idOrName, projection).lean();

    if (!contact) throw HttpError(400, errorMessages.NOT_EXIST("Contact Message", idOrName));

    return contact;
  }

  public async addNewContactMessage(data: IContact): Promise<IContactDocument> {
    const contact = await this.MODEL.create(data);

    const contactUsTemplate = emailTemplateCreator({
      fullName: data.name,
      email: data.email,
      message: data.message,
      date: new Date(),
    });

    this.transporter.sendMail({
      from: "no-reply@hassanali.tk",
      to: "7assan.3li1998@gmail.com",
      subject: "New Contact Us Message - Portfolio",
      html: contactUsTemplate
    }, (err, info) => {
      if (err) throw HttpError(500, err.message);
    });

    return contact;
  }

  public async deleteAMessage(id: string): Promise<boolean> {
    let isDeleted = await this.MODEL.findByIdAndDelete(id);
    if (!isDeleted) throw HttpError(400, errorMessages.NOT_EXIST("Contact Message", id));
    return true;
  }
}

export default StackService;
