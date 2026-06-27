import type { Patient } from '../types/patient';
import { db } from '../lib/db';
import { useState } from 'react';

interface Props {
  patient: Patient;
  onUpdate: () => void;
}

export default function PatientCard({ patient, onUpdate }: Props) {
  const [showDetails, setShowDetails] = useState(false);

  const todoCount = 0; // TODO: load from todos table

  return (
    <div className="border rounded-lg p-4 bg-card">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-lg">{patient.bedNumber}</span>
            <span className="font-medium">{patient.name}</span>
            <span className="text-xs px-2 py-0.5 rounded bg-secondary">
              {patient.group}
            </span>
          </div>
          <div className="text-sm text-muted-foreground">{patient.diagnosis}</div>
          {todoCount > 0 && (
            <div className="text-xs text-primary mt-1">
              {todoCount} 个待办
            </div>
          )}
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="px-3 py-1 text-sm border rounded"
        >
          {showDetails ? '收起' : '详情'}
        </button>
      </div>

      {showDetails && (
        <div className="mt-3 pt-3 border-t space-y-2">
          <div className="flex gap-2">
            <button
              onClick={async () => {
                await db.patients.delete(patient.id!);
                onUpdate();
              }}
              className="px-3 py-1 text-sm text-destructive border border-destructive rounded"
            >
              删除
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
