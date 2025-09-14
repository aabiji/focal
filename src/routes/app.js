import { writable, get } from "svelte/store";
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
  paused: true,
  breakCount: 0,
  isBreak: true,
  sessionMinutes: 0,
  sessionNotification: "",
  sessionName: "",
  playRingtone: true,
  showNotification: true,
  durations: [25, 5, 15], // work, short break, long break
  taskTree: new Task("Tasks", true, null, false),
});

export function localstorageLoad() {
  const data = JSON.parse(localStorage.getItem("data") ?? "{}");
  app.update(state => ({ ...state, ...data }));
}

export function localstorageSave() {
  const fields = ["durations", "playRingtone", "showNotification", "taskTree"];
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

    const sessionMinutes = state.durations[!isBreak ? 0 : breakCount !== 4 ? 1 : 2];

    return { ...state, isBreak, breakCount, sessionName, sessionNotification, sessionMinutes };
  });
}

export function togglePause() { app.update(state => ({...state, paused: !state.paused})); }