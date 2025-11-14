import { ModelReflector } from './model-reflector.js';
import { DecoratorTargetType, getDecoratorTargetType, } from '@e22m4u/ts-reflector';
/**
 * Model decorator.
 *
 * @param options
 */
export function model(options) {
    return function (target) {
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
