import format from "date-fns/format";

export function nextId(): string {
    const rnd = Math.floor(Math.random() * 1000000);
    return rnd + "-" + format(new Date(), "yyyyMMddHHmmssSSSS");
}
