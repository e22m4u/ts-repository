var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { expect } from 'chai';
import { model } from './model-decorator.js';
import { ModelReflector } from './model-reflector.js';
const MD1 = { name: 'Target1', datasource: 'datasource1' };
const MD2 = { name: 'Target2', datasource: 'datasource2' };
describe('model', function () {
    it('should set the given "name" option to the class metadata', function () {
        let MyModel = class MyModel {
        };
        MyModel = __decorate([
            model({ name: 'FooBar' })
        ], MyModel);
        const res = ModelReflector.getMetadata(MyModel);
        expect(res).to.be.eql({ name: 'FooBar' });
    });
    it('should set the given "base" option to the class metadata', function () {
        let MyModel = class MyModel {
        };
        MyModel = __decorate([
            model({ base: 'BaseModel' })
        ], MyModel);
        const res = ModelReflector.getMetadata(MyModel);
        expect(res).to.be.eql({ name: 'MyModel', base: 'BaseModel' });
    });
    it('should set the given "datasource" option to the class metadata', function () {
        let MyModel = class MyModel {
        };
        MyModel = __decorate([
            model({ datasource: 'myDatasource' })
        ], MyModel);
        const res = ModelReflector.getMetadata(MyModel);
        expect(res).to.be.eql({ name: 'MyModel', datasource: 'myDatasource' });
    });
    it('should set the given "tableName" option to the class metadata', function () {
        let MyModel = class MyModel {
        };
        MyModel = __decorate([
            model({ tableName: 'myTable' })
        ], MyModel);
        const res = ModelReflector.getMetadata(MyModel);
        expect(res).to.be.eql({ name: 'MyModel', tableName: 'myTable' });
    });
    it('should override a target metadata that inherits from a parent class', function () {
        let BaseTarget = class BaseTarget {
        };
        BaseTarget = __decorate([
            model(MD1)
        ], BaseTarget);
        let Target = class Target extends BaseTarget {
        };
        Target = __decorate([
            model(MD2)
        ], Target);
        const res = ModelReflector.getMetadata(Target);
        expect(res).to.be.eql(MD2);
    });
    it('should not affect a parent metadata', function () {
        let BaseTarget = class BaseTarget {
        };
        BaseTarget = __decorate([
            model(MD1)
        ], BaseTarget);
        const res1 = ModelReflector.getMetadata(BaseTarget);
        expect(res1).to.be.eql(MD1);
        let Target = class Target extends BaseTarget {
        };
        Target = __decorate([
            model(MD2)
        ], Target);
        const res2 = ModelReflector.getMetadata(BaseTarget);
        expect(res2).to.be.eql(MD1);
        const res3 = ModelReflector.getMetadata(Target);
        expect(res3).to.be.eql(MD2);
    });
});
