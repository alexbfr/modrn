declare const sigDate: Date;
declare const sigElementRefs: ElementRefs;
declare const sigEventHandler: () => void;
declare const sigFunction: () => void;
declare type ElementRefs = {
    refs: HTMLElement[];
};
declare type ChildCollection = {
    elements: Element[];
    "__childCollection": true;
};
declare type Container = {
    "__typed"?: true;
};
declare function mBool(): boolean;
declare function mString<T extends string>(): T;
declare function mNumber(): number;
declare function mChild(): ChildCollection;
declare function mDate(): Date;
declare function mRef(): ElementRefs;
declare function mEventHandler(): (e: Event) => void;
declare function mFunction<T extends Function>(): T;
declare function mArray<T>(): T[];
declare function mObj<T>(): T;
declare function m<T>(v: T): T & Container;

declare const NoProps: Container;
declare type AllProps = {
    allProps: () => Record<string, unknown>;
};
declare type Filters = {
    [filterName: string]: (val: unknown) => unknown;
};
declare type RegisteredComponent<T, R> = {
    transparent: boolean;
    dynamicChildren: boolean;
    customElementConstructor?: CustomElementConstructor;
    propTemplate: T;
    renderFunction: (props: T & AllProps) => R | null;
    filters: Filters;
    htmlTemplate: string;
};
declare type Module<M, K extends keyof M> = {
    [tagName in K]: (M[K] & RegisteredComponent<unknown, unknown>);
};
declare type ModuleResult<M, K extends keyof M> = Module<M, K> & {
    dependsOn: (...modules: Module<never, never>[]) => Module<M, K>;
};

/**
 * Perform the global initialization of all components contained in the provided module list.
 * This creates a custom element (aka web component) for each of them.
 *
 * @param modules
 */
declare function modrn(...modules: ModuleResult<never, never>[]): void;

/**
 * Checks if an object has changed up to a maximum recursion depth
 * @param previous
 * @param now
 * @param depth
 */
declare function hasChanged(previous: unknown, now: unknown, depth: number): boolean;
/**
 * Checks if an array has changed up to a maximum recursion depth
 * @param previousArr
 * @param nowArr
 * @param depth
 */
declare function hasArrayChanged(previousArr: unknown[], nowArr: unknown[], depth: number): boolean;
/**
 * Checks if an object has changed up to a maximum recursion depth
 * @param previous
 * @param value
 * @param depth
 */
declare function hasObjectChanged(previous: Record<string, unknown>, value: Record<string, unknown>, depth: number): boolean;

/**
 * Checks if an object is tainted (i.e. marked dirty, despite potentially having the same reference than in the
 * past rendering cycle)
 *
 * @param what
 */
declare function isTainted<T>(what: T): boolean;
/**
 * Reset tainted flags
 */
declare function clearTainted(): void;
/**
 * Mark an object as tainted. This both marks the object as tainted and checks which other
 * components reference this specific object currently, and marks those as requiring a re-render.
 *
 * @param what
 * @param recursive
 */
declare function markChanged<T extends object | unknown[]>(what: T, recursive?: boolean): void;

declare type Full<T> = {
    full: true;
} & {
    val: T;
};
declare type DeepPartialOrFull<T> = {
    [P in keyof T]?: DeepPartialOrFull<T[P]> | Full<T[P]>;
};
declare function replaceWith<T>(val: T): Full<T>;
declare function immodify<T>(on: T, modifier: DeepPartialOrFull<T>): T;

declare namespace jsep {
    export interface Expression {
        type: ExpressionType;
    }
    export interface ArrayExpression extends Expression {
        type: "ArrayExpression";
        elements: Expression[];
    }
    export interface BinaryExpression extends Expression {
        type: "BinaryExpression";
        operator: string;
        left: Expression;
        right: Expression;
    }
    export interface CallExpression extends Expression {
        type: "CallExpression";
        arguments: Expression[];
        callee: Expression;
    }
    export interface Compound extends Expression {
        type: "Compound";
        body: Expression[];
    }
    export interface ConditionalExpression extends Expression {
        type: "ConditionalExpression";
        test: Expression;
        consequent: Expression;
        alternate: Expression;
    }
    export interface Identifier extends Expression {
        type: "Identifier";
        name: string;
    }
    export interface Literal extends Expression {
        type: "Literal";
        value: boolean | number | string;
        raw: string;
    }
    export interface LogicalExpression extends Expression {
        type: "LogicalExpression";
        operator: string;
        left: Expression;
        right: Expression;
    }
    export interface MemberExpression extends Expression {
        type: "MemberExpression";
        computed: boolean;
        object: Expression;
        property: Expression;
    }
    export interface ThisExpression extends Expression {
        type: "ThisExpression";
    }
    export interface UnaryExpression extends Expression {
        type: "UnaryExpression";
        operator: string;
        argument: Expression;
        prefix: boolean;
    }
    type ExpressionType = "Compound" | "Identifier" | "MemberExpression" | "Literal" | "ThisExpression" | "CallExpression" | "UnaryExpression" | "BinaryExpression" | "LogicalExpression" | "ConditionalExpression" | "ArrayExpression";
    export {};
}

declare enum ExpressionType {
    VariableUsage = 0,
    ComplexExpression = 1,
    ConstantExpression = 2,
    FunctionReferenceExpression = 3
}
declare type BaseExpression = {
    expressionType: ExpressionType;
};
declare type VariableUsageExpression = {
    expressionType: ExpressionType.VariableUsage;
    variableName: string;
} & BaseExpression;
declare type ComplexExpression = {
    expressionType: ExpressionType.ComplexExpression;
    usedVariableNames: string[];
    expression: jsep.Expression;
    originalExpression: string;
    compiledExpression: (what: unknown) => unknown;
} & BaseExpression;
declare type FunctionReferenceExpression = {
    expressionType: ExpressionType.FunctionReferenceExpression;
    usedVariableNames: string[];
    expression: jsep.Expression;
    originalExpression: string;
    compiledExpression: (what: unknown) => unknown;
} & BaseExpression;
declare type ConstantExpression = {
    expressionType: ExpressionType.ConstantExpression;
    value: unknown;
} & BaseExpression;

declare enum MappingType {
    childVariable = 0,
    attribute = 1,
    attributeRef = 2,
    specialAttribute = 3
}
declare type ValueTransformerFn = <T>(node: Node, value: T) => T;
declare type VariableMappingBase<T extends MappingType> = {
    indexes: number[];
    type: T;
    expression: BaseExpression;
    valueTransformer?: ValueTransformerFn | SpecialAttributeValueTransformerFn;
};
declare type VariableMapping = VariableMappingBase<MappingType>;
declare type ChildVariable = VariableMappingBase<MappingType.childVariable>;
declare type AttributeVariable = {
    attributeName: string;
    hidden?: boolean;
} & VariableMappingBase<MappingType.attribute>;
declare type AttributeRefVariable = VariableMappingBase<MappingType.attributeRef>;
declare type SpecialAttributeVariable = {
    specialAttributeRegistration: SpecialAttributeRegistration;
    attributeName: string;
    hidden?: boolean;
} & VariableMappingBase<MappingType.specialAttribute>;
declare type VariablesByNodeIndex = {
    indexes: number[];
    mappings: {
        [variableName: string]: VariableMapping[];
        __constants: VariableMapping[];
    };
};
declare type SpecialAttributeValueTransformerFn = (element: Element, valuesBySlot: Record<string, unknown>) => unknown;
declare type SpecialAttributeHandlerFnResult = {
    transformedElement?: HTMLElement;
    valueTransformer?: SpecialAttributeValueTransformerFn;
    remapAttributeName?: (attributeNameProvided: string) => string;
};
declare type SpecialAttributeHandlerFn = (elem: Element) => SpecialAttributeHandlerFnResult;
declare type SpecialAttributeRegistration = {
    id: string;
    precedence: number;
    attributeName: string;
    handler: SpecialAttributeHandlerFn;
    hidden?: boolean;
};
declare type VariableMappings = {
    all: {
        [variableName: string]: VariableMapping[];
        __constants: VariableMapping[];
    };
    sorted: VariablesByNodeIndex[];
};
declare type FoundVariables = {
    variables: VariableMappings;
    newRootElement: Element;
};

interface Stateful {
    getOwner: () => ModrnHTMLElement;
    state: {
        [name: string]: unknown;
    };
    update: () => void;
    disconnected: (() => void)[];
}
declare type ComponentInfo = {
    isSpecialAttribute: boolean;
    tagName: string;
    componentName: string;
    registeredComponent: RegisteredComponent<unknown, unknown>;
    content: Fragment | null;
};
interface ComponentState extends Stateful {
    addedChildElements: WeakSet<ChildNode>;
    previousChild: Fragment | null;
    customProps: Record<string, unknown>;
    getOwner: () => ModrnHTMLElement;
}
declare abstract class ModrnHTMLElement extends HTMLElement {
    componentInfo?: ComponentInfo;
    state?: ComponentState;
    initialPreviousChild?: Fragment;
    initialCustomProps?: Record<string, unknown>;
    abstract update(): void;
    abstract notifyChildrenChanged(childFragment: Fragment): void;
    abstract copyTo(other: ModrnHTMLElement): void;
}
/**
 * A fragment is the encapsulation of a html template analyzed for contained variables.
 */
declare type Fragment = {
    childElement: Element | null;
    variableDefinitions: VariableMappings | null;
};

declare type ParamType<K1 = never, K2 = never, K3 = never, K4 = never> = [
    K1
] extends [never] ? [] : [
    K2
] extends [never] ? [K1] : [
    K3
] extends [never] ? [K1, K2] : [
    K4
] extends [never] ? [K1, K2, K3] : [
    K1,
    K2,
    K3,
    K4
];
declare type State<T> = [
    T,
    (newState: T, silent?: boolean) => T
];
declare type MutableState<T> = [
    T,
    () => void
];
declare type StateToken<T> = {
    id: string;
    dummy: T;
};
declare function createState<T>(prefix?: string): StateToken<T>;
declare function getOrCreateElementAttachedState<T>(prefix: string, element: Element): StateToken<T>;
declare function getOrCreateTokenAttachedState<T, K>(prefix: string, otherTokenProvided: StateToken<K>): StateToken<T>;
declare function useStateInternal<T, K extends StateToken<T>>(token: K, context: Stateful, initial: T | (() => T)): State<T>;
declare function getStateInternal<T, K extends StateToken<T>>(token: K, context: Stateful): State<T>;
declare function mutableStateInternal<T, K extends StateToken<T>>(token: K, context: Stateful): MutableState<T>;
declare type RawStateFunction = {
    stateContext: WeakRef<Stateful>;
    stateId: string;
};
declare type PureStateFunction<K1 = never, K2 = never, K3 = never, K4 = never> = ((...rest: ParamType<K1, K2, K3, K4>) => void) & RawStateFunction;
declare type WrappedFunction<T, K1 = never, K2 = never, K3 = never, K4 = never> = (state: T, ...args: ParamType<K1, K2, K3, K4>) => DeepPartialOrFull<T> | undefined | void;
declare function purifyInternal<T extends Record<string, unknown>, K extends StateToken<T>, K1 = never, K2 = never, K3 = never, K4 = never>(context: Stateful, token: K, fn: WrappedFunction<K["dummy"], K1, K2, K3, K4>): PureStateFunction<K1, K2, K3, K4>;

declare type ChangeHookState = {
    previous: unknown;
    initial: boolean;
};
declare type ChangeHookStateToken = StateToken<ChangeHookState> & {
    depth: number;
};
declare type ChangeHandlerFn<T> = (now: T, previous: T) => void;
/**
 * Creates a change hook. depth specifies the maximum recursion depth to compare the two objects
 * @param depth - maximum recursion depth
 */
declare function createChangeHook(depth?: number): ChangeHookStateToken;
/**
 * Gets or creates an element-attached change hook-
 * @param prefix - the prefix to disambiguate multiple attached states on the same element
 * @param element - the element to attach the state to
 * @param depth - maximum recusrion depth
 */
declare function getOrCreateElementAttachedChangeHook(prefix: string, element: Element, depth?: number): ChangeHookStateToken;
/**
 * Gets or creates a change hook attached on another state
 * @param prefix - the prefix to disambiguate multiple attached states on the same element
 * @param otherToken - the other state to attach this change hook to
 * @param depth - maximum recusrion depth
 */
declare function getOrCreateTokenAttachedChangeHook<T>(prefix: string, otherToken: StateToken<T>, depth?: number): ChangeHookStateToken;
/**
 * Tracks changes to the provided value, which must be not null. Change is detected recursively up to the depth when
 * creating the state token.
 * @see createChangeHook
 * @see getOrCreateElementAttachedChangeHook
 *
 * @param stateToken
 * @param value
 * @param changeHandlerFn
 */
declare function useChange<T>(stateToken: ChangeHookStateToken, value: NonNullable<T>, changeHandlerFn?: ChangeHandlerFn<T>): boolean;

declare function useDisconnect(fn: () => void): void;

declare type EventListener<T, W> = {
    addEventListener(type: T, listener: (this: W, ev: never) => any, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<T>(type: T, listener: (this: W, ev: never) => any, options?: boolean | AddEventListenerOptions): void;
};
declare type EventListenerState = {
    listener: (this: never, ev: never) => any;
};
declare type EventListenerStateToken = StateToken<EventListenerState>;
declare function createEventListener(): EventListenerStateToken;
declare function useEventListener<T, W>(token: EventListenerStateToken, on: EventListener<T, W>, type: T, listener: (this: W, ev: never) => any): void;

declare type RefMap = {
    [refId: string]: WeakRef<HTMLElement>;
};
declare type RefState = {
    refs: RefMap;
};
declare type RefStateToken = StateToken<RefState>;
declare function createRef(): RefStateToken;
declare type Ref = HTMLElement[];
declare type RefInternal = Ref & {
    "__addRef": (htmlElement: HTMLElement) => void;
    "__update": () => void;
};
/**
 * Create a ref given the state token. Refs are always lists of elements which are returned from the rendering function
 * and which are recognized by the variable substitution process by updating the ref'ed elements then on the fly.
 * That means that to have access to refs, another render cycle needs to follow. The variable substitution process
 * informs the ref container by calling 'addRef' or 'update' on it.
 *
 * All refs are held as WeakRef; this should avoid garbage collection load. Refs are also checked for dom-containment,
 * so if a ref is not in the dom anymore, the ref is automatically dropped.
 *
 * @param stateToken
 */
declare function useRef(stateToken: RefStateToken): Ref;

declare function useState<T, K extends StateToken<T>>(token: K, initial: K["dummy"] | (() => K["dummy"])): State<K["dummy"]>;
declare function getState<T, K extends StateToken<T>>(token: K): State<K["dummy"]>;
declare function mutableState<T, K extends StateToken<T>>(token: K): MutableState<K["dummy"]>;
declare function purify<T extends Record<string, unknown>, K extends StateToken<T>, K1 = never, K2 = never, K3 = never, K4 = never>(token: K, fn: WrappedFunction<K["dummy"], K1, K2, K3, K4>): PureStateFunction<K1, K2, K3, K4>;

declare function useLocalStorageState<T, K extends StateToken<NonNullable<T>>>(token: K, initial: NonNullable<K["dummy"]> | (() => K["dummy"]), localStorageKey: string, depth?: number): State<K["dummy"]>;

/**
 * This is the main function of the children handling. There are other variants following in this file, but this is the
 * central function.
 *
 * The basic process is to store the previously existing children in a state, and to compare each render cycle if props,
 * template or number of children change, and if so, to re-render those accordingly.
 *
 * @param stateToken
 * @param items
 * @param configFn
 * @param templateIfMissing
 */
declare function useTemplatedChildren<T, P extends Record<string, unknown>>(stateToken: ChildrenStateToken, items: T[], configFn: ChildConfigurationFunction<T, P>, templateIfMissing?: Fragment): ChildCollection;
declare type ChildWithKey = {
    childKey: string;
    child: Element;
    props: unknown;
};
declare type ChildrenByKey = {
    [childKey: string]: ChildWithKey;
};
declare type TemplatedChildrenByKey = {
    source: RegisteredComponent<unknown, unknown> | Element | string;
    template: Fragment;
};
declare type ChildConfiguration<P extends Record<string, unknown>> = {
    props: P;
    key: string;
    template?: Fragment;
    forceUpdate?: boolean;
};
declare type ChildConfigurationFunction<T, P extends Record<string, unknown>> = (data: T, index: number) => ChildConfiguration<P>;
declare type ChildrenStateToken = StateToken<ChildrenByKey>;
declare function createChildrenState(): ChildrenStateToken;
declare type TemplatedChildrenStateToken = StateToken<TemplatedChildrenByKey>;
declare function createTemplatedChildrenState(): TemplatedChildrenStateToken;
declare function useTemplate(sourceProvided: HTMLElement | string | RegisteredComponent<unknown, unknown>, childProps?: Record<string, unknown>, childStateToken?: ChildrenStateToken): ChildCollection;
declare function useChild(childProps: Record<string, unknown> | null, childStateToken?: ChildrenStateToken): ChildCollection;
declare function useModrnChild<T, R>(childStateToken: ChildrenStateToken, component: RegisteredComponent<T, R>, props: (T & Record<string, unknown>) | null): ChildCollection;
declare function useModrnChildren<T, R>(childStateToken: ChildrenStateToken, component: RegisteredComponent<T, R>, props: (T & Record<string, unknown>)[]): ChildCollection;
declare function useChildren<T>(iterateOver: T[], basicChildProps: Record<string, unknown>, itemAs?: string, indexAs?: string, childStateToken?: ChildrenStateToken): ChildCollection;

declare type ComponentBuilderBase = {
    register: () => void;
};
declare type ComponentBuilderHtml = {
    html: <T extends ComponentBuilderHtml & ComponentBuilderBase>(this: T, html: string) => Omit<T, "html">;
};
declare type ComponentBuilderTransparent = {
    transparent: <T extends ComponentBuilderTransparent & ComponentBuilderBase>(this: T) => Omit<T, "transparent">;
};
declare type ComponentBuilderDynamicChildren = {
    dynamicChildren: <T extends ComponentBuilderDynamicChildren & ComponentBuilderBase>(this: T) => Omit<T, "dynamicChildren">;
};
declare type ComponentBuilderFilters = {
    withFilters: <T extends ComponentBuilderFilters & ComponentBuilderBase>(this: T, filters: Filters) => Omit<T, "withFilters">;
};
declare type ComponentBuilder<T, R> = {
    register: () => RegisteredComponent<T, R>;
} & ComponentBuilderHtml & ComponentBuilderTransparent & ComponentBuilderDynamicChildren & ComponentBuilderFilters;

declare type ComponentRegistry = {
    [componentName: string]: ComponentInfo;
};
declare type HasConnectedFunction = (self: ModrnHTMLElement, componentInfo: ComponentInfo) => void;
declare type NotifyChildrenChangedFunction = (self: ModrnHTMLElement, componentInfo: ComponentInfo, childFragment: Fragment) => void;
declare type DisconnectedFunction = (self: ModrnHTMLElement, componentInfo: ComponentInfo) => void;
/**
 * Checks if the provided tagName (html-named) is already registered
 * @param tagName
 */
declare function isRegisteredTagName(tagName: string): boolean;
/**
 * Returns a copy of the component registry
 */
declare function getComponentRegistry(): ComponentRegistry;
/**
 * Adds a component to the global registry without directly registering it as custom element.
 * @param componentName the js-name of the new component (i.e. without dashes)
 * @param component the component to register
 */
declare function addToComponentRegistry(componentName: string, component: RegisteredComponent<unknown, unknown>): ComponentInfo;
declare function getAndResetComponentsToRegister(): ComponentInfo[];
/**
 * Returns the component info for a certain registered component
 * @param registeredComponent
 */
declare function getComponentInfoOf(registeredComponent: RegisteredComponent<unknown, unknown>): ComponentInfo | undefined;

declare type RenderQueueElement = {
    element: WeakRef<ModrnHTMLElement>;
};
declare function getAndResetRenderQueue(): RenderQueueElement[];
declare function requestRender(selfProvided: ModrnHTMLElement | string): void;
declare function getRenderQueueLength(): number;
declare function isTestingModeActive(): boolean;
declare function setTestingModeActive(): void;
declare function requestUpdate(): void;
declare function cancelUpdate(): void;
declare function setFrameRequestCallback(_frameRequestCallback: FrameRequestCallback): void;

/**
 * Analyzes the provided root element to a fragment.
 * @see Fragment
 *
 * @param rootElement
 */
declare function analyzeToFragment(rootElement: Element): Fragment;

/**
 * Substitute variables in the children of the provided ModrnHTMLElement.
 *
 * It is important to keep in mind that the variable definition's ".sorted" contains a list of referenced variables sorted by child node
 * in ascending depth order.
 *
 * The process outlined is:
 *      - For each child node in the template which is referencing variables,
 *        - Check if constants must be applied
 *        - For all variables *defined in the varsProvided* parameter, check if this childnode uses that variable at all; if not, skip
 *        - Then iterate all variable references using the current variable from varsProvided
 *        - If it is a complex expression (i.e. potentially referencing more than just one variable from varsProvided), check if it was already calculated
 *        - Set the value to the variable value or expression result
 *      - Repeat
 *
 * Initially the process was to just iterate over varsProvided, but this has proven not as effective since it meant searching a child node
 * multiple times, and potentially updating it also multiple times (instead of one time, then queueing a re-render after being finished)
 *
 * For now this is good enough; maybe i'Ll revert it to the previous algorithm with kind of in-place-node-ordering/caching, but the gain does not outweigh
 * the cost right now. Should this ever be used with large(ish) apps, it shouldn't pose a problem to optimize according to the then-real world scenario.
 *
 * @param self
 * @param root
 * @param varsProvided
 * @param variableDefinitionsProvided
 * @param suppressReRender
 */
declare function substituteVariables(self: ModrnHTMLElement, root: Element, varsProvided: Vars, variableDefinitionsProvided?: VariableMappings, suppressReRender?: boolean): void;
declare type VarOptions = {
    hideByDefault?: boolean;
};
declare type Vars = Record<string, unknown> & {
    "__options"?: VarOptions;
};
declare function varsWithOptions(vars: Record<string, unknown>, options: VarOptions): Vars;

/**
 * Declares a module consisting of the provided registered components. Modules will later be registered by calling
 * start with the list of modules. The declaration is global, since web components are globally registered.
 * @see modrn
 *
 * @example
 * const myComponent = makeComponent().html(`<h1>Hello world</h1>`).register();
 * const myModule = declare({myComponent});
 *
 * @param module the Module consisting of registered components to declare
 */
declare function declare<M, K extends keyof M>(module: Module<M, K>): ModuleResult<M, K>;
/**
 * Creates a component, having a defined set of props (optional) and a render function (also optional). If the render function
 * is omitted, the props are passed directly to the template as variables. If props are omitted, the component does not have any props.
 *
 * The return value is a builder, which allows to further configure the component {@see ComponentBuilder} like for example making the
 * component transparent (i.e. passing all incoming props to the resulting template variables, even if not returned) or declaring
 * the component expects dynamic children (commonly named "slots").
 *
 * @param propsType - The expected props (optional)
 * @param renderFn - The render function (optional)
 */
declare function makeComponent<T, R>(propsType?: Container & T, renderFn?: (props: T & AllProps) => R | null): ComponentBuilder<T, R>;

/**
 * Adds a module to the global registry by adding each individual registered component.
 *
 * @param module
 */
declare function registerModule<M, K extends keyof M>(module: Module<M, K>): void;
/**
 * Updates the component registry with the static initialization result of the component (js-named, i.e.
 * without dashes)
 * @param componentName
 * @param content
 */
declare function setStaticInitializationResultForComponent(componentName: string, content: Fragment): void;
/**
 * Registers the component and creates a custom element for it.
 * @param componentInfo - the component
 * @param hasConnectedFn - the connected callback function (called when mounted)
 * @param notifyChildrenChangedFn - the (custom) callback function when dynamic children change
 * @param disconnectedFn - the disconnected callback function (called when unmounted)
 */
declare function register(componentInfo: ComponentInfo, hasConnectedFn: HasConnectedFunction, notifyChildrenChangedFn: NotifyChildrenChangedFunction, disconnectedFn: DisconnectedFunction): CustomElementConstructor;
/**
 * Register all components in the component registry at once.
 * @see register
 *
 * @param hasConnectedFn
 * @param notifyChildrenChangedFn
 * @param disconnectedFn
 */
declare function registerAll(hasConnectedFn: HasConnectedFunction, notifyChildrenChangedFn: NotifyChildrenChangedFunction, disconnectedFn: DisconnectedFunction): void;

declare type BoundFn<T, R> = ((...params: T[]) => R) & {
    bound: true;
    dynamic: boolean;
};
/**
 * Returns or creates the empty state for the element
 * @param self
 */
declare function getStateOf(self: ModrnHTMLElement): ComponentState;
/**
 * Returns the current state context during rendering
 */
declare function getCurrentStateContext(): Stateful;
/**
 * Wraps the provided function with the state, preserving the state context stack
 * @param state
 * @param fn
 * @param params
 */
declare function withState<T, R>(state: Stateful, fn: (...params: T[]) => R, ...params: T[]): R;
/**
 * Explicitly declares the provided function as dynamic. This has the effect that the function is newly instantiated
 * during each render and thus sees all props always. This has some performance implications, and it is preferable to
 * use state-bound functions instead (state is always up-to-date) and should be avoided where not necessary.
 *
 * @param fn
 * @param params
 */
declare function dynamic<T, R>(fn: (...params: T[]) => R, ...params: T[]): (...params: T[]) => R;
/**
 * Binds the provided function to the current state context, if not already bound.
 * @see withState
 *
 * @param fn
 * @param params
 */
declare function bindToStateContext<T, R>(fn: (...params: T[]) => R, ...params: T[]): (...params: T[]) => R;

/**
 * Performs the static (one-time) initialization for the provided component.
 * @param componentName
 * @param component
 */
declare function componentStaticInitialize(componentName: string, component: RegisteredComponent<unknown, unknown>): void;
/**
 * Statically initialize all components currently registered
 * @param componentRegistry
 */
declare function initializeAll(componentRegistry: ComponentRegistry): void;

/**
 * Component has connected callback function. This function may be called multiple times and guards itself against that.
 * @param self
 * @param componentInfo
 */
declare function componentHasConnected(self: ModrnHTMLElement, componentInfo: ComponentInfo): void;
/**
 * Called when the component unmounts. Calls disconnect functions
 * @param self
 */
declare function componentHasDisconnected(self: ModrnHTMLElement): void;
/**
 * Called when the dynamic children change. Does not implicitly re-render, since this is usually happening
 * inside a render cycle.
 *
 * @param self
 * @param componentInfo
 * @param childFragment
 */
declare function childrenChanged(self: ModrnHTMLElement, componentInfo: ComponentInfo, childFragment: Fragment): void;
/**
 * Mostly to help tests: this method registers *and* initializes the provided component in one go.
 * @param componentName
 * @param component
 */
declare function only(componentName: string, component: RegisteredComponent<unknown, unknown>): ComponentInfo;

declare function cloneDeep(root: Element): Element;

declare function logDiagnostic(...rest: any[]): void;
declare function logWarn(...rest: any[]): void;

export { AllProps, AttributeRefVariable, AttributeVariable, BaseExpression, BoundFn, ChangeHandlerFn, ChangeHookState, ChangeHookStateToken, ChildCollection, ChildVariable, ChildrenStateToken, ComplexExpression, ComponentBuilder, ComponentBuilderBase, ComponentBuilderDynamicChildren, ComponentBuilderFilters, ComponentBuilderHtml, ComponentBuilderTransparent, ComponentInfo, ComponentRegistry, ComponentState, ConstantExpression, Container, DeepPartialOrFull, DisconnectedFunction, ElementRefs, ExpressionType, Filters, FoundVariables, Fragment, FunctionReferenceExpression, HasConnectedFunction, MappingType, ModrnHTMLElement, Module, ModuleResult, MutableState, NoProps, NotifyChildrenChangedFunction, ParamType, PureStateFunction, RawStateFunction, Ref, RefInternal, RefMap, RefState, RegisteredComponent, RenderQueueElement, SpecialAttributeHandlerFn, SpecialAttributeHandlerFnResult, SpecialAttributeRegistration, SpecialAttributeValueTransformerFn, SpecialAttributeVariable, State, StateToken, Stateful, TemplatedChildrenStateToken, ValueTransformerFn, VariableMapping, VariableMappingBase, VariableMappings, VariableUsageExpression, VariablesByNodeIndex, WrappedFunction, addToComponentRegistry, analyzeToFragment, bindToStateContext, cancelUpdate, childrenChanged, clearTainted, cloneDeep, componentHasConnected, componentHasDisconnected, componentStaticInitialize, createChangeHook, createChildrenState, createEventListener, createRef, createState, createTemplatedChildrenState, declare, dynamic, getAndResetComponentsToRegister, getAndResetRenderQueue, getComponentInfoOf, getComponentRegistry, getCurrentStateContext, getOrCreateElementAttachedChangeHook, getOrCreateElementAttachedState, getOrCreateTokenAttachedChangeHook, getOrCreateTokenAttachedState, getRenderQueueLength, getState, getStateInternal, getStateOf, hasArrayChanged, hasChanged, hasObjectChanged, immodify, initializeAll, isRegisteredTagName, isTainted, isTestingModeActive, logDiagnostic, logWarn, m, mArray, mBool, mChild, mDate, mEventHandler, mFunction, mNumber, mObj, mRef, mString, makeComponent, markChanged, modrn, mutableState, mutableStateInternal, only, purify, purifyInternal, register, registerAll, registerModule, replaceWith, requestRender, requestUpdate, setFrameRequestCallback, setStaticInitializationResultForComponent, setTestingModeActive, sigDate, sigElementRefs, sigEventHandler, sigFunction, substituteVariables, useChange, useChild, useChildren, useDisconnect, useEventListener, useLocalStorageState, useModrnChild, useModrnChildren, useRef, useState, useStateInternal, useTemplate, useTemplatedChildren, varsWithOptions, withState };
