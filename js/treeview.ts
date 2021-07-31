import {declare, m, makeComponent, mFunction, mObj, NoProps} from "./source/core/component-declaration";
import {createState} from "./source/util/state";
import {purify, useState} from "./source/core/state-hooks";
import {markChanged} from "./source/core/change-tracking/mark-changed";

export type TreeItem = {
    name: string;
};

export type SubTreeItem = {
    children: TreeItem[];
} & TreeItem;

type TreeItemState = { isOpen: boolean };
const treeItemState = createState<TreeItemState>();

const treeData: SubTreeItem = {
    name: "My Tree",
    children: [
        {name: "hello"},
        {name: "wat"},
        {
            name: "child folder",
            children: [
                {
                    name: "child folder",
                    children: [{name: "hello"}, {name: "wat"}]
                },
                {name: "hello"},
                {name: "wat"},
                {
                    name: "child folder",
                    children: [{name: "hello"}, {name: "wat"}]
                }
            ]
        } as SubTreeItem
    ]
};

type AddItemFn = (item: SubTreeItem) => void;
type MakeFolderFn = (item: TreeItem) => void;

const treeItem = makeComponent(m({treeItem: mObj<TreeItem>(), addItem: mFunction<AddItemFn>(), makeFolder: mFunction<MakeFolderFn>()}),
    ({addItem, makeFolder, treeItem}) => {
        const [{isOpen}] = useState(treeItemState, {isOpen: false});
        const toggle = purify(treeItemState, (state) => ({isOpen: !state.isOpen}));
        const addToMe = () => addItem(treeItem as SubTreeItem);
        const addFolderToMe = () => makeFolder(treeItem);
        const isFolder = (treeItem as SubTreeItem)?.children;
        return {item: treeItem, addToMe, addFolderToMe, addItem, makeFolder, isOpen, isFolder, toggle};
    })
    .html(`
      <li>
        <div m-class="{{isFolder && 'bold'}}" onclick="{{toggle}}" ondblclick="{{addFolderToMe}}">
          {{ item.name }}
          <span m-if="{{isFolder}}">[{{ isOpen ? '-' : '+' }}]</span>
        </div>
        <ul m-show="{{isOpen}}" m-if="{{isFolder}}">
          <tree-item
            class="item"
            m-if="{{isOpen}}" m-for="{{item.children}}" m-as="item" tree-item="{{item}}"
            make-folder="{{makeFolder}}" add-item="{{addItem}}"
          ></tree-item>
          <li class="add" onclick="{{addToMe}}">+</li>
        </ul>
      </li>`)
    .register();

const treeViewState = createState<SubTreeItem>();

const treeView = makeComponent(NoProps, () => {
    const [state] = useState(treeViewState, treeData);

    function addItem(item: SubTreeItem) {
        item.children.push({name: "new stuff"});
        markChanged(item.children);
    }

    function makeFolder(item: TreeItem) {
        (item as SubTreeItem).children = [];
        markChanged(item);
    }

    return {treeData: state, addItem, makeFolder};
}).html(`<ul><tree-item tree-item="{{treeData}}" add-item="{{addItem}}" make-folder="{{makeFolder}}"></tree-item></ul>`).register();

export const treeViewModule = declare({treeView, treeItem});
