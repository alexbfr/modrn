import isDate from "date-fns/isDate";
import parseISO from "date-fns/parseISO";
import formatISO from "date-fns/formatISO";

export type JsonRequestInit = Omit<RequestInit, "body"> & {
    body?: Record<string, unknown>
};

const utcPattern = new RegExp("[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}Z");

function reviver(this: any, key: string, value: any): any {
    if (utcPattern.test(value)) {
        return parseISO(value);
    }
    return value;
}

function replacer(this: any, key: string, value: any): any {
    const val = this[key];
    if (val && typeof(val) === "object" && isDate(val)) {
        return formatISO(val);
    }
    return value;
}

export async function jsonFetch<T>(input: RequestInfo, init?: JsonRequestInit): Promise<T> {

    const body = init?.body ? JSON.stringify(init.body, replacer) : undefined;

    const requestInit = {...init, body};

    return fetch(input, requestInit)
        .then(async result => JSON.parse(await result.text(), reviver));
}
