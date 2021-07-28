/* eslint-disable */

import {__testing__setDomContentLoaded} from "../util/wait-until-dom-content-loaded";

export class TestUtils {
    /**
     * Renders a given element with provided attributes
     * and returns a promise which resolves as soon as
     * rendered element becomes available.
     * @param {string} tag
     * @param {object} attributes
     * @returns {Promise<HTMLElement>}
     */
    static render(tag: string, attributes: any = {}) {
        TestUtils._renderToDocument("div", {});
        return TestUtils._waitForComponentToRender("div").then(() => {
            TestUtils._renderToDocument(tag, attributes);
            return TestUtils._waitForComponentToRender(tag);
        }).then(result => {
            __testing__setDomContentLoaded();
            return result;
        });
    }

    /**
     * Replaces document's body with provided element
     * including given attributes.
     * @param {string} tag
     * @param {object} attributes
     */
    static _renderToDocument(tag: string, attributes: any) {
        const htmlAttributes = TestUtils._mapObjectToHTMLAttributes(attributes);
        document.body.innerHTML = `<${tag} ${htmlAttributes}></${tag}>`;
    }

    /**
     * Converts an object to HTML string representation of attributes.
     *
     * For example: `{ foo: "bar", baz: "foo" }`
     * becomes `foo="bar" baz="foo"`
     *
     * @param {object} attributes
     * @returns {string}
     */
    static _mapObjectToHTMLAttributes(attributes: any) {
        return Object.entries(attributes).reduce((previous, current) => {
            return previous + ` ${current[0]}="${current[1]}"`;
        }, "");
    }

    /**
     * Returns a promise which resolves as soon as
     * requested element becomes available.
     * @param {string} tag
     * @returns {Promise<HTMLElement>}
     */
    static async _waitForComponentToRender(tag: string) {
        return new Promise(resolve => {
            function requestComponent() {
                const element = document.querySelector(tag);
                if (element) {
                    resolve(element);
                } else {
                    window.requestAnimationFrame(requestComponent);
                }
            }
            requestComponent();
        });
    }
}
