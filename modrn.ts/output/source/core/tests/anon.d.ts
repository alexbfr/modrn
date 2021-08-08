import { RegisteredComponent } from "../types/registered-component";
export declare function registerAnonymous(component: RegisteredComponent<unknown, unknown>, overrideName?: string): {
    tagOpen: (attributes?: string) => string;
    tagClose: string;
};
