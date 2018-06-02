"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const json2typescript_1 = require("json2typescript");
const Dictionary_1 = require("./Dictionary");
const TypeInspectable_1 = require("./TypeInspectable");
const hiddenKey = '__typ';
function valueIsSimple(value) {
    return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean';
}
let DictionaryConverter = DictionaryConverter_1 = class DictionaryConverter {
    static getConstructor(type) {
        if (type instanceof TypeInspectable_1.TypeInspectable) {
            typeRegistry[type.typeIdentifier] = type;
        }
        return DictionaryConverter_1;
    }
    serialize(data) {
        if (data.length == 0) {
            return {};
        }
        let convert = new json2typescript_1.JsonConvert();
        let obj = {};
        data.forEach((key, value) => {
            if (valueIsSimple(value)) {
                obj[key] = value;
            }
            else if (value instanceof TypeInspectable_1.TypeInspectable) {
                let typeid = value.constructor.prototype.typeIdentifier;
                obj[key] = convert.serialize(value);
                obj[hiddenKey] = typeid;
            }
        });
        return obj;
    }
    deserialize(data) {
        if (Object.keys(data).length === 0 && data.constructor === Object) {
            return new Dictionary_1.Dictionary();
        }
        let type = undefined;
        for (let key in data) {
            let value = data[key];
            let typeid = value[hiddenKey];
            type = typeRegistry[typeid];
            break;
        }
        let dict = new Dictionary_1.Dictionary();
        let convert = new json2typescript_1.JsonConvert();
        for (let key in data) {
            let object = data[key];
            if (valueIsSimple(object)) {
                dict.set(key, object);
            }
            else {
                if (!type) {
                    return new Dictionary_1.Dictionary();
                }
                dict.set(key, convert.deserialize(object, type));
            }
        }
        return dict;
    }
};
DictionaryConverter = DictionaryConverter_1 = __decorate([
    json2typescript_1.JsonConverter
], DictionaryConverter);
exports.DictionaryConverter = DictionaryConverter;
const typeRegistry = {};
var DictionaryConverter_1;
//# sourceMappingURL=DictionaryConverter.js.map