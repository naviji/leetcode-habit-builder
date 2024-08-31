import { StorageEngine, State } from "../types/storageEngine.js"

class LocalStorageEngine implements StorageEngine {
    private static KEY = 'leetcode-habit-builder-state';

    async get(): Promise<State> {
        const json = localStorage.getItem(LocalStorageEngine.KEY);
        if (json === null) {
            return {};
        }
        const state = JSON.parse(json) as State;
        console.log("Loaded state", state);
        return state
    }

    async set(state: State): Promise<void> {
        const oldState = await this.get();
        console.log("Saving state", state);
        const newState = { ...oldState, ...state };
        localStorage.setItem(LocalStorageEngine.KEY, JSON.stringify(newState));
    }
}

export default new LocalStorageEngine()