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
import { Reflector } from '@e22m4u/ts-reflector';
import { relation } from './relation-decorator.js';
import { mapEntries } from '../../utils/map-entries.js';
import { RELATIONS_METADATA_KEY } from './relation-metadata.js';
import { RelationType } from '@e22m4u/js-repository';
const MD1 = {
    type: RelationType.BELONGS_TO,
    model: 'myModel',
};
const MD2 = {
    type: RelationType.HAS_MANY,
    model: 'myModel',
    foreignKey: 'myKey',
};
describe('relation', function () {
    it('sets a given metadata to property', function () {
        const md1 = {
            type: RelationType.BELONGS_TO,
            model: 'myModel',
        };
        const md2 = {
            type: RelationType.HAS_MANY,
            model: 'myModel',
            foreignKey: 'myKey',
        };
        class Target {
            rel1;
            rel2;
        }
        __decorate([
            relation(md1),
            __metadata("design:type", Object)
        ], Target.prototype, "rel1", void 0);
        __decorate([
            relation(md2),
            __metadata("design:type", Object)
        ], Target.prototype, "rel2", void 0);
        const res = Reflector.getMetadata(RELATIONS_METADATA_KEY, Target);
        expect(mapEntries(res)).to.be.eql([
            ['rel1', md1],
            ['rel2', md2],
        ]);
    });
    it('should extend a target metadata that inherits from a parent class', function () {
        class BaseTarget {
            rel1;
        }
        __decorate([
            relation(MD1),
            __metadata("design:type", Object)
        ], BaseTarget.prototype, "rel1", void 0);
        class Target extends BaseTarget {
            rel2;
        }
        __decorate([
            relation(MD2),
            __metadata("design:type", Object)
        ], Target.prototype, "rel2", void 0);
        const res = Reflector.getMetadata(RELATIONS_METADATA_KEY, Target);
        expect(mapEntries(res)).to.be.eql([
            ['rel1', MD1],
            ['rel2', MD2],
        ]);
    });
    it('should not affect a parent metadata', function () {
        class BaseTarget {
            rel1;
        }
        __decorate([
            relation(MD1),
            __metadata("design:type", Object)
        ], BaseTarget.prototype, "rel1", void 0);
        const res1 = Reflector.getMetadata(RELATIONS_METADATA_KEY, BaseTarget);
        expect(mapEntries(res1)).to.be.eql([['rel1', MD1]]);
        class Target extends BaseTarget {
            rel2;
        }
        __decorate([
            relation(MD2),
            __metadata("design:type", Object)
        ], Target.prototype, "rel2", void 0);
        const res2 = Reflector.getMetadata(RELATIONS_METADATA_KEY, BaseTarget);
        expect(mapEntries(res2)).to.be.eql([['rel1', MD1]]);
        const res3 = Reflector.getMetadata(RELATIONS_METADATA_KEY, Target);
        expect(mapEntries(res3)).to.be.eql([
            ['rel1', MD1],
            ['rel2', MD2],
        ]);
    });
});
