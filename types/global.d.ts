// global.d.ts
interface MyApi {
    skip(): void;
    snooze(): void;
    getDailyQuote(): Promise<string>;
    getCurrQuestionNumber(): Promise<string>;
    getTotalQuestionCount(): Promise<string>;
    getStreakCount(): Promise<string>;
    getCompletionPercentage(): Promise<string>;
  }
  
  interface Window {
    myApi: MyApi;
  }