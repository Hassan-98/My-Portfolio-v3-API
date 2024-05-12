"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//= Models
const contact_model_1 = __importDefault(require("./contact.model"));
//= Modules
const nodemailer_1 = __importDefault(require("nodemailer"));
//= Utils
const queryBuilder_1 = __importDefault(require("../../utils/queryBuilder"));
const error_messages_1 = __importDefault(require("../../utils/error-messages"));
//= Middlwares
const error_handler_middleware_1 = require("../../middlewares/error.handler.middleware");
//= Email Template
const contactUsMail_1 = require("../../emails/contactUsMail");
class StackService {
    constructor() {
        this.MODEL = contact_model_1.default;
        this.transporter = nodemailer_1.default.createTransport({
            host: "smtp.mailgun.org",
            port: 587,
            auth: {
                user: process.env.MAILGUN_USERNAME,
                pass: process.env.MAILGUN_PASSWORD
            }
        });
    }
    getMessages(queryOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, skip } = queryOptions || {};
            const { filter, projection, sortition } = (0, queryBuilder_1.default)(queryOptions || {});
            let contacts = yield this.MODEL.find(filter, projection, Object.assign(Object.assign(Object.assign({}, sortition), (limit ? { limit } : {})), (skip ? { skip } : {}))).lean();
            if (!contacts.length)
                throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.NOT_EXIST("Contact Messages"));
            return contacts;
        });
    }
    getMessageById(idOrName, queryOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            const { projection } = (0, queryBuilder_1.default)(queryOptions || {});
            let contact = yield this.MODEL.findById(idOrName, projection).lean();
            if (!contact)
                throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.NOT_EXIST("Contact Message", idOrName));
            return contact;
        });
    }
    addNewContactMessage(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const contact = yield this.MODEL.create(data);
            const contactUsTemplate = (0, contactUsMail_1.emailTemplateCreator)({
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
                if (err)
                    throw (0, error_handler_middleware_1.HttpError)(500, err.message);
            });
            return contact;
        });
    }
    deleteAMessage(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let isDeleted = yield this.MODEL.findByIdAndDelete(id);
            if (!isDeleted)
                throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.NOT_EXIST("Contact Message", id));
            return true;
        });
    }
}
exports.default = StackService;
//# sourceMappingURL=contact.service.js.map