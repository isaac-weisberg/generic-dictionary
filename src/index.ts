import { JsonObject, JsonConvert, JsonProperty, JsonConverter, JsonCustomConvert } from 'json2typescript'

@JsonObject export class Dictionary<Type> {
    [id: string]: Type
}

export interface TypeInspectable {
    inspectableTypeID: string
}

function isTypeInstpectable(obj: any): obj is TypeInspectable {
    return "inspectableTypeID" in obj && typeof obj.inspectableTypeID === 'string'
}

@JsonConverter
export class StringDictionaryConverter implements JsonCustomConvert<Dictionary<string>> {
    serialize(data: Dictionary<string>): any {
        let obj: any = {}
        for (let key in data) {
            let value = data[key]
            if (value && typeof value === 'string') {
                obj[key] = value
            }
        }
        return obj
    }
    deserialize(data: any): Dictionary<string> {
        let dict = new Dictionary<string>()
        for (let key in data) {
            let obj = data[key]
            if (obj && typeof obj === 'string') {
                dict[key] = obj
            }
        }
        return dict
    }
}

@JsonConverter
export class DictionaryConverter<Type> implements JsonCustomConvert<Dictionary<Type>> {
    serialize(data: Dictionary<Type>): any {
        let convert = new JsonConvert()
        let obj: any = {}
        for (let key in data) {
            let object = data[key]
            if (object) {
                obj[key] = convert.serialize(object)
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
            dict[key] = convert.deserialize(data[key], type)
        }
        return dict
    }
}

export const typeRegistry = new Dictionary<(new () => any)>()