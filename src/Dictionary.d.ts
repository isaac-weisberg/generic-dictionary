import { TypeInspectable } from '..';
export declare type DictionaryType = TypeInspectable | string | number | boolean;
export declare type IDictionary<Type> = {
    [id: string]: Type;
};
export declare class Dictionary<Type extends DictionaryType> {
    constructor(base?: IDictionary<Type>);
    get: (key: string) => Type;
    set: (key: string, value: Type) => void;
    readonly length: number;
    readonly keys: string[];
    forEach: (iterator: (key: string, value: Type) => void) => void;
    private storage;
}
