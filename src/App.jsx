import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Users, 
  Settings, 
  Download, 
  Upload,
  MessageSquare,
  Plus,
  X,
  Save,
  RefreshCw,
  Menu,
  Home,
  UserPlus
} from 'lucide-react';
import EmployeeManagement from './components/EmployeeManagement';
import ScheduleView from './components/ScheduleView';
import WhatsAppExport from './components/WhatsAppExport';
import { loadFromStorage, saveToStorage } from './utils/storage';
import { calculateSchedule } from './utils/scheduleCalculator';

function App() {
  const [currentView, setCurrentView] = useState('schedule');
  const [employees, setEmployees] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Load data from localStorage on mount - legitimate use case for setting initial state
  useEffect(() => {
    const savedEmployees = loadFromStorage('employees');
    if (savedEmployees && savedEmployees.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEmployees(savedEmployees);
    }
  }, []);

  // Save employees to localStorage whenever they change
  useEffect(() => {
    if (employees.length > 0) {
      saveToStorage('employees', employees);
    }
  }, [employees]);

  // Auto-generate schedule when date or employees change - computing derived state
  useEffect(() => {
    if (employees.length > 0) {
      const newSchedule = calculateSchedule(employees, selectedDate);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSchedule(newSchedule);
      saveToStorage('currentSchedule', newSchedule);
    }
  }, [employees, selectedDate]);

  const handleAddEmployee = (employee) => {
    setEmployees([...employees, { ...employee, id: Date.now().toString() }]);
  };

  const handleUpdateEmployee = (id, updatedEmployee) => {
    setEmployees(employees.map(emp => emp.id === id ? { ...emp, ...updatedEmployee } : emp));
  };

  const handleDeleteEmployee = (id) => {
    setEmployees(employees.filter(emp => emp.id !== id));
  };

  const handleExportJSON = () => {
    const data = {
      employees,
      schedule,
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `escalas-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (data.employees) {
            setEmployees(data.employees);
          }
        } catch {
          alert('Erro ao importar arquivo JSON');
        }
      };
      reader.readAsText(file);
    }
  };

  const menuItems = [
    { id: 'schedule', icon: Calendar, label: 'Escala' },
    { id: 'employees', icon: Users, label: 'Funcionários' },
    { id: 'whatsapp', icon: MessageSquare, label: 'WhatsApp' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 bg-slate-900 text-white flex-col">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-2xl font-bold text-emerald-500">Escalas 2.0</h1>
          <p className="text-slate-400 text-sm mt-1">Gerenciamento Operacional</p>
        </div>
        
        <nav className="flex-1 p-4">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all duration-200 ${
                currentView === item.id 
                  ? 'bg-emerald-500 text-white shadow-lg' 
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleExportJSON}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors mb-2"
          >
            <Download size={20} />
            <span>Exportar JSON</span>
          </button>
          <label className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer">
            <Upload size={20} />
            <span>Importar JSON</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportJSON}
              className="hidden"
            />
          </label>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-emerald-500">Escalas 2.0</h1>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 hover:bg-slate-800 rounded-lg"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="bg-slate-900 w-64 h-full p-4" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-4 right-4 p-2 hover:bg-slate-800 rounded-lg text-white"
            >
              <X size={24} />
            </button>
            <div className="mt-12">
              {menuItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all duration-200 ${
                    currentView === item.id 
                      ? 'bg-emerald-500 text-white' 
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </button>
              ))}
              <div className="border-t border-slate-800 mt-4 pt-4">
                <button
                  onClick={handleExportJSON}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 mb-2"
                >
                  <Download size={20} />
                  <span>Exportar JSON</span>
                </button>
                <label className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 cursor-pointer">
                  <Upload size={20} />
                  <span>Importar JSON</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportJSON}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto">
          {currentView === 'schedule' && (
            <ScheduleView
              schedule={schedule}
              employees={employees}
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
            />
          )}
          
          {currentView === 'employees' && (
            <EmployeeManagement
              employees={employees}
              onAdd={handleAddEmployee}
              onUpdate={handleUpdateEmployee}
              onDelete={handleDeleteEmployee}
            />
          )}
          
          {currentView === 'whatsapp' && (
            <WhatsAppExport
              schedule={schedule}
              selectedDate={selectedDate}
            />
          )}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 flex justify-around py-2">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              currentView === item.id 
                ? 'text-emerald-500' 
                : 'text-slate-400'
            }`}
          >
            <item.icon size={24} />
            <span className="text-xs">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

export default App;
