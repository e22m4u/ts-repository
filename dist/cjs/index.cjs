"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// dist/esm/index.js
var index_exports = {};
__export(index_exports, {
  DatabaseSchema: () => DatabaseSchema
});
module.exports = __toCommonJS(index_exports);
__reExport(index_exports, require("@e22m4u/js-repository"), module.exports);
__reExport(index_exports, require("@e22m4u/js-repository-decorators"), module.exports);

// dist/esm/database-schema.js
var import_js_repository = require("@e22m4u/js-repository");
var import_js_repository_decorators = require("@e22m4u/js-repository-decorators");
var _DatabaseSchema = class _DatabaseSchema extends import_js_repository.DatabaseSchema {
  /**
   * Define model by class.
   *
   * @param ctor
   */
  defineModelByClass(ctor) {
    const modelDef = (0, import_js_repository_decorators.getModelDefinitionFromClass)(ctor);
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
};
__name(_DatabaseSchema, "DatabaseSchema");
var DatabaseSchema = _DatabaseSchema;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DatabaseSchema,
  ...require("@e22m4u/js-repository"),
  ...require("@e22m4u/js-repository-decorators")
});
