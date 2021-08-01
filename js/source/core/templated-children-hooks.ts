import {ComponentState, Fragment, getComponentInfoOf, getCurrentStateContext} from "./component-registry";
import {substituteVariables} from "./variable-substition/substitute-variables";
import {createState, StateToken} from "../util/state";
import {useState} from "./state-hooks";
import {nextId} from "../util/next-id";
import {RegisteredComponent} from "./component-declaration";
import {analyzeToFragment} from "./component-static-initialize";
import {cloneDeep} from "../util/cloneDeep";

type ChildWithKey = {
    childKey: string;
    child: HTMLElement;
    props: unknown;
}

type ChildrenByKey = {
    [childKey: string]: ChildWithKey
}

type TemplatedChildrenByKey = {
    source: RegisteredComponent<unknown, unknown> | HTMLElement | string;
    template: Fragment;
}

type ChildConfiguration<P extends Record<string, unknown>> = {
    props: P;
    key: string;
    template?: Fragment;
    forceUpdate?: boolean;
}

type ChildConfigurationFunction<T, P extends Record<string, unknown>> = (data: T, index: number) => ChildConfiguration<P>;

export type ChildCollection = {
    elements: HTMLElement[];
    "__childCollection": true;
};

function getTemplateId(child: HTMLElement) {
    const existingTemplateId = child.getAttribute("template-id");
    if (!existingTemplateId) {
        const templateId = nextId();
        child.setAttribute("template-id", templateId);
        return templateId;
    }
    return existingTemplateId;
}

export type ChildrenStateToken = StateToken<ChildrenByKey>;

export function createChildrenState(): ChildrenStateToken {
    return createState<ChildrenByKey>();
}

export type TemplatedChildrenStateToken = StateToken<TemplatedChildrenByKey>;

export function createTemplatedChildrenState(): TemplatedChildrenStateToken {
    return createState<TemplatedChildrenByKey>();
}

const defaultChildrenState = createChildrenState();
const defaultTemplatedChildrenState = createTemplatedChildrenState();

type HTMLTemplateMap = WeakMap<HTMLElement, Fragment>;
type StringTemplateMap = {[source: string]: Fragment};

const htmlTemplateMap: HTMLTemplateMap = new WeakMap<HTMLElement, Fragment>();
const stringTemplateMap: StringTemplateMap = {};

function createTemplateFromString(source: string) {
    const element = document.createElement("div");
    element.style.display = "contents";
    element.innerHTML = source;
    return analyzeToFragment(element);
}

function createTemplateFromHTMLElement(source: HTMLElement) {
    return analyzeToFragment(source);
}

function resolveIdReferenceIfApplicable(sourceProvided: HTMLElement | string): HTMLElement | string {
    let source: HTMLElement | string | null = sourceProvided;
    if (typeof source === "string" && source.startsWith("#")) {
        const root = getCurrentStateContext().getOwner();
        const found = root.componentInfo?.content?.childElement?.querySelector(source)
            || document.getElementById(source);
        if (found instanceof HTMLTemplateElement) {
            source = found.innerHTML;
        } else if (found instanceof HTMLElement) {
            source = found;
        } else {
            throw new Error(`Invalid source ${source} from provided source ${sourceProvided}`);
        }
    }
    return source;
}

export function useTemplate(sourceProvided: HTMLElement | string | RegisteredComponent<unknown, unknown>, childProps?: Record<string, unknown>, childStateToken = defaultChildrenState): ChildCollection {

    if ((sourceProvided as RegisteredComponent<unknown, unknown>).htmlTemplate) {
        return useModrnChild(childStateToken, sourceProvided as RegisteredComponent<unknown, unknown>, childProps || {});
    }

    const childrenState = useState(defaultTemplatedChildrenState, {source: ""} as TemplatedChildrenByKey);
    let state = childrenState[0];
    const setState = childrenState[1];
    let source = resolveIdReferenceIfApplicable(sourceProvided as (HTMLElement | string));

    if (source !== state.source) {
        if (typeof source === "string") {
            if (source.startsWith("#")) {
                const byId = getCurrentStateContext()?.getOwner()?.componentInfo?.content?.childElement?.querySelector(source);
                if (byId instanceof HTMLElement) {
                    source = byId.innerHTML;
                } else {
                    throw new Error(`Couldn't find template by selector ${source} on element ${sourceProvided}`);
                }
            }
            const template = stringTemplateMap[source] || (stringTemplateMap[source] = createTemplateFromString(source));
            state = setState({...state, template}, true);
        } else {
            let template = htmlTemplateMap.get(source);
            if (!template) {
                template = createTemplateFromHTMLElement(source);
                htmlTemplateMap.set(source, template);
            }
            state = setState( {...state, template}, true);
        }
    }

    return useTemplatedChildren(childStateToken, childProps ? [null] : [], () => ({key: "__1", props: childProps || {}, template: state.template}));
}

export function useChild(childProps: Record<string, unknown> | null, childStateToken = defaultChildrenState): ChildCollection {
    const {previousChild} = getCurrentStateContext() as ComponentState;
    return useTemplatedChildren(childStateToken, (previousChild && childProps) ? [null] : [], () => ({key: "__1", props: childProps || {}}));
}

export function useModrnChild<T, R>(childStateToken: ChildrenStateToken, component: RegisteredComponent<T, R>, props: (T & Record<string, unknown>) | null): ChildCollection {
    const fragment = getComponentInfoOf(component)?.content;
    if (!props || !fragment) {
        return useTemplatedChildren(childStateToken, [], () => ({key: "__1", props: {}}));
    }
    return useTemplatedChildren(childStateToken, [null], () => {
        return {
            key: "__1",
            props,
            template: fragment
        };
    });
}

export function useModrnChildren<T, R>(childStateToken: ChildrenStateToken, component: RegisteredComponent<T, R>, props: (T & Record<string, unknown>)[]): ChildCollection {
    const fragment = getComponentInfoOf(component)?.content;
    if (!props || !fragment) {
        return useTemplatedChildren(childStateToken, [], () => ({key: "__1", props: {}}));
    }
    return useTemplatedChildren(childStateToken, props, (data: Record<string, unknown>, index: number) => {
        return {
            key: "" + index,
            props: data,
            template: fragment
        };
    });
}

const useChildrenState = createChildrenState();

export function useChildren<T>(iterateOver: T[], basicChildProps: Record<string, unknown>, itemAs = "item", indexAs="index", childStateToken = useChildrenState): ChildCollection {
    return useTemplatedChildren(childStateToken, iterateOver, (item, index) => ({
        key: "" + index,
        props: {...basicChildProps, [itemAs]: item, [indexAs]: index}
    }));
}

export function useTemplatedChildren<T, P extends Record<string, unknown>>(
    stateToken: ChildrenStateToken, items: T[], configFn: ChildConfigurationFunction<T, P>, templateIfMissing?: Fragment): ChildCollection {

    const {previousChild, getOwner} = getCurrentStateContext() as ComponentState;
    const [childrenByKey, setChildrenByKey] = useState(stateToken, {});
    const baseTemplate = templateIfMissing || previousChild;

    const result: ChildCollection = {elements: [], __childCollection: true};
    const usedChildrenKeys: {[key: string]: true} = {};
    const length = items.length;
    let madeChanges = Object.keys(childrenByKey).length !== length;

    for (let index = 0; index < length; ++index) {
        const configuration = configFn(items[index], index);
        const template = configuration.template || baseTemplate;
        if (!template?.childElement) {
            throw new Error(`No template for child #${index}, key ${configuration.key}`);
        }
        if (!template.variableDefinitions) {
            throw new Error(`No variable definitions for child #${index}, key ${configuration.key} in template`);
        }
        usedChildrenKeys[configuration.key] = true;
        const oldChild = childrenByKey[configuration.key];
        if (oldChild && (oldChild.props === configuration.props && !configuration.forceUpdate)) {
            continue;
        }
        madeChanges = true;
        const oldChildTemplateId = oldChild && getTemplateId(oldChild.child);
        const newChildTemplateId = getTemplateId(template.childElement);
        let childToApplyPropsOn: HTMLElement;
        let suppress = false;
        if (oldChildTemplateId !== newChildTemplateId) {
            childToApplyPropsOn = cloneDeep(template.childElement);
            suppress = true;
        } else {
            childToApplyPropsOn = oldChild.child;
        }
        substituteVariables(getOwner(), childToApplyPropsOn, configuration.props, template.variableDefinitions, suppress);
        result.elements.push(childToApplyPropsOn);
        childrenByKey[configuration.key] = {
            child: childToApplyPropsOn,
            props: configuration.props,
            childKey: configuration.key
        };
    }

    if (madeChanges) {
        const previousKeys = Object.keys(childrenByKey);
        for (const previousKey of previousKeys) {
            if (!usedChildrenKeys[previousKey]) {
                delete childrenByKey[previousKey];
            }
        }
        setChildrenByKey(childrenByKey, true);
    }

    return result;
}
