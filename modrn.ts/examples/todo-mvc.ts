/*
 * SPDX-License-Identifier: MIT
 * Copyright © 2021 Alexander Berthold
 */

import {declare, makeComponent} from "../js/source/core/component-declaration";
import {getState, purify, useState} from "../js/source/core/hooks/state-hooks";
import {createState} from "../js/source/util/state";
import {createEventListener, useEventListener} from "../js/source/core/hooks/event-hooks";
import {m, mFunction, mObj, mString} from "../js/source/core/types/prop-types";
import {NoProps} from "../js/source/core/types/registered-component";

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
    const onKey = purify(headerComponentState, (state, evt: KeyboardEvent) => {
        if (evt.key === "Enter") {
            addTodo(state.newTodo);
            return {newTodo: ""};
        }
    });
    return {newTodo, setText, onKey};
}).html(`
      <header class="header">
        <h1>todos</h1>
        <input
          class="new-todo"
          m-autofocus="true"
          autocomplete="off"
          placeholder="What needs to be done?"
          value="{{newTodo}}" m-onkeyup:enter=""
          onchange="{{setText}}"
          onkeyup="{{onKey}}"
        />
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
    removeTodo: mFunction<UpdateTodoFn>()
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

    function onBlur(evt: FocusEvent) {
        finishEdit((evt.target as HTMLInputElement).value);
    }

    function onKeyup(evt: KeyboardEvent) {
        if (editTodo.todo) {
            if (evt.key === "Escape") {
                setEditTodo({});
            } else if (evt.key === "Enter") {
                finishEdit((evt.target as HTMLInputElement).value);
            }
        }
    }

    function isEditing(todo: Todo) {
        return todo.id === editTodo.todo?.id;
    }

    return {filteredTodos, todos, allDone, toggleAllDone, toggleCompleted, removeTodo,
        editTodo: editTodo.todo, onEdit, onBlur, onKeyup, isEditing, focus};
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
              onblur="{{onBlur}}" m-autofocus="{{isEditing(todo)}}"
              onkeyup="{{onKeyup}}"
            />
          </li>
        </ul>
      </section>
`)
    .register();

const footerComponent = makeComponent(todoListProps, ({visibility, todos}) => {
    const remaining = todos.filter(todo => !todo.completed).length;
    const pluralize = <T>(what: T[]) => what.length === 1 ? "item" : "items";
    return {visibility, todos, remaining, pluralize};
})
    .html(`
      <footer class="footer" m-if="{{todos.length}}">
        <span class="todo-count">
          <strong>{{ remaining }}</strong><span> </span>{{ pluralize(remaining) }} left
        </span>
        <ul class="filters">
          <li>
            <a id="lll1" href="#/all" m-class="{{ visibility == 'all' && 'selected' }}">All</a>
          </li>
          <li>
            <a id="lll2" href="#/active" m-class="{{ visibility == 'active' && 'selected' }}"
              >Active</a
            >
          </li>
          <li>
            <a id="lll3" 
              href="#/completed"
              m-class="{{ visibility == 'completed' && 'selected' }}"
              >Completed</a
            >
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
    const [{todos, visibility}] = useState(todoState, {visibility: getVisibility(), todos: []});
    useEventListener(hashChangeEventListener, window, "hashchange", hashChanged);

    function hashChanged() {
        const [state, setState] = getState(todoState);
        setState({...state, visibility: getVisibility()});
    }

    const addTodo = purify(todoState, (state, newTodo: string) => ({todos: [...state.todos, {id: nextId++, title: newTodo, completed: false}]}));

    const updateTodo = purify(todoState, (state, todo: Todo) => {
        const newTodos = state.todos.map(current => current.id === todo.id ? todo : current);
        return {todos: newTodos};
    });

    const removeTodo = purify(todoState, (state, todo: Todo) => {
        return {todos: state.todos.filter(current => current.id !== todo.id)};
    });

    return {todos, addTodo, updateTodo, removeTodo, visibility};
})
    .html(`
    <section class="todoapp">
        <header-component add-todo="{{addTodo}}"></header-component>
        <todo-list-component visibility="{{visibility}}" todos="{{todos}}" update-todo="{{updateTodo}}" remove-todo="{{removeTodo}}"></todo-list-component>
        <footer-component visibility="{{visibility}}" todos="{{todos}}"></footer-component>
    </section>
`)
    .register();

export const todoMvcModule = declare({todoMvcComponent, headerComponent, todoListComponent, footerComponent});