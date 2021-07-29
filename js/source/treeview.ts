export type TreeItem = {
    name: string;
};

export type SubTreeItem = {
    children: TreeItem[];
} & TreeItem;

