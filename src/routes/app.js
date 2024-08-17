import { writable } from "svelte/store";
import { getPath } from "./utils";

// Mapping of music genres to YouTube video IDs
// Each genre is associated with a specific video ID for playback
export const musicGenres = {
    classical: "Hlp6aawXVoY",
    lofi: "jfKfPfyJRdk",
    nature: "eKFTSSKCzWA",
    noise: "nMfPqeZjc2c",
};

export class Music {
    constructor() {
        this.genre = musicGenres.lofi;
        this.youtubePlayer = undefined;
        this.paused = true;
        this.reload = false;
    }

    togglePlayback() {
        this.paused = !this.paused;
        if (this.youtubePlayer.getPlayerState() == 1) {
            this.youtubePlayer.pauseVideo();
        } else {
            this.youtubePlayer.playVideo();
        }
    }

    stop() {
        this.youtubePlayer.stopVideo();
    }

    load() {
        this.youtubePlayer.loadVideoById(this.genre);
        if (this.paused) {
            this.youtubePlayer.pauseVideo();
        }
    }
}

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

export class App {
    constructor() {
        // 0=work, 1=short break, 2=long break
        this.currentSession = -1;
        this.breakCount = 0;
        this.durations = [25, 5, 15];

        this.playMusic = true;
        this.playRingtone = true;
        this.showNotification = true;

        this.taskTree = new Task("Your tasks", true, null, false);
        this.music = new Music();
    }

    loadFromLocalstorage(localStorage) {
        // Copy values from the cached data into our class
        const cached_data = localStorage.getItem("data");
        if (cached_data === null) return;
        const obj = JSON.parse(cached_data);
        Object.assign(this, obj);

        this.breakCount = 0;
        this.currentSession = -1;

        let temp = new Music();
        temp.genre = this.music.genre == undefined ? musicGenres.lofi : this.music.genre;
        this.music = temp;
    }

    gotoNextSession() {
        // Move to the next possible state (session)
        this.currentSession = (this.currentSession + 1) % 3;

        if (this.currentSession == 0) {
            return "Work";
        }

        if (this.currentSession == 1) {
            this.breakCount += 1;
            return "Short Break";
        }

        // Only enter the long break session after
        // we've entered the short break session 4 times
        if (breakCount < 4) {
            this.currentSession = 0;
            return "Work";
        }

        this.breakCount = 0;
        return "Long Break";
    }

    getSessionMessage() {
        if (this.currentSession == 0) return "Back to work!";
        if (this.currentSession == 1) return "Take a short break";
        return "Take a long break";
    }

    getSessionDuration() {
        return this.durations[this.currentSession];
    }

    getPlaybackIcon() {
        return this.music.paused ? getPath("play.svg") : getPath("pause.svg");
    }
}

export const app = writable(new App());
