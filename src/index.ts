import { JsonObject, JsonConvert, JsonProperty, JsonConverter, JsonCustomConvert } from 'json2typescript'

@JsonObject export class Dictionary<Type> {
    [id: string]: Type
}

@JsonConverter
export class StringDictionaryConverter implements JsonCustomConvert<Dictionary<string>> {
    serialize(data: Dictionary<string>): any {
        let obj: any = {}
        for (let key in data) {
            let value = data[key]
            if (value && typeof value == 'string') {
                obj[key] = value
            }
        }
        return obj
    }
    deserialize(data: any): Dictionary<string> {
        let dict = new Dictionary<string>()
        for (let key in data) {
            let obj = data[key]
            if (obj && typeof obj == 'string') {
                dict[key] = obj
            }
        }
        return dict
    }
} 

@JsonConverter
export class DictionaryConverter<Type> implements JsonCustomConvert<Dictionary<Type>> {
    private static iden: string = ""
    private static gets = 0
    private static constructors: {[id: string]: (new () => any)[]} = {}

    static beginDeserialization(iden: string) {
        this.iden = iden
        this.gets = 0
    }

    static getConstructor<GenericType>(type: new () => GenericType, iden: string): new () => DictionaryConverter<GenericType> {
        let array: any[] = this.constructors[iden]
        if (!array) {
            array = []
            this.constructors[iden] = array
        }
        array.push(type)
        return DictionaryConverter
    }

    private static getNextType(): any {
        let constr = this.constructors[this.iden][this.gets]
        this.gets++
        return constr
    }

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
        if (data == {}) {
            return new Dictionary()
        }

        let type = DictionaryConverter.getNextType()
        let dict = new Dictionary<Type>()
        let convert = new JsonConvert()
        for (let key in data) {
            dict[key] = convert.deserialize(data[key], type)
        }
        return dict
    }
}
