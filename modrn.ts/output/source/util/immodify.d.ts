declare type Full<T> = {
    full: true;
} & {
    val: T;
};
export declare type DeepPartialOrFull<T> = {
    [P in keyof T]?: DeepPartialOrFull<T[P]> | Full<T[P]>;
};
export declare function replaceWith<T>(val: T): Full<T>;
export declare function immodify<T>(on: T, modifier: DeepPartialOrFull<T>): T;
export {};
