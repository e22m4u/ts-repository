import {Constructor} from './types.js';
import {getModelDefinitionFromClass} from './definition/index.js';
import {
  Repository,
  DatabaseSchema as BaseDatabaseSchema,
} from '@e22m4u/js-repository';

/**
 * Database schema.
 */
export class DatabaseSchema extends BaseDatabaseSchema {
  /**
   * Define model by class.
   *
   * @param ctor
   */
  defineModelByClass<T extends object>(ctor: Constructor<T>) {
    const modelDef = getModelDefinitionFromClass(ctor);
    this.defineModel(modelDef);
    return this;
  }

  /**
   * Get repository by model class.
   *
   * @param ctor
   */
  getRepositoryByModelClass<T extends object>(
    ctor: Constructor<T>,
  ): Repository<T> {
    return this.getRepository<T>(ctor.name);
  }
}
