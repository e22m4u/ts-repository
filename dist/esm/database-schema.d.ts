import { Constructor } from './types.js';
import { Repository } from '@e22m4u/js-repository';
import { DatabaseSchema as BaseDatabaseSchema } from '@e22m4u/js-repository';
/**
 * Database schema.
 */
export declare class DatabaseSchema extends BaseDatabaseSchema {
    /**
     * Define model by class.
     *
     * @param ctor
     */
    defineModelByClass<T extends object>(ctor: Constructor<T>): this;
    /**
     * Get repository by model class.
     *
     * @param ctor
     */
    getRepositoryByModelClass<T extends object>(ctor: Constructor<T>): Repository<T>;
}
