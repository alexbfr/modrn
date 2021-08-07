import { State, StateToken } from "../../util/state";
export declare function useLocalStorageState<T, K extends StateToken<NonNullable<T>>>(token: K, initial: NonNullable<K["dummy"]> | (() => K["dummy"]), localStorageKey: string, depth?: number): State<K["dummy"]>;
