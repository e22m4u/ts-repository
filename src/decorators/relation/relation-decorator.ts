import {Prototype, Constructor} from '../../types.js';
import {RelationMetadata} from './relation-metadata.js';
import {RelationReflector} from './relation-reflector.js';
import {
  DecoratorTargetType,
  getDecoratorTargetType,
} from '@e22m4u/ts-reflector';

/**
 * Relation decorator.
 *
 * @param metadata
 */
export function relation<T extends object>(metadata: RelationMetadata) {
  return function (target: Prototype<T>, propertyKey: string) {
    const decoratorType = getDecoratorTargetType(target, propertyKey);
    if (decoratorType !== DecoratorTargetType.INSTANCE_PROPERTY)
      throw new Error(
        '@relation decorator is only supported on an instance property.',
      );
    RelationReflector.setMetadata(
      metadata,
      target.constructor as Constructor<T>,
      propertyKey,
    );
  };
}
