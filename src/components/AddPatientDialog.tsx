import { useState } from 'react';
import type { Patient } from '../types/patient';
import { db } from '../lib/db';

interface Props {
  onSuccess: () => void;
  editPatient?: Patient;
}

export default function AddPatientDialog({ onSuccess, editPatient }: Props) {
  const [open, setOpen] = useState(false);
  const [bedNumber, setBedNumber] = useState(editPatient?.bedNumber || '');
  const [name, setName] = useState(editPatient?.name || '');
  const [diagnosis, setDiagnosis] = useState(editPatient?.diagnosis || '');
  const [group, setGroup] = useState(editPatient?.group || '解组');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!bedNumber || !name) {
      alert('请填写床号和姓名');
      return;
    }

    if (editPatient?.id) {
      await db.patients.update(editPatient.id, {
        bedNumber,
        name,
        diagnosis,
        group,
        updatedAt: new Date(),
      });
    } else {
      await db.patients.add({
        bedNumber,
        name,
        diagnosis,
        group,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    setOpen(false);
    resetForm();
    onSuccess();
  }

  function resetForm() {
    setBedNumber('');
    setName('');
    setDiagnosis('');
    setGroup('解组');
  }

  return (
    <>
      {!editPatient && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-20 right-4 w-14 h-14 rounded-full bg-primary text-primary-foreground text-2xl shadow-lg z-50"
        >
          +
        </button>
      )}

      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50" onClick={() => setOpen(false)}>
          <div
            className="bg-background w-full rounded-t-xl p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold">
              {editPatient ? '编辑病人' : '添加病人'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">床号</label>
                <input
                  type="text"
                  value={bedNumber}
                  onChange={(e) => setBedNumber(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="如：309W41"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">姓名</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">诊断</label>
                <input
                  type="text"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">分组</label>
                <div className="flex gap-2">
                  {['解组', '勇组'].map(g => (
                    <button
                      type="button"
                      key={g}
                      onClick={() => setGroup(g)}
                      className={`px-3 py-1 rounded ${
                        group === g ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 py-2 border rounded-lg"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg"
                >
                  {editPatient ? '保存' : '添加'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
