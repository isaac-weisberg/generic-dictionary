import { JsonObject, JsonConvert, JsonProperty, JsonConverter, JsonCustomConvert } from 'json2typescript'
import { DictionaryType, Dictionary } from './Dictionary'
import { TypeInspectable } from './TypeInspectable';

const hiddenKey = '__typ'

function valueIsSimple(value: any): boolean {
    return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean'
} 

@JsonConverter
export class DictionaryConverter<Type extends DictionaryType> implements JsonCustomConvert<Dictionary<Type>> {
    static getConstructor<Type extends DictionaryType>(type: new () => Type): { new (): any } {
        if (type instanceof TypeInspectable) {
            typeRegistry[(<any>type).typeIdentifier] = type
        }
        return DictionaryConverter
    }

    serialize(data: Dictionary<Type>): any {
        if (data.length == 0) {
            return {}
        }
        let convert = new JsonConvert()
        let obj: any = {}
        data.forEach((key, value) => {
            if (valueIsSimple(value)) {
                obj[key] = value
            } else if (value instanceof TypeInspectable) {
                let typeid = value.constructor.prototype.typeIdentifier
                obj[key] = convert.serialize(value)
                obj[hiddenKey] = typeid
            }
        })
        return obj
    }
    deserialize(data: any): Dictionary<Type> {
        if (Object.keys(data).length === 0 && data.constructor === Object) {
            return new Dictionary()
        }
        let type: (new () => any)|undefined = undefined
        for (let key in data) {
            let value = data[key]
            let typeid = value[hiddenKey]
            type = typeRegistry[typeid]
            break
        }
        
        let dict = new Dictionary<Type>()
        let convert = new JsonConvert()
        for (let key in data) {
            let object = data[key]
            if (valueIsSimple(object)) {
                dict.set(key, object)
            } else {
                if (!type) {
                    return new Dictionary()
                }
                dict.set(key, convert.deserialize(object, type))
            }
        }
        return dict
    }
}

const typeRegistry: { [id: string]: { new (): any }} = {}