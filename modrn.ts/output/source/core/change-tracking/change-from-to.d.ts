import { ApplyResult } from "./change-types";
import { ModrnHTMLElement } from "../types/modrn-html-element";
/**
 * Called after a variable has been applied with the previous and current value.
 * This is not a simple copy of {@see hasChanged} but a specific implementation to deal with the specifics of the
 * underlying DOM data model.
 *
 * @param previous
 * @param now
 * @param forConsumer
 * @param node
 */
export declare function changeFromTo(previous: unknown, now: unknown, forConsumer: ModrnHTMLElement): ApplyResult;
