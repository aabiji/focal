import { writable  } from "svelte/store";
import { dev } from "$app/environment";

// The asset paths in dev are different than those in production
export const getPath = (name) => dev ? `/${name}` : name;

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
  bg: "", bgShade: "", fg: "", darkMode: false,
  taskTree: new Task("Tasks", true, null, false),
});

export function localstorageLoad() {
  const data = JSON.parse(localStorage.getItem("data") ?? "{}");
  app.update(state => ({ ...state, ...data }));
}

export function localstorageSave() {
  const fields = ["workMinutes", "shortBreakMinutes", "longBrekaMinutes",
    "playRingtone", "showNotification", "taskTree", "darkMode"];
  app.update(state => {
    const str = JSON.stringify(state, fields);
    localStorage.setItem("data", str);
    return state;
  });
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
    const osDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const darkMode = toggle ? !state.darkMode : osDark;
    let fg, bg, bgShade;
    if (darkMode) {
      fg = "#fff";
      bg = "#000";
      bgShade = "#222";
    } else {
      fg = "#000";
      bg = "#fff";
      bgShade = "#f4f4f6";
    }
    return { ...state, fg, bg, bgShade, darkMode };
  });
}
