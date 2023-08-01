type IfEquals<X, Y, A = X, B = never> =
    (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2)
        ? A
        : B;

type Writable<T, O> =
    T extends O
        ? T
        : {
            [P in keyof T as IfEquals<{ [Q in P]: T[P] },
            { -readonly [Q in P]: T[P] }, P>]: T[P]
        }

type Cleanup<T> =
    0 extends (1 & T)
        ? unknown
        : T extends readonly any[]
            ? (Exclude<keyof T, keyof any[]> extends never
                ? { [k: `${number}`]: T[number] }
                : Omit<T, keyof any[]>)
            : T;

type PrefixKeys<V, K extends PropertyKey, O> =
    V extends O
        ? { [P in K]: V }
        : V extends object
            ? { [P in keyof V as `${Extract<K, string | number>}.${Extract<P, string | number>}`]: V[P] }
            : { [P in K]: V };

type ValueOf<T> = T[keyof T]

type _FlattenObject<T, O = never> =
    Writable<Cleanup<T>, O> extends infer U
        ? U extends O
            ? U
            : U extends object
                ? ValueOf<{ [K in keyof U]-?: (x: PrefixKeys<_FlattenObject<U[K], O>, K, O>) => void }> | ((x: U) => void) extends (x: infer I) => void
                    ? { [K in keyof I]: I[K] }
                    : never
                : U
        : never;

type IfAny<T, Y, N> = 0 extends (1 & T) ? Y : N;

export type FlattenObject<T, O = never> = IfAny<T, any, T & _FlattenObject<T, O>>;
