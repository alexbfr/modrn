import { Filters, RegisteredComponent } from "./registered-component";
export declare type ComponentBuilderBase = {
    register: () => void;
};
export declare type ComponentBuilderHtml = {
    html: <T extends ComponentBuilderHtml & ComponentBuilderBase>(this: T, html: string) => Omit<T, "html">;
};
export declare type ComponentBuilderTransparent = {
    transparent: <T extends ComponentBuilderTransparent & ComponentBuilderBase>(this: T) => Omit<T, "transparent">;
};
export declare type ComponentBuilderDynamicChildren = {
    dynamicChildren: <T extends ComponentBuilderDynamicChildren & ComponentBuilderBase>(this: T) => Omit<T, "dynamicChildren">;
};
export declare type ComponentBuilderFilters = {
    withFilters: <T extends ComponentBuilderFilters & ComponentBuilderBase>(this: T, filters: Filters) => Omit<T, "withFilters">;
};
export declare type ComponentBuilder<T, R> = {
    register: () => RegisteredComponent<T, R>;
} & ComponentBuilderHtml & ComponentBuilderTransparent & ComponentBuilderDynamicChildren & ComponentBuilderFilters;
