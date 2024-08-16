import { dev } from "$app/environment";

export function getPath(name) {
    // The asset paths in dev are different than those in production
    return dev ? `/${name}` : name;
}

export function formatTime(hours, minutes, seconds) {
    let time = "";
    time += hours.toString().padStart(2, "0") + ":";
    time += minutes.toString().padStart(2, "0") + ":";
    time += seconds.toString().padStart(2, "0");
    return time;
}

export function getTimeValues(duration) {
    let hours = Math.floor(duration / 60);
    let minutes = Math.max(duration % 60, 0);
    let seconds = 0;
    return [hours, minutes, seconds];
}