export function dumpStructure(node: ChildNode): string {
    const result = {
        data: ""
    };
    dumpInner(node, result, "");
    return result.data;
}

function dumpInner(node: ChildNode, result: {data: string}, indent: string) {
    result.data += indent + node + "\n";
    const length = node.childNodes.length;
    for (let idx = 0; idx < length; ++idx) {
        dumpInner(node.childNodes.item(idx), result, indent + "  ");
    }
}