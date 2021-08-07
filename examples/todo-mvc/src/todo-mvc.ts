/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */

import {
    createEventListener,
    createState,
    declare,
    m,
    makeComponent,
    mFunction,
    mObj,
    modrn,
    mString,
    NoProps,
    purify,
    useEventListener,
    useLocalStorageState,
    useState
} from "modrn";

const pluralize = <T>(what: T[]) => what.length === 1 ? "item" : "items";

type Todo = {
    id: number;
    title: string;
    completed: boolean;
}

type AddTodoFn = (newTodo: string) => void;
type UpdateTodoFn = (updatedTodo: Todo) => void;

const headerComponentProps = m({
    addTodo: mFunction<AddTodoFn>()
});

type HeaderComponentState = {
    newTodo: string;
};

const headerComponentState = createState<HeaderComponentState>();
const headerComponent = makeComponent(headerComponentProps, ({addTodo}) => {
    const [{newTodo}] = useState(headerComponentState, {newTodo: ""});
    const setText = purify(headerComponentState, (state, evt: Event) => ({newTodo: (evt?.target as HTMLInputElement)?.value}));

    const onEnter = purify(headerComponentState, (state) => {
        addTodo(state.newTodo);
        return {newTodo: ""};
    });

    function onKeyup(evt: KeyboardEvent) {
        if (evt.code === "Enter") {
            console.log("LALAL");
        }
    }

    return {newTodo, setText, onEnter, onKeyup};
}).html(`
      <header class="header">
        <h1>todos</h1>
        <input
          class="new-todo"
          m-autofocus="true"
          autocomplete="off"
          placeholder="What needs to be done?"
          value="{{newTodo}}"
          onchange="{{setText}}"
          m-keyup:enter="{{onEnter}}"
        />
<!--          m-keyup:enter="{{onEnter}}"-->
      </header>
`)
    .register();

type Visibility = "all" | "completed" | "active";

type Filters = { [name in Visibility]: (todos: Todo[]) => Todo[]};

const filters: Filters = {
    all: (todos: Todo[]) => todos,
    completed: (todos: Todo[]) => todos.filter(todo => todo.completed),
    active: (todos: Todo[]) => todos.filter(todo => !todo.completed)
};

type TodoState = {
    visibility: Visibility;
    todos: Todo[];
};

const todoListProps = m({
    visibility: mString<Visibility>(),
    todos: mObj<Todo[]>(),
    updateTodo: mFunction<UpdateTodoFn>(),
    removeTodo: mFunction<UpdateTodoFn>(),
    removeCompleted: mFunction<() => void>()
});

type EditTodoState = {
    todo?: Todo;
}

const editTodoState = createState<EditTodoState>();

const todoListComponent = makeComponent(todoListProps, ({visibility, todos, updateTodo, removeTodo}) => {
    const [editTodo, setEditTodo] = useState(editTodoState, {});
    const filteredTodos = filters[visibility](todos);
    const allDone = todos.filter(todo => todo.completed).length === todos.length;

    function toggleAllDone() {
        todos.forEach(todo => updateTodo({...todo, completed: !allDone}));
    }
    function toggleCompleted(todo: Todo) {
        updateTodo({...todo, completed: !todo.completed});
    }
    function onEdit(todo: Todo) {
        setEditTodo({todo: {...todo}});
    }

    const finishEdit = purify(editTodoState, ({todo}, newTitle: string | undefined) => {
        if (todo) {
            todo.title = newTitle || todo.title;
            updateTodo(todo);
            return {todo: undefined};
        }
    });

    function onFinish(evt: Event) {
        finishEdit((evt.target as HTMLInputElement)?.value);
    }

    function onEscape() {
        setEditTodo({});
    }

    function isEditing(todo: Todo) {
        return todo.id === editTodo.todo?.id;
    }

    return {filteredTodos, todos, allDone, toggleAllDone, toggleCompleted, removeTodo,
        editTodo: editTodo.todo, onEdit, onEscape, onFinish, isEditing, focus};
}).html(`
     <section class="main" m-show="{{todos.length}}">
        <input
          id="toggle-all"
          class="toggle-all"
          type="checkbox" checked="{{allDone}}"
          onchange="{{toggleAllDone}}"
        />
        <label for="toggle-all"></label>
        <ul class="todo-list">
          <li
            m-for="{{filteredTodos}}" m-as="todo" 
            m-class="{{ 'todo', todo.completed && 'completed', isEditing(todo) && 'editing' }}"
          >
            <div class="view">
              <input class="toggle" type="checkbox" onchange="{{&toggleCompleted(todo)}}" checked="{{todo.completed}}" />
              <label ondblclick="{{&onEdit(todo)}}">{{ todo.title }}</label>
              <button class="destroy" onclick="{{&removeTodo(todo)}}"></button>
            </div>
            <input
              class="edit" tabindex="1"
              type="text" value="{{editTodo && editTodo.title}}"
              m-blur="{{onFinish}}" m-autofocus="{{isEditing(todo)}}"
              m-keyup:escape="{{onEscape}}"
              m-keyup:enter="{{onFinish}}"
            />
          </li>
        </ul>
      </section>
`)
    .register();

const footerComponent = makeComponent(todoListProps, ({visibility, todos, removeCompleted}) => {
    const remaining = filters.active(todos).length;
    return {visibility, todos, remaining, removeCompleted};
})
    .html(`
      <footer class="footer" m-if="{{todos.length}}">
        <span class="todo-count">
          <strong>{{ remaining }}</strong><span> </span>{{ pluralize(remaining) }} left
        </span>
        <ul class="filters">
          <li>
            <a href="#/all" m-class="{{ visibility == 'all' && 'selected' }}">All</a>
          </li>
          <li>
            <a href="#/active" m-class="{{ visibility == 'active' && 'selected' }}"
              >Active</a>
          </li>
          <li>
            <a href="#/completed"
              m-class="{{ visibility == 'completed' && 'selected' }}"
              >Completed</a>
          </li>
        </ul>
        <button
          class="clear-completed"
          onclick="{{removeCompleted}}"
          m-show="{{todos.length > remaining}}"
        >
          Clear completed
        </button>
      </footer>
`)
    .withFilters({pluralize})
    .register();

const todoState = createState<TodoState>();
let nextId = 0;

function getVisibility(): keyof typeof filters {
    const visibility = window.location.hash.replace(/#\/?/, "");
    if (visibility in filters) {
        return visibility as keyof typeof filters;
    } else {
        window.location.hash = "";
        return "all";
    }
}

const hashChangeEventListener = createEventListener();

const todoMvcComponent = makeComponent(NoProps, () => {

    const [{todos, visibility}] = useLocalStorageState(todoState, {visibility: getVisibility(), todos: []}, "todos-modrnts");

    useEventListener(hashChangeEventListener, window, "hashchange",
        purify(todoState, (state) => ({visibility: getVisibility()})));

    const addTodo = purify(todoState, (state, newTodo: string) => ({todos: [...state.todos, {id: nextId++, title: newTodo, completed: false}]}));

    const updateTodo = purify(todoState, (state, todo: Todo) => {
        const newTodos = state.todos.map(current => current.id === todo.id ? todo : current);
        return {todos: newTodos};
    });

    const removeTodo = purify(todoState, (state, todo: Todo) => {
        return {todos: state.todos.filter(current => current.id !== todo.id)};
    });

    const removeCompleted = purify(todoState, (state) => {
       return {todos: filters.active(state.todos)};
    });

    return {todos, addTodo, updateTodo, removeTodo, removeCompleted, visibility};
})
    .html(`
    <section class="todoapp">
        <header-component add-todo="{{addTodo}}"></header-component>
        <todo-list-component visibility="{{visibility}}" todos="{{todos}}" update-todo="{{updateTodo}}" remove-todo="{{removeTodo}}"></todo-list-component>
        <footer-component visibility="{{visibility}}" remove-completed="{{removeCompleted}}" todos="{{todos}}"></footer-component>
    </section>
`)
    .register();

export const todoMvcModule = declare({todoMvcComponent, headerComponent, todoListComponent, footerComponent});

modrn(todoMvcModule);