import { StorageEngine } from "../types/storageEngine.js";
import { State } from "../types/State.js";

class ChromeStorageEngine implements StorageEngine {

  async get(): Promise<State> {
    const { state = {} } = await chrome.storage.local.get("state");
    return state as State;
  }

  async set(state: State): Promise<void> {
    const oldState = await this.get();
    const newState = { ...oldState, ...state };
    await chrome.storage.local.set({ state: newState });
  }
}

export default ChromeStorageEngine;
