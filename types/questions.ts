export enum QuestionBankEnum {
  NeetCodeAll = "neetcodeAll",
  NeetCode150 = "neetcode150",
  Blind75 = "blind75",
  StriverSDESheet = "striverSDESheet",
  StriverAtoZ = "striverAtoZ",
  Striver79 = "striver79",
}
export interface QuestionBank {
  [QuestionBankEnum.NeetCodeAll]: string[];
  [QuestionBankEnum.NeetCode150]: string[];
  [QuestionBankEnum.Blind75]: string[];
  [QuestionBankEnum.StriverSDESheet]: string[];
  [QuestionBankEnum.StriverAtoZ]: string[];
  [QuestionBankEnum.Striver79]: string[];
}

interface TopicTag {
  name: string;
  id: string;
  slug: string;
}

export interface Question {
  acRate: number;
  difficulty: string;
  freqBar: number | null;
  questionFrontendId: string;
  isFavor: boolean;
  isPaidOnly: boolean;
  status: string | null;
  title: string;
  titleSlug: string;
  topicTags: TopicTag[];
  hasSolution: boolean;
  hasVideoSolution: boolean;
}

interface QuestionData {
  question: Question;
}

export interface Questions {
  [key: string]: {
    data: QuestionData;
  };
}
