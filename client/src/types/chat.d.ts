import { ChatRoleEnum } from '@/constants/chat';
import type { InitChatResponse, InitShareChatResponse } from '@/api/response/chat';
import { TaskResponseKeyEnum } from '@/constants/chat';
import { ClassifyQuestionAgentItemType } from './app';
import { ChatItemSchema } from './mongoSchema';
import { KbDataItemType } from './plugin';
import { FlowModuleTypeEnum } from '@/constants/flow';

export type ExportChatType = 'md' | 'pdf' | 'html';

export type ChatItemType = {
  dataId?: string;
  obj: `${ChatRoleEnum}`;
  value: string;
  userFeedback?: string;
  adminFeedback?: ChatItemSchema['adminFeedback'];
  [TaskResponseKeyEnum.responseData]?: ChatHistoryItemResType[];
};

export type ChatSiteItemType = {
  status: 'loading' | 'running' | 'finish';
  moduleName?: string;
} & ChatItemType;

export type HistoryItemType = {
  chatId: string;
  updateTime: Date;
  customTitle?: string;
  title: string;
};
export type ChatHistoryItemType = HistoryItemType & {
  appId: string;
  top: boolean;
};

export type ShareChatHistoryItemType = HistoryItemType & {
  shareId: string;
  variables?: Record<string, any>;
  chats: ChatSiteItemType[];
};

export type ShareChatType = InitShareChatResponse & {
  history: ShareChatHistoryItemType;
};

export type QuoteItemType = KbDataItemType & {
  kb_id: string;
};

// response data
export type ChatHistoryItemResType = {
  moduleType: `${FlowModuleTypeEnum}`;
  price: number;
  runningTime?: number;
  model?: string;
  tokens?: number;

  // chat
  question?: string;
  temperature?: number;
  maxToken?: number;
  quoteList?: QuoteItemType[];
  historyPreview?: ChatItemType[]; // completion context array. history will slice

  // kb search
  similarity?: number;
  limit?: number;

  // cq
  cqList?: ClassifyQuestionAgentItemType[];
  cqResult?: string;

  // content extract
  extractDescription?: string;
  extractResult?: Record<string, any>;

  // http
  httpResult?: Record<string, any>;
};
