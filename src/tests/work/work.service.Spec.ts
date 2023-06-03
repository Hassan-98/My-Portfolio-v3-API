import WorkService from '../../components/Work/work.service';
import { IWork, IWorkDocument } from '../../components/Work/work.types';

type WorkDocument = IWork & { _id: string };

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
}

describe('WorkService', () => {
  let workService: WorkService;
  let createdWork: IWorkDocument;;

  beforeAll(async () => {
    workService = new WorkService();
    createdWork = await workService.MODEL.create(testWork);
  });

  describe('getAllWorks', () => {
    it('should return an array of works', async () => {
      const result = await workService.getAllWorks();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('getWorkById', () => {
    it('should return a work with the given id', async () => {
      const result = await workService.getWorkById(createdWork._id) as WorkDocument;
      expect(result._id).toEqual(createdWork._id);
    });

    it('should throw an error if the work with the given id does not exist', async () => {
      try {
        await workService.getWorkById('6405fbbd372d95646691432e');
      } catch (error: any) {
        expect(error.statusCode).toBe(400);
      }
    });
  });

  describe('addNewWork', () => {
    let result: IWorkDocument;

    it('should create a new work and return it', async () => {
      // @ts-ignore
      result = await workService.addNewWork({ data: testWork });
      expect(result.name).toEqual('test work name');
    });

    afterAll(async () => {
      await workService.MODEL.findByIdAndDelete(result._id);
    });
  });

  describe('updateWork', () => {
    it('should update the work with the given id and return it', async () => {
      const result = await workService.updateWork(createdWork._id, { name: 'updated work name' });
      expect(result.name).toEqual('updated work name');
    });

    it('should throw an error if the work with the given id does not exist', async () => {
      try {
        await workService.updateWork('6405fbbd372d95646691432e', {});
      } catch (error: any) {
        expect(error.statusCode).toBe(400);
      }
    });
  });

  describe('deleteWork', () => {
    it('should delete the work with the given id and return it', async () => {
      let result = await workService.deleteWork(createdWork._id);
      expect(result).toEqual(true);
    });

    it('should throw an error if the work with the given id does not exist', async () => {
      try {
        await workService.deleteWork('6405fbbd372d95646691432e');
      } catch (error: any) {
        expect(error.statusCode).toBe(400);
      }
    });
  });
});