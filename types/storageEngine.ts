import { Question, QuestionBankEnum } from './questions.js' 

export interface StorageEngine {
    get(): Promise<State>;
    set(state: State): Promise<void>;
}

export interface State {
    problemsSolved ?: number;
    problems?: Question[];
    problemsPerDay?: number;
    problemDifficulty?: "easy" | "medium" | "hard" | null;
    problemTopics?: string[] | null;
    problemSet?: QuestionBankEnum;
    includePremiumProblems?: boolean;
    snoozeInterval?: number;
    restInterval?: number;
    whitelistedUrls?: string;
    redirectOnSuccess?: boolean;
    showDailyQuote?: boolean;
}
