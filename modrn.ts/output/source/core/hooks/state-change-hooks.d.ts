import { StateToken } from "../../util/state";
import { ChangeHandlerFn } from "./change-hooks";
export declare function useStateChange<T>(stateToken: StateToken<NonNullable<T>>, changeHandler: ChangeHandlerFn<T>, depth?: number): void;
