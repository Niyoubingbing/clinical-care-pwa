import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { initializeDB } from './lib/db';
import RoundsTab from './pages/RoundsTab';
import TodosTab from './pages/TodosTab';
import SettingsTab from './pages/SettingsTab';

const queryClient = new QueryClient();

type Tab = 'rounds' | 'todos' | 'settings';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('rounds');

  useEffect(() => {
    initializeDB();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto">
        <main className="flex-1 overflow-y-auto">
          {activeTab === 'rounds' && <RoundsTab />}
          {activeTab === 'todos' && <TodosTab />}
          {activeTab === 'settings' && <SettingsTab />}
        </main>

        <nav className="sticky bottom-0 border-t bg-background">
          <div className="flex justify-around">
            <button
              onClick={() => setActiveTab('rounds')}
              className={`flex-1 py-3 px-4 ${
                activeTab === 'rounds' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <div className="flex flex-col items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                </svg>
                <span className="text-xs">查房</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('todos')}
              className={`flex-1 py-3 px-4 ${
                activeTab === 'todos' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <div className="flex flex-col items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 11l3 3L22 4" />
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
                <span className="text-xs">待办</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex-1 py-3 px-4 ${
                activeTab === 'settings' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <div className="flex flex-col items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-.83 2 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
                <span className="text-xs">设置</span>
              </div>
            </button>
          </div>
        </nav>
      </div>
    </QueryClientProvider>
  );
}

export default App;
