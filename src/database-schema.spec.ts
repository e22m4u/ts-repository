import {expect} from 'chai';
import {DataType} from '@e22m4u/js-repository';
import {Repository} from '@e22m4u/js-repository';
import {DatabaseSchema} from './database-schema.js';
import {ModelDefinition} from '@e22m4u/js-repository';
import {model} from '@e22m4u/js-repository-decorators';
import {DefinitionRegistry} from '@e22m4u/js-repository';
import {property} from '@e22m4u/js-repository-decorators';

@model({datasource: 'myDatasource'})
class MyModel {
  @property(DataType.STRING)
  foo!: string;
  @property(DataType.NUMBER)
  bar!: number;
}

describe('DatabaseSchema', function () {
  describe('defineModelByClass', function () {
    it('defines model by class metadata', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModelByClass(MyModel);
      const modelSchema: ModelDefinition = dbs
        .getService(DefinitionRegistry)
        .getModel(MyModel.name);
      expect(modelSchema).to.be.eql({
        name: 'MyModel',
        datasource: 'myDatasource',
        properties: {
          foo: DataType.STRING,
          bar: DataType.NUMBER,
        },
      });
    });
  });

  describe('getRepositoryByModelClass', function () {
    it('returns repository by a given class', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModelByClass(MyModel);
      const res: Repository<MyModel> = dbs.getRepositoryByModelClass(MyModel);
      expect(res).to.be.instanceof(Repository);
    });
  });
});
