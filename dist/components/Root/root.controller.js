"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
//= Decorators
const decorators_1 = require("../../decorators");
//= Modules
// import playwright from 'playwright';
let RootController = class RootController {
    root(req, res) {
        res.json({
            "API": "Hassan Ali Portfolio API",
            "Author": "Hassan Ali",
            "Created At": "2023-01-12",
            "Last Update": "2023-03-01",
            "Language": 'en',
            "Supported Languages": "En",
            "Contact Me": "7assan.3li1998@gmail.com"
        });
    }
    status(req, res) {
        res.status(200).send(`Health Check Successed`);
    }
    generateCv(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // const pdf = await generatePDF();
            // res.set({ 'Content-Type': 'application/pdf', 'Content-Length': pdf.length })
            res.status(500).json({
                message: "pdf generation service stoped by the developer",
                success: false,
                data: null
            });
        });
    }
};
__decorate([
    (0, decorators_1.Get)('/'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], RootController.prototype, "root", null);
__decorate([
    (0, decorators_1.Get)('/status'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], RootController.prototype, "status", null);
__decorate([
    (0, decorators_1.Post)('/hassan-cv'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RootController.prototype, "generateCv", null);
RootController = __decorate([
    (0, decorators_1.Controller)('')
], RootController);
// async function generatePDF(): Promise<Buffer> {
//   const browser = await playwright.chromium.launch({ headless: true });
//   const page = await browser.newPage();
//   await page.goto(process.env.CLIENT_URL + '/resume', { waitUntil: 'networkidle' });
//   const pdf = await page.pdf({ format: 'a4' });
//   await browser.close();
//   return pdf;
// }
exports.default = RootController;
//# sourceMappingURL=root.controller.js.map