import 'reflect-metadata';
import { AppRouter } from '../router/AppRouter';
import asyncHandler from '../middlewares/async-handler';
import { Methods, MetadataKeys } from '../constants';


export function Controller(routePrefix: string) {
  const router = AppRouter.getRouter();

  return function (target: Function) {
    let props = Object.getOwnPropertyNames(target.prototype).filter((property) => property !== 'constructor');

    for (let key of props) {
      const routeHandler = target.prototype[key];
      const path = Reflect.getMetadata(MetadataKeys.PATH, target.prototype, key);
      const method: Methods = Reflect.getMetadata(MetadataKeys.METHOD, target.prototype, key);
      const middlewares = Reflect.getMetadata(MetadataKeys.MIDDLEWARE, target.prototype, key) || [];

      if (path) {
        router[method](
          `${routePrefix}${path}`,
          ...middlewares,
          asyncHandler(`${routePrefix}${path}`, routeHandler)
        );
      }
    }
  }
}