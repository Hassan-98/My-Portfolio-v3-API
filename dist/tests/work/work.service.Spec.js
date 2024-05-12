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
const work_service_1 = __importDefault(require("../../components/Work/work.service"));
const testWork = {
    name: 'test work name',
    description: 'test work description',
    stackType: 'front',
    importance: 'glowing',
    showInWebsite: true,
    showInCv: true,
    isTcgWork: false,
    links: {},
    images: { desktop: 'http://test.com/desktop.png', mobile: 'http://test.com/mobile.png' },
    stack: [],
    order: 1
};
describe('WorkService', () => {
    let workService;
    let createdWork;
    ;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        workService = new work_service_1.default();
        createdWork = yield workService.MODEL.create(testWork);
    }));
    describe('getAllWorks', () => {
        it('should return an array of works', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield workService.getAllWorks();
            expect(Array.isArray(result)).toBe(true);
        }));
    });
    describe('getWorkById', () => {
        it('should return a work with the given id', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield workService.getWorkById(createdWork._id);
            expect(result._id).toEqual(createdWork._id);
        }));
        it('should throw an error if the work with the given id does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield workService.getWorkById('6405fbbd372d95646691432e');
            }
            catch (error) {
                expect(error.statusCode).toBe(400);
            }
        }));
    });
    describe('addNewWork', () => {
        let result;
        it('should create a new work and return it', () => __awaiter(void 0, void 0, void 0, function* () {
            // @ts-ignore
            result = yield workService.addNewWork({ data: testWork });
            expect(result.name).toEqual('test work name');
        }));
        afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
            yield workService.MODEL.findByIdAndDelete(result._id);
        }));
    });
    describe('updateWork', () => {
        it('should update the work with the given id and return it', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield workService.updateWork(createdWork._id, { name: 'updated work name' });
            expect(result.name).toEqual('updated work name');
        }));
        it('should throw an error if the work with the given id does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield workService.updateWork('6405fbbd372d95646691432e', {});
            }
            catch (error) {
                expect(error.statusCode).toBe(400);
            }
        }));
    });
    describe('deleteWork', () => {
        it('should delete the work with the given id and return it', () => __awaiter(void 0, void 0, void 0, function* () {
            let result = yield workService.deleteWork(createdWork._id);
            expect(result).toEqual(true);
        }));
        it('should throw an error if the work with the given id does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield workService.deleteWork('6405fbbd372d95646691432e');
            }
            catch (error) {
                expect(error.statusCode).toBe(400);
            }
        }));
    });
});
//# sourceMappingURL=work.service.Spec.js.map