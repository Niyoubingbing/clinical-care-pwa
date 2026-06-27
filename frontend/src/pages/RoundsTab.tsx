import { useState, useEffect } from 'react';
import { db } from '../lib/db';
import { sortPatientsByRoundingOrder } from '../lib/rounding';
import type { Patient } from '../types/patient';
import PatientCard from '../components/PatientCard';
import AddPatientDialog from '../components/AddPatientDialog';

export default function RoundsTab() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [groupFilter, setGroupFilter] = useState<string>('全部');
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadPatients();
  }, []);

  async function loadPatients() {
    const allPatients = await db.patients.toArray();
    const sorted = sortPatientsByRoundingOrder(allPatients);
    setPatients(sorted);
  }

  const filteredPatients = patients.filter((p: Patient) => {
    if (groupFilter !== '全部' && p.group !== groupFilter) return false;
    if (search) {
      const searchLower = search.toLowerCase();
      return (
        p.bedNumber.toLowerCase().includes(searchLower) ||
        p.name.toLowerCase().includes(searchLower) ||
        p.diagnosis.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  return (
    <div className="p-4 pb-20">
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="搜索床号、姓名、诊断..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-3 py-2 border rounded-lg"
        />
      </div>

      <div className="mb-4 flex gap-2">
        {['全部', '解组', '勇组'].map(g => (
          <button
            key={g}
            onClick={() => setGroupFilter(g)}
            className={`px-3 py-1 rounded ${
              groupFilter === g ? 'bg-primary text-primary-foreground' : 'bg-secondary'
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredPatients.map((patient: Patient) => (
          <PatientCard key={patient.id} patient={patient} onUpdate={loadPatients} />
        ))}
      </div>

      {filteredPatients.length === 0 && (
        <div className="text-center text-muted-foreground mt-8">
          暂无病人，点击 + 添加
        </div>
      )}

      <AddPatientDialog onSuccess={loadPatients} />
    </div>
  );
}
