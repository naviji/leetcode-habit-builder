import { Question, QuestionBankEnum } from "./questions";


export interface State {
    problemsSolved?: number;
    problems?: Question[];
    problemsPerDay?: number;
    problemDifficulty?: "easy" | "medium" | "hard" | null;
    problemSet?: QuestionBankEnum;
    includePremiumProblems?: boolean;
    snoozeInterval?: number;
    restInterval?: number;
    whitelistedUrls?: string;
    redirectOnSuccess?: boolean;
    showDailyQuote?: boolean;
    problemTopic?: string | null;
}
