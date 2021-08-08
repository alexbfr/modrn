export declare class TestUtils {
    /**
     * Renders a given element with provided attributes
     * and returns a promise which resolves as soon as
     * rendered element becomes available.
     * @param {string} tag
     * @param {object} attributes
     * @returns {Promise<HTMLElement>}
     */
    static render(tag: string, attributes?: any): Promise<unknown>;
    /**
     * Replaces document's body with provided element
     * including given attributes.
     * @param {string} tag
     * @param {object} attributes
     */
    static _renderToDocument(tag: string, attributes: any): void;
    /**
     * Converts an object to HTML string representation of attributes.
     *
     * For example: `{ foo: "bar", baz: "foo" }`
     * becomes `foo="bar" baz="foo"`
     *
     * @param {object} attributes
     * @returns {string}
     */
    static _mapObjectToHTMLAttributes(attributes: any): string;
    /**
     * Returns a promise which resolves as soon as
     * requested element becomes available.
     * @param {string} tag
     * @returns {Promise<HTMLElement>}
     */
    static _waitForComponentToRender(tag: string): Promise<unknown>;
}
