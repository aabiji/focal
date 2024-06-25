
export interface Task {
    name: string;
    children: Task[];
    done: boolean;
}