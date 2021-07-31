import {Module, RegisteredComponent} from "./component-declaration";
import {tagify} from "../util/tagify";
import {logDiagnostic} from "../util/logging";
import {Stateful,} from "../util/state";
import {requestRender} from "./render-queue";
import {Expression} from "jsep";

export interface ComponentState extends Stateful {
    addedChildElements: WeakSet<ChildNode>;
    previousChild: Fragment | null;
    customProps: Record<string, unknown>;
    getOwner: () => ModrnHTMLElement;
}

export abstract class ModrnHTMLElement extends HTMLElement {
    componentInfo?: ComponentInfo;
    state?: ComponentState;
    initialPreviousChild?: Fragment;
    initialCustomProps?: Record<string, unknown>;
    abstract update(): void;
    abstract notifyChildrenChanged(childFragment: Fragment): void;
    abstract copyTo(other: ModrnHTMLElement): void;
}

export enum MappingType {
    childVariable,
    attribute,
    attributeRef,
    specialAttribute
}

export enum ExpressionType {
    VariableUsage,
    ComplexExpression,
    ConstantExpression
}

export type BaseExpression = {
    expressionType: ExpressionType;
};

export type VariableUsageExpression = {
    expressionType: ExpressionType.VariableUsage;
    variableName: string;
} & BaseExpression;

export type ComplexExpression = {
    expressionType: ExpressionType.ComplexExpression;
    usedVariableNames: string[];
    expression: Expression;
    originalExpression?: string;
    compiledExpression: (what: unknown) => unknown;
} & BaseExpression;

export type ConstantExpression = {
    expressionType: ExpressionType.ConstantExpression;
    value: unknown;
} & BaseExpression;

export type ValueTransformerFn = <T>(node: Node, value: T) => T;

export type VariableMappingBase<T extends MappingType> = {
    indexes: number[];
    type: T;
    expression: BaseExpression;
    valueTransformer?: ValueTransformerFn;
}

export type VariableMapping = VariableMappingBase<MappingType>;

export type ChildVariable = VariableMappingBase<MappingType.childVariable>;

export type AttributeVariable = {
    attributeName: string;
    hidden?: boolean;
} & VariableMappingBase<MappingType.attribute>;

export type AttributeRefVariable = VariableMappingBase<MappingType.attributeRef>;

export type SpecialAttributeVariable = {
    specialAttributeRegistration: SpecialAttributeRegistration;
    hidden?: boolean;
} & VariableMappingBase<MappingType.specialAttribute>;

export type VariableMappings = {
    [variableName: string]: VariableMapping[];
    __constants: VariableMapping[];
}

export type FoundVariables = {
    variables: VariableMappings;
    newRootElement: HTMLElement;
};

export type Fragment = {
    childElement: HTMLElement | null;
    variableDefinitions: VariableMappings | null;
}

export type SpecialAttributeHandlerFnResult = {
    transformedElement?: HTMLElement;
    valueTransformer?: (element: HTMLElement, value: unknown) => unknown;
}

export type SpecialAttributeHandlerFn = (elem: HTMLElement) => SpecialAttributeHandlerFnResult;

export type SpecialAttributeRegistration = {
    precedence: number;
    attributeName: string;
    handler: SpecialAttributeHandlerFn;
    hidden?: boolean;
}

export type ComponentInfo = {
    isSpecialAttribute: boolean;
    tagName: string;
    componentName: string;
    registeredComponent: RegisteredComponent<unknown, unknown>;
    content: Fragment | null;
};

export type ComponentRegistry = {
    [componentName: string]: ComponentInfo;
}

const componentByRegisteredComponent = new WeakMap<RegisteredComponent<unknown, unknown>, ComponentInfo>();
const componentRegistry: ComponentRegistry = {};
const componentsToRegister: ComponentInfo[] = [];

export function addToComponentRegistry(componentName: string, component: RegisteredComponent<unknown, unknown>): ComponentInfo {
    const tagName = tagify(componentName).toLowerCase();
    const componentInfo: ComponentInfo = {
        isSpecialAttribute: false,
        tagName,
        componentName,
        registeredComponent: component,
        content: null
    };
    componentsToRegister.push(componentInfo);
    componentRegistry[tagName] = componentInfo;
    componentByRegisteredComponent.set(component, componentInfo);
    return componentInfo;
}

export function registerModule<M, K extends keyof M>(module: Module<M, K>): void {
    Object.entries(module).forEach(([componentName, component]) => {
        addToComponentRegistry(componentName, component as RegisteredComponent<unknown, unknown>);
    });
}

export function setStaticInitializationResultForComponent(componentName: string, content: Fragment): void {
    componentRegistry[tagify(componentName).toLowerCase()].content = content;
}

export function isRegisteredTagName(tagName: string): boolean {
    const componentName = tagName.toLowerCase();
    return componentName in componentRegistry;
}

export function getComponentRegistry(): ComponentRegistry {
    return {...componentRegistry};
}

export function getComponentInfoOf(registeredComponent: RegisteredComponent<unknown, unknown>): ComponentInfo | undefined {
    return componentByRegisteredComponent.get(registeredComponent);
}

export type HasConnectedFunction = (self: ModrnHTMLElement, componentInfo: ComponentInfo) => void;
export type NotifyChildrenChangedFunction = (self: ModrnHTMLElement, componentInfo: ComponentInfo, childFragment: Fragment) => void;

export function register(componentInfo: ComponentInfo, hasConnectedFn: HasConnectedFunction, notifyChildrenChangedFn: NotifyChildrenChangedFunction): CustomElementConstructor {
    const tagName = componentInfo.tagName;
    if (componentRegistry[tagName]?.registeredComponent === componentInfo.registeredComponent && componentInfo.registeredComponent.customElementConstructor) {
        return componentInfo.registeredComponent.customElementConstructor;
    }
    logDiagnostic(`Registering component ${tagName}`);
    const customElementConstructor = class extends ModrnHTMLElement {
        constructor() {
            super();
            this.componentInfo = componentInfo;
        }

        connectedCallback() {
            hasConnectedFn(this, componentInfo);
        }

        notifyChildrenChanged(childFragment: Fragment) {
            notifyChildrenChangedFn(this, componentInfo, childFragment);
        }

        update() {
            requestRender(this);
        }

        copyTo(other: ModrnHTMLElement) {
            other.initialPreviousChild = this.initialPreviousChild;
            other.initialCustomProps = this.initialCustomProps;
            other.componentInfo = this.componentInfo;
            other.state = this.state ? {...this.state} : undefined;
        }

    };
    customElements.define(tagName, customElementConstructor);
    componentInfo.registeredComponent.customElementConstructor = customElementConstructor;
    return customElementConstructor;
}

export function registerAll(hasConnectedFn: HasConnectedFunction, notifyChildrenChangedFn: NotifyChildrenChangedFunction): void {
    const componentsToRegisterCopy = [...componentsToRegister];
    componentsToRegister.splice(0, componentsToRegister.length);
    componentsToRegisterCopy.forEach(componentInfo => {
        register(componentInfo, hasConnectedFn, notifyChildrenChangedFn);
    });
}

function createEmptyState(self: ModrnHTMLElement): ComponentState {

    try {
        return {
            addedChildElements: new WeakSet<ChildNode>(),
            previousChild: null,
            customProps: self.initialCustomProps || {},
            state: {},
            update: self.update.bind(self),
            getOwner: () => self
        };
    } finally {
        delete self.initialCustomProps;
    }
}

export function getStateOf(self: ModrnHTMLElement): ComponentState {
    return self.state || (self.state = createEmptyState(self));
}

let currentStateContext: Stateful | undefined = undefined;

export function getCurrentStateContext(): Stateful {
    const state = currentStateContext;
    if (!state) {
        throw new Error("Not initialized - forgotten to use bindToStateContext?");
    }
    return state;
}

export function withState<T, R>(state: Stateful, fn: (...params: T[]) => R, ...params: T[]): R { // eslint-disable-line
    const oldStateContext = currentStateContext;
    try {
        currentStateContext = state;
        return fn(...params);
    } finally {
        currentStateContext = oldStateContext;
    }
}

export function bindToStateContext<T, R>(fn: (...params: T[]) => R, ...params: T[]): (...params: T[]) => R { // eslint-disable-line
    if ("bound" in fn) {
        return fn;
    }
    if (!currentStateContext) {
        throw new Error("Cannot bind to current state context since none exists");
    }
    const boundCurrentStateContext = currentStateContext;
    const result = (...params: any[]) => withState(boundCurrentStateContext, fn, ...params); // eslint-disable-line
    result.bound = true;
    return result;
}
