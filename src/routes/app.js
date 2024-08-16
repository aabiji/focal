import { writable } from "svelte/store";
import { getPath } from "./utils";

// Mapping of music genres to YouTube video IDs
// Each genre is associated with a specific video ID for playback
export const music_genres = {
    classical: "Hlp6aawXVoY",
    lofi: "jfKfPfyJRdk",
    nature: "eKFTSSKCzWA",
    noise: "nMfPqeZjc2c",
};

export class Music {
    constructor() {
        this.genre = music_genres.lofi;
        this.youtube_player = undefined;
        this.paused = true;
        this.reload = false;
    }

    togglePlayback() {
        this.paused = !this.paused;
        if (this.youtube_player.getPlayerState() == 1) {
            this.youtube_player.pauseVideo();
        } else {
            this.youtube_player.playVideo();
        }
    }

    stop() {
        this.youtube_player.stopVideo();
    }

    load() {
        this.youtube_player.loadVideoById(this.genre);
        if (this.paused) {
            this.youtube_player.pauseVideo();
        }
    }
}

export class Task {
    constructor(name, is_root, parent, newly_created) {
        this.name = name;
        this.children = [];
        this.done = false;
        this.is_root = is_root;
        this.newly_created = newly_created;

        this.id = (Math.random() + 1).toString(36).substring(5);
        if (parent != null) this.parent = parent.id;
    }
}

export class App {
    constructor() {
        // 0=work, 1=short break, 2=long break
        this.current_session = -1;
        this.break_count = 0;
        this.durations = [25, 5, 15];

        this.play_music = true;
        this.play_ringtone = true;
        this.show_notification = true;

        this.task_tree = new Task("Your tasks", true, null, false);
        this.music = new Music();
    }

    loadFromLocalstorage(localStorage) {
        // Copy values from the cached data into our class
        const cached_data = localStorage.getItem("data");
        if (cached_data === null) return;
        const obj = JSON.parse(cached_data);
        Object.assign(this, obj);

        this.break_count = 0;
        this.current_session = -1;

        let temp = new Music();
        temp.genre = this.music.genre == undefined ? music_genres.lofi : this.music.genre;
        this.music = temp;
    }

    gotoNextSession() {
        // Move to the next possible state (session)
        this.current_session = (this.current_session + 1) % 3;

        if (this.current_session == 0) {
            return "Work";
        }

        if (this.current_session == 1) {
            this.break_count += 1;
            return "Short Break";
        }

        // Only enter the long break session after
        // we've entered the short break session 4 times
        if (break_count < 4) {
            this.current_session = 0;
            return "Work";
        }

        this.break_count = 0;
        return "Long Break";
    }

    getSessionMessage() {
        if (this.current_session == 0) return "Back to work!";
        if (this.current_session == 1) return "Take a short break";
        return "Take a long break";
    }

    getSessionDuration() {
        return this.durations[this.current_session];
    }

    getPlaybackIcon() {
        return this.music.paused ? getPath("play.svg") : getPath("pause.svg");
    }
}

export const app = writable(new App());
