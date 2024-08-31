import { State } from './State.js';

export interface StorageEngine {
    get(): Promise<State>;
    set(state: State): Promise<void>;
}


