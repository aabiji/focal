import { writable  } from "svelte/store";

export class Task {
  constructor(name, isRoot, parent, newlyCreated) {
    this.name = name;
    this.children = [];
    this.done = false;
    this.isRoot = isRoot;
    this.newlyCreated = newlyCreated;

    this.id = (Math.random() + 1).toString(36).substring(5);
    if (parent != null) this.parent = parent.id;
  }
}

export const app = writable({
  breakCount: 0,
  isBreak: true,
  sessionNotification: "",
  sessionName: "",
  workMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  paused: true,
  playRingtone: true,
  showNotification: true,
  bg: "", fgShade: "",
  bgShade: "", fg: "",
  darkMode: false,
  taskTree: new Task("Tasks", true, null, false),
});

function serializeTask(task) {
  return {
    name: task.name,
    done: task.done,
    isRoot: task.isRoot,
    newlyCreated: task.newlyCreated,
    id: task.id, parent: task.parent,
    children: task.children.map(serializeTask),
  };
}

function deserializeTask(obj, parent = null) {
  const task = new Task(obj.name, obj.isRoot, parent, obj.newlyCreated);
  task.id = obj.id;
  task.done = obj.done;
  task.children = obj.children ? obj.children.map(child => deserializeTask(child, task)) : [];
  return task;
}

export function localstorageSave() {
  app.update(state => {
    const keys = ["darkMode", "workMinutes", "shortBreakMinutes",
      "longBreakMinutes", "playRingtone", "showNotification", "taskTree"];
    const stateForStorage = { ...state, taskTree: serializeTask(state.taskTree) };
    localStorage.setItem("data", JSON.stringify(stateForStorage, keys));
    return state;
  });
}

export function localstorageLoad() {
  const raw = localStorage.getItem("data");
  if (!raw) return;

  const data = JSON.parse(raw);
  if (data.taskTree)
    data.taskTree = deserializeTask(data.taskTree);
  app.update(state => ({ ...state, ...data }));
}

export function nextSession() {
  app.update(state => {
    const isBreak = !state.isBreak;
    const breakCount = isBreak ? Math.max(1, (state.breakCount + 1) % 4) : state.breakCount;

    const sessionName =
      !isBreak ? "Work" : breakCount === 4 ? "Long break" : "Short break";

    const sessionNotification =
      !isBreak ? "Back to work" : `Take a ${breakCount === 4 ? "long" : "short"} break`;

    return { ...state, isBreak, breakCount, sessionName, sessionNotification };
  });
}

export function togglePause() { app.update(state => ({...state, paused: !state.paused})); }

export function setTheme(toggle) {
  app.update(state => {
    const darkMode = toggle ? !state.darkMode : false;
    let fg, fgShade, bg, bgShade;
    if (darkMode)
      fg = "#fff", fgShade = "#dfdfdf", bg = "#000", bgShade = "#111";
    else
      fg = "#000", fgShade = "#222", bg = "#fff", bgShade = "#f4f4f6";
    return { ...state, fg, fgShade, bg, bgShade, darkMode };
  });
}
