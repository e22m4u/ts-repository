var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { expect } from 'chai';
import { DataType } from '@e22m4u/js-repository';
import { Reflector } from '@e22m4u/ts-reflector';
import { property } from './property-decorator.js';
import { mapEntries } from '../../utils/map-entries.js';
import { PROPERTIES_METADATA_KEY } from './property-metadata.js';
const MD1 = { type: DataType.STRING };
const MD2 = { type: DataType.NUMBER };
describe('property', function () {
    it('should set a given metadata to a property', function () {
        class Target {
            prop1;
            prop2;
        }
        __decorate([
            property(MD1),
            __metadata("design:type", String)
        ], Target.prototype, "prop1", void 0);
        __decorate([
            property(MD2),
            __metadata("design:type", Number)
        ], Target.prototype, "prop2", void 0);
        const res = Reflector.getMetadata(PROPERTIES_METADATA_KEY, Target);
        expect(mapEntries(res)).to.be.eql([
            ['prop1', MD1],
            ['prop2', MD2],
        ]);
    });
    it('should extend a target metadata that inherits from a parent class', function () {
        class BaseTarget {
            prop1;
        }
        __decorate([
            property(MD1),
            __metadata("design:type", String)
        ], BaseTarget.prototype, "prop1", void 0);
        class Target extends BaseTarget {
            prop2;
        }
        __decorate([
            property(MD2),
            __metadata("design:type", Number)
        ], Target.prototype, "prop2", void 0);
        const res = Reflector.getMetadata(PROPERTIES_METADATA_KEY, Target);
        expect(mapEntries(res)).to.be.eql([
            ['prop1', MD1],
            ['prop2', MD2],
        ]);
    });
    it('should not affect a parent metadata', function () {
        class BaseTarget {
            prop1;
        }
        __decorate([
            property(MD1),
            __metadata("design:type", String)
        ], BaseTarget.prototype, "prop1", void 0);
        const res1 = Reflector.getMetadata(PROPERTIES_METADATA_KEY, BaseTarget);
        expect(mapEntries(res1)).to.be.eql([['prop1', MD1]]);
        class Target extends BaseTarget {
            prop2;
        }
        __decorate([
            property(MD2),
            __metadata("design:type", Number)
        ], Target.prototype, "prop2", void 0);
        const res2 = Reflector.getMetadata(PROPERTIES_METADATA_KEY, BaseTarget);
        expect(mapEntries(res2)).to.be.eql([['prop1', MD1]]);
        const res3 = Reflector.getMetadata(PROPERTIES_METADATA_KEY, Target);
        expect(mapEntries(res3)).to.be.eql([
            ['prop1', MD1],
            ['prop2', MD2],
        ]);
    });
});
