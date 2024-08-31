import { StorageEngine } from "../types/storageEngine.js"
import { State } from '../types/State.js';

class LocalStorageEngine implements StorageEngine {
    private static KEY = 'leetcode-habit-builder-state';

    async get(): Promise<State> {
        const json = localStorage.getItem(LocalStorageEngine.KEY);
        if (json === null) {
            return {};
        }
        const state = JSON.parse(json) as State;
        return state
    }

    async set(state: State): Promise<void> {
        const oldState = await this.get();
        const newState = { ...oldState, ...state };
        localStorage.setItem(LocalStorageEngine.KEY, JSON.stringify(newState));
    }
}

export default LocalStorageEngine