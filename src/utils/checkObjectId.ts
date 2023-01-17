import { Types } from 'mongoose';

const ObjectId = Types.ObjectId;

export default (id: string): boolean => {
  if (ObjectId.isValid(id)) {
    if (String(new ObjectId(id)) === id) return true;
    return false;
  }
  return false;
};
