import 'reflect-metadata';

import { Methods, MetadataKeys } from '../constants';

function routeBinder(method: string) {
  return function (path: string) {
    return function (target: any, key: string) {
      Reflect.defineMetadata(MetadataKeys.PATH, path, target, key);
      Reflect.defineMetadata(MetadataKeys.METHOD, method, target, key);
    }
  }
}

export const Get = routeBinder(Methods.GET);
export const Post = routeBinder(Methods.POST);
export const Patch = routeBinder(Methods.PATCH);
export const Delete = routeBinder(Methods.DELETE);
export const Put = routeBinder(Methods.PUT);