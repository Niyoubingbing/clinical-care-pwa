import { useState, useEffect } from 'react';
import { db } from '../lib/db';
import type { Settings } from '../types/patient';

export default function SettingsTab() {
  const [settings, setSettings] = useState<Settings | undefined>();
  const [roundingOrderText, setRoundingOrderText] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    const s = await db.settings.toArray();
    if (s.length > 0) {
      setSettings(s[0]);
      setRoundingOrderText(s[0].roundingOrder.join('\n'));
    }
  }

  async function saveRoundingOrder() {
    if (!settings) return;
    const order = roundingOrderText.split('\n').map(s => s.trim()).filter(Boolean);
    await db.settings.update(settings.id!, { roundingOrder: order });
    alert('查房顺序已保存');
  }

  async function resetRoundingOrder() {
    if (!settings) return;
    const { ROUNDING_ORDER } = await import('../lib/rounding');
    await db.settings.update(settings.id!, { roundingOrder: ROUNDING_ORDER });
    setRoundingOrderText(ROUNDING_ORDER.join('\n'));
    alert('已重置为默认顺序');
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">设置</h2>

      <section className="mb-6">
        <h3 className="text-lg font-medium mb-2">查房顺序</h3>
        <p className="text-sm text-muted-foreground mb-2">
          每行一个床号，列表将按此顺序排序
        </p>
        <textarea
          value={roundingOrderText}
          onChange={(e) => setRoundingOrderText(e.target.value)}
          className="w-full h-48 px-3 py-2 border rounded-lg font-mono text-sm"
        />
        <div className="flex gap-2 mt-2">
          <button
            onClick={saveRoundingOrder}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
          >
            保存顺序
          </button>
          <button
            onClick={resetRoundingOrder}
            className="px-4 py-2 bg-secondary rounded-lg"
          >
            重置为默认
          </button>
        </div>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-medium mb-2">数据管理</h3>
        <div className="space-y-2">
          <button
            onClick={async () => {
              const data = await exportData();
              const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `clinical-care-${new Date().toISOString().split('T')[0]}.json`;
              a.click();
            }}
            className="w-full px-4 py-2 bg-secondary rounded-lg text-left"
          >
            导出数据
          </button>
          <button
            onClick={() => {
              if (confirm('确定要清除所有数据吗？此操作不可恢复！')) {
                clearAllData();
              }
            }}
            className="w-full px-4 py-2 bg-destructive text-destructive-foreground rounded-lg text-left"
          >
            清除所有数据
          </button>
        </div>
      </section>

      <section>
        <h3 className="text-lg font-medium mb-2">关于</h3>
        <p className="text-sm text-muted-foreground">
          临床病人管理助手 v1.0
          <br />
          PWA 应用，数据存储在本地浏览器
        </p>
      </section>
    </div>
  );
}

async function exportData() {
  const patients = await db.patients.toArray();
  const todos = await db.todos.toArray();
  const dailyRecords = await db.dailyRecords.toArray();
  const quickTodos = await db.quickTodos.toArray();
  const settings = await db.settings.toArray();

  return {
    version: 1,
    exportDate: new Date().toISOString(),
    data: {
      patients,
      todos,
      dailyRecords,
      quickTodos,
      settings,
    }
  };
}

async function clearAllData() {
  await db.patients.clear();
  await db.todos.clear();
  await db.dailyRecords.clear();
  await db.quickTodos.clear();
  await db.settings.clear();
  window.location.reload();
}
