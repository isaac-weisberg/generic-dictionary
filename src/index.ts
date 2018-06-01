import { JsonObject, JsonConvert, JsonProperty, JsonConverter, JsonCustomConvert } from 'json2typescript'

@JsonObject export class Dictionary<Type extends TypeInspectable|string|Object> {
    [id: string]: Type
}

export interface TypeInspectable {
    inspectableTypeID: string
}

function isTypeInstpectable(obj: any): obj is TypeInspectable {
    return "inspectableTypeID" in obj && typeof obj.inspectableTypeID === 'string'
}

@JsonConverter
export class DictionaryConverter<Type extends TypeInspectable|string> implements JsonCustomConvert<Dictionary<Type>> {
    serialize(data: Dictionary<Type>): any {
        let convert = new JsonConvert()
        let obj: any = {}
        for (let key in data) {
            let object = data[key]
            if (object) {
                if (typeof object === 'string') {
                    obj[key] = object
                } else {
                    obj[key] = convert.serialize(object)
                }
            }
        }
        return obj
    }
    deserialize(data: any): Dictionary<Type> {
        if (Object.keys(data).length === 0 && data.constructor === Object) {
            return new Dictionary()
        }
        let type: (new () => any)|undefined = undefined
        if (isTypeInstpectable(data)) {
            type = typeRegistry[data.inspectableTypeID]
        }
        if (!type) {
            return new Dictionary()
        }
        let dict = new Dictionary<Type>()
        let convert = new JsonConvert()
        for (let key in data) {
            let object = data[key]
            if (typeof object === 'string') {
                (dict as any)[key] = object
            } else {
                dict[key] = convert.deserialize(object, type)
            }
        }
        return dict
    }
}

export const typeRegistry = new Dictionary<(new () => any)>()