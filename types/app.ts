import { QuestionBankEnum } from "./questions";


export interface App {

  skip(): void;
  snooze(): void;
  init(): Promise<void>;
  setProblemSet(list: QuestionBankEnum): Promise<void>;
  setProblemsPerDay(value: string): void;
  setIncludePremiumProblems(value: boolean): Promise<void>;
  setSnoozeInterval(value: string): Promise<void>;
  setRestInterval(value: string): Promise<void>;
  setWhitelistedUrls(value: string): Promise<void>;
  setRedirectOnSuccess(value: boolean): Promise<void>;
  setShowDailyQuote(value: boolean): Promise<void>;
  setRedirectsEnabled(value: boolean): Promise<void>;
  setProblemTopic(value: string): void;


  getDailyQuote(): Promise<string>;
  getCurrQuestionNumber(): Promise<string>;
  getTotalQuestionCount(): Promise<string>;
  getStreakCount(): Promise<string>;
  getCompletionPercentage(): Promise<string>;
  getProblemUrl(): Promise<string>;
  getProblemTitle(): Promise<string>;
  getProblemDifficulty(): Promise<string>;
  getProblemTopics(): Promise<string[]>;
  getIncludePremiumProblems(): Promise<boolean>;
  getSnoozeInterval(): Promise<string>;
  getRestInterval(): Promise<string>;
  getWhitelistedUrls(): Promise<string>;
  getRedirectOnSuccess(): Promise<boolean>;
  getShowDailyQuote(): Promise<boolean>;
  getProblemSet(): Promise<QuestionBankEnum>;
  getProblemsPerDay(): Promise<string>;
  getProblemTopic(): Promise<string>;
  getRedirectsEnabled(): Promise<boolean>;

  openTab(url: string): void;
}
