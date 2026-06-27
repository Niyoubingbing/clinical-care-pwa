export interface Patient {
  id?: number;
  bedNumber: string;
  name: string;
  diagnosis: string;
  group: string;
  surgeryDate?: string;
  dressingChangeFrequency?: number;
  lastDressingChange?: string;
  bloodTestDay?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Todo {
  id?: number;
  patientId: number;
  content: string;
  type: '换药' | '查血' | '术前准备' | '明天出院' | '康复会诊' | '会诊' | '复查' | '其他';
  completed: boolean;
  completedAt?: Date;
  dueDate?: string;
  createdAt?: Date;
}

export interface DailyRecord {
  id?: number;
  date: string;
  patientId: number;
  completedTodos: string[];
  bloodTest: boolean;
  dressingChange: boolean;
}

export interface QuickTodo {
  id?: number;
  label: string;
  type: Todo['type'];
}

export interface Settings {
  id?: number;
  roundingOrder: string[];
  quickTodos: Omit<QuickTodo, 'id'>[];
  theme: 'light' | 'dark' | 'system';
}

export const GROUPS = ['解组', '勇组'] as const;
export const TODO_TYPES = ['换药', '查血', '术前准备', '明天出院', '康复会诊', '会诊', '复查', '其他'] as const;
