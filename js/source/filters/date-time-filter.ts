import isDate from "date-fns/isDate";
import format from "date-fns/format";

export function yearMonthDay(what: unknown): string {
    if (what && typeof what === "object" && isDate(what)) {
        return format(what as Date, "yyyy-MM-dd");
    }
    return "";
}