import Dexie from 'dexie';
import type { Patient, Todo, DailyRecord, QuickTodo, Settings } from '../types/patient';
import { ROUNDING_ORDER } from './rounding';

export class ClinicalCareDB extends Dexie {
  patients!: Dexie.Table<Patient, number>;
  todos!: Dexie.Table<Todo, number>;
  dailyRecords!: Dexie.Table<DailyRecord, number>;
  quickTodos!: Dexie.Table<QuickTodo, number>;
  settings!: Dexie.Table<Settings, number>;

  constructor() {
    super('ClinicalCareDB');
    this.version(1).stores({
      patients: '++id, bedNumber, name, group',
      todos: '++id, patientId, completed, dueDate',
      dailyRecords: '++id, date, patientId',
      quickTodos: '++id, label',
      settings: '++id',
    });
  }
}

export const db = new ClinicalCareDB();

// Initialize default settings
export async function initializeDB() {
  const settingsCount = await db.settings.count();
  if (settingsCount === 0) {
    await db.settings.add({
      roundingOrder: ROUNDING_ORDER,
      quickTodos: [
        { label: '换药', type: '换药' },
        { label: '查血', type: '查血' },
        { label: '术前准备', type: '术前准备' },
        { label: '明天出院', type: '明天出院' },
        { label: '康复会诊', type: '康复会诊' },
        { label: '会诊', type: '会诊' },
        { label: '复查', type: '复查' },
      ],
      theme: 'system',
    });
  }
}
