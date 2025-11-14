import {ModelMetadata} from './model-metadata.js';
import {ModelReflector} from './model-reflector.js';
import {Flatten, PartialBy, Constructor} from '../../types.js';
import {
  DecoratorTargetType,
  getDecoratorTargetType,
} from '@e22m4u/ts-reflector';

/**
 * Model options.
 */
export type ModelOptions = Flatten<PartialBy<ModelMetadata, 'name'>>;

/**
 * Model decorator.
 *
 * @param options
 */
export function model<T extends object>(options?: ModelOptions) {
  return function (target: Constructor<T>) {
    const decoratorType = getDecoratorTargetType(target);
    if (decoratorType !== DecoratorTargetType.CONSTRUCTOR)
      throw new Error('@model decorator is only supported on a class.');
    options = options ?? {};
    const metadata = {
      ...options,
      name: options.name ?? target.name,
    };
    ModelReflector.setMetadata(metadata, target);
  };
}
