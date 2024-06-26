import { writable } from "svelte/store";

export class Task {
    constructor(name, is_root, parent) {
        this.name = name;
        this.parent = parent;
        this.children = [];
        this.done = false;
        this.is_root = is_root;
    }
};

export const task_tree = writable(new Task("Your tasks", true, null));