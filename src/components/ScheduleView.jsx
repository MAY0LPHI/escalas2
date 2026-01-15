import React from 'react';
import { Calendar, ChevronLeft, ChevronRight, RefreshCw, Users } from 'lucide-react';
import { formatDate } from '../utils/scheduleCalculator';

const ScheduleView = ({ schedule, employees, selectedDate, onDateChange, onUpdateSchedule }) => {
  const handlePreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    onDateChange(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    onDateChange(newDate);
  };

  const handleToday = () => {
    onDateChange(new Date());
  };

  const getShiftLabel = (shiftType) => {
    const labels = {
      '12x36': '12x36',
      '6x1': '6x1',
      '5x1': '5x1'
    };
    return labels[shiftType] || shiftType;
  };

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Escala do Dia</h2>
        
        {/* Date Navigation */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center gap-3">
            <Calendar className="text-emerald-500" size={24} />
            <div>
              <p className="text-sm text-slate-600">Data Selecionada</p>
              <p className="text-lg font-bold text-slate-900 capitalize">
                {formatDate(selectedDate)}
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handlePreviousDay}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              title="Dia anterior"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={handleToday}
              className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium"
            >
              Hoje
            </button>
            <button
              onClick={handleNextDay}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              title="Próximo dia"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Schedule Grid */}
      {schedule.length > 0 ? (
        <div className="space-y-4">
          {schedule.map((section, index) => (
            <div
              key={index}
              className={`rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl ${
                section.position === 'Folga' 
                  ? 'bg-slate-200 border-2 border-slate-300' 
                  : 'bg-slate-900 border-2 border-slate-800'
              }`}
            >
              {/* Section Header */}
              <div className={`p-4 flex items-center justify-between ${
                section.position === 'Folga' 
                  ? 'bg-slate-300' 
                  : 'bg-slate-800'
              }`}>
                <div className="flex items-center gap-3">
                  <Users className={section.position === 'Folga' ? 'text-slate-700' : 'text-emerald-500'} size={24} />
                  <div>
                    <h3 className={`text-xl font-bold ${
                      section.position === 'Folga' ? 'text-slate-900' : 'text-white'
                    }`}>
                      {section.position}
                    </h3>
                    <p className={`text-sm ${
                      section.position === 'Folga' ? 'text-slate-600' : 'text-slate-400'
                    }`}>
                      {section.employees.length} {section.employees.length === 1 ? 'pessoa' : 'pessoas'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Employees List */}
              <div className="p-4 space-y-3">
                {section.employees.length > 0 ? (
                  section.employees.map((employee, empIndex) => (
                    <div
                      key={empIndex}
                      className={`p-4 rounded-lg transition-all duration-200 ${
                        section.position === 'Folga'
                          ? 'bg-white border border-slate-300'
                          : employee.isCovering
                          ? 'bg-emerald-900 border-2 border-emerald-500'
                          : 'bg-slate-800 border border-slate-700'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className={`font-bold text-lg ${
                              section.position === 'Folga' ? 'text-slate-900' : 'text-white'
                            }`}>
                              {employee.name}
                            </h4>
                            {employee.isCovering && (
                              <span className="px-2 py-1 bg-emerald-500 text-white text-xs font-bold rounded flex items-center gap-1">
                                🔄 COBERTURA
                              </span>
                            )}
                            {employee.isSubstitute && !employee.isCovering && (
                              <span className="px-2 py-1 bg-blue-500 text-white text-xs font-bold rounded">
                                Folguista
                              </span>
                            )}
                          </div>
                          
                          {employee.isCovering && employee.coveringFor && (
                            <p className={`text-sm mb-2 ${
                              section.position === 'Folga' ? 'text-slate-600' : 'text-emerald-300'
                            }`}>
                              Cobrindo: {employee.coveringFor}
                            </p>
                          )}
                          
                          {!employee.isSubstitute && (
                            <p className={`text-sm ${
                              section.position === 'Folga' ? 'text-slate-600' : 'text-slate-400'
                            }`}>
                              Escala: {getShiftLabel(employee.shiftType)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={`p-6 text-center rounded-lg ${
                    section.position === 'Folga' 
                      ? 'bg-white border border-slate-300' 
                      : 'bg-slate-800'
                  }`}>
                    <p className={section.position === 'Folga' ? 'text-slate-600' : 'text-slate-400'}>
                      Nenhum funcionário nesta categoria
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <Users size={64} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-xl font-semibold text-slate-600 mb-2">
            Nenhuma escala disponível
          </h3>
          <p className="text-slate-500">
            Adicione funcionários para gerar a escala automaticamente
          </p>
        </div>
      )}

      {/* Info Box */}
      {employees.length > 0 && (
        <div className="mt-6 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <RefreshCw className="text-emerald-600 flex-shrink-0 mt-1" size={20} />
            <div>
              <h4 className="font-bold text-emerald-900 mb-1">Sistema Auto-Montado</h4>
              <p className="text-sm text-emerald-800">
                A escala é calculada automaticamente baseada nas datas de início e tipos de escala de cada funcionário. 
                Folguistas são alocados automaticamente quando há funcionários de folga.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleView;
