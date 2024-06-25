
export interface Task {
    name: string;
    children: Task[];
    done: boolean;
    is_root: boolean;
}

export const RootTask: Task = {
    name: "Your tasks",
    children: [],
    done: false,
    is_root: true,
}