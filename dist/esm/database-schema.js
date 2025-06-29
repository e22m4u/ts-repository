import { DatabaseSchema as BaseDatabaseSchema } from '@e22m4u/js-repository';
import { getModelDefinitionFromClass } from '@e22m4u/js-repository-decorators';
/**
 * Database schema.
 */
export class DatabaseSchema extends BaseDatabaseSchema {
    /**
     * Define model by class.
     *
     * @param ctor
     */
    defineModelByClass(ctor) {
        const modelDef = getModelDefinitionFromClass(ctor);
        this.defineModel(modelDef);
        return this;
    }
    /**
     * Get repository by model class.
     *
     * @param ctor
     */
    getRepositoryByModelClass(ctor) {
        return this.getRepository(ctor.name);
    }
}
