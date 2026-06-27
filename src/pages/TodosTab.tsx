import { useState, useEffect } from 'react';
import { db } from '../lib/db';
import type { Todo } from '../types/patient';

interface TodoWithPatient extends Todo {
  patientName?: string;
  bedNumber?: string;
}

export default function TodosTab() {
  const [todos, setTodos] = useState<TodoWithPatient[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('pending');

  useEffect(() => {
    loadTodos();
  }, []);

  async function loadTodos() {
    const allTodos = await db.todos.toArray();
    const patients = await db.patients.toArray();
    
    const todosWithPatient: TodoWithPatient[] = allTodos.map(todo => {
      const patient = patients.find(p => p.id === todo.patientId);
      return {
        ...todo,
        patientName: patient?.name,
        bedNumber: patient?.bedNumber,
      };
    });

    setTodos(todosWithPatient);
  }

  const filteredTodos = todos.filter(t => {
    if (filter === 'all') return true;
    if (filter === 'pending') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const today = new Date().toISOString().split('T')[0];
  const todayTodos = filteredTodos.filter(t => t.dueDate === today && !t.completed);
  const overdueTodos = filteredTodos.filter(t => t.dueDate && t.dueDate < today && !t.completed);
  const otherTodos = filteredTodos.filter(t => !t.dueDate || (t.dueDate >= today && !t.completed) || t.completed);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">待办事项</h2>

      <div className="mb-4 flex gap-2">
        {['all', 'pending', 'completed'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f as 'all' | 'pending' | 'completed')}
            className={`px-3 py-1 rounded ${
              filter === f ? 'bg-primary text-primary-foreground' : 'bg-secondary'
            }`}
          >
            {f === 'all' ? '全部' : f === 'pending' ? '未完成' : '已完成'}
          </button>
        ))}
      </div>

      {todayTodos.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-medium text-destructive mb-2">今天到期 ({todayTodos.length})</h3>
          <div className="space-y-2">
            {todayTodos.map(todo => (
              <TodoItem key={todo.id} todo={todo} onUpdate={loadTodos} />
            ))}
          </div>
        </div>
      )}

      {overdueTodos.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-medium text-orange-500 mb-2">已逾期 ({overdueTodos.length})</h3>
          <div className="space-y-2">
            {overdueTodos.map(todo => (
              <TodoItem key={todo.id} todo={todo} onUpdate={loadTodos} />
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-2">其他待办</h3>
        <div className="space-y-2">
          {otherTodos.map(todo => (
            <TodoItem key={todo.id} todo={todo} onUpdate={loadTodos} />
          ))}
        </div>
      </div>
    </div>
  );
}

function TodoItem({ todo, onUpdate }: { todo: TodoWithPatient; onUpdate: () => void }) {
  return (
    <div className={`border rounded-lg p-3 ${todo.completed ? 'opacity-50' : ''}`}>
      <div className="flex items-start gap-2">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
            await db.todos.update(todo.id!, { completed: e.target.checked, completedAt: e.target.checked ? new Date() : undefined });
            onUpdate();
          }}
          className="mt-1"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className={`text-sm ${todo.completed ? 'line-through' : ''}`}>
              {todo.bedNumber} {todo.patientName}
            </span>
            <span className="text-xs px-1.5 py-0.5 rounded bg-secondary">{todo.type}</span>
          </div>
          <div className="text-sm mt-1">{todo.content}</div>
          {todo.dueDate && (
            <div className="text-xs text-muted-foreground mt-1">
              到期: {todo.dueDate}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
