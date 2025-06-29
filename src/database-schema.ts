import {Constructor} from './types.js';
import {Repository} from '@e22m4u/js-repository';
import {DatabaseSchema as BaseDatabaseSchema} from '@e22m4u/js-repository';
import {getModelDefinitionFromClass} from '@e22m4u/js-repository-decorators';

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
