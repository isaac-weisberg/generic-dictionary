import { JsonObject } from 'json2typescript'
import { TypeInspectable } from '..';

export type DictionaryType = TypeInspectable|string|number|boolean

export type IDictionary<Type> = { [id: string]: Type }

@JsonObject export class Dictionary<Type extends DictionaryType> {
    constructor(base: IDictionary<Type> = {}) {
        this.storage = base
    }

    get = (key: string): Type|undefined => {
        return this.storage[key]
    }

    set = (key: string, value: Type|undefined) => {
        this.storage[key] = value
    }

    get length(): number {
        return Object.keys(this.storage).length
    }

    get keys(): string[] {
        return Object.keys(this.storage)
    }

    forEach = (iterator: (key: string, value: Type) => void) => {
        for (let key in this.storage) {
            let value = this.storage[key]
            if (value != undefined) {
                iterator(key, value)
            }
        }
    }

    private storage: { [id: string]: Type|undefined }
}