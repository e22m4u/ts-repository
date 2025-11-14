import {Prototype, Constructor} from '../../types.js';
import {PropertyMetadata} from './property-metadata.js';
import {PropertyReflector} from './property-reflector.js';
import {
  DecoratorTargetType,
  getDecoratorTargetType,
} from '@e22m4u/ts-reflector';

/**
 * Property decorator.
 *
 * @param metadata
 */
export function property<T extends object>(metadata: PropertyMetadata) {
  return function (target: Prototype<T>, propertyKey: string) {
    const decoratorType = getDecoratorTargetType(
      target,
      propertyKey,
      undefined,
    );
    if (decoratorType !== DecoratorTargetType.INSTANCE_PROPERTY)
      throw new Error(
        '@property decorator is only supported on an instance property.',
      );
    PropertyReflector.setMetadata(
      metadata,
      target.constructor as Constructor<T>,
      propertyKey,
    );
  };
}
