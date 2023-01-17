import 'reflect-metadata'
import { RequestHandler } from '../types/request.type';

import { MetadataKeys } from '../constants';

export function Use(middleware: RequestHandler) {
  return function (target: any, key: string) {
    const middlewares = Reflect.getMetadata(MetadataKeys.MIDDLEWARE, target, key) || [];

    middlewares.unshift(middleware);
    Reflect.defineMetadata(MetadataKeys.MIDDLEWARE, middlewares, target, key);
  }
}