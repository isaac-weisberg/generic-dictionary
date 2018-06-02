import { JsonCustomConvert } from 'json2typescript';
import { DictionaryType, Dictionary } from './Dictionary';
export declare class DictionaryConverter<Type extends DictionaryType> implements JsonCustomConvert<Dictionary<Type>> {
    static getConstructor<Type extends DictionaryType>(type: new () => Type): {
        new (): any;
    };
    serialize(data: Dictionary<Type>): any;
    deserialize(data: any): Dictionary<Type>;
}
