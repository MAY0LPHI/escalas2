import React, { useState } from 'react';
import { Plus, X, Edit2, Trash2, Save, UserPlus } from 'lucide-react';

const EmployeeManagement = ({ employees, onAdd, onUpdate, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    shiftType: '12x36',
    startDate: new Date().toISOString().split('T')[0],
    isSubstitute: false
  });

  const positions = [
    'Operador de Campo',
    'Supervisor',
    'Técnico de Segurança',
    'Motorista',
    'Auxiliar Administrativo',
    'Outro'
  ];

  const shiftTypes = [
    { value: '12x36', label: '12x36 (12h trabalho, 36h descanso)' },
    { value: '6x1', label: '6x1 (6 dias trabalho, 1 dia descanso)' },
    { value: '5x1', label: '5x1 (5 dias trabalho, 1 dia descanso)' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingEmployee) {
      onUpdate(editingEmployee.id, formData);
    } else {
      onAdd(formData);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      position: '',
      shiftType: '12x36',
      startDate: new Date().toISOString().split('T')[0],
      isSubstitute: false
    });
    setEditingEmployee(null);
    setIsModalOpen(false);
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setFormData({
      name: employee.name,
      position: employee.position,
      shiftType: employee.shiftType,
      startDate: employee.startDate,
      isSubstitute: employee.isSubstitute || false
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este funcionário?')) {
      onDelete(id);
    }
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Funcionários</h2>
          <p className="text-slate-600 mt-1">Gerenciar equipe e escalas</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <UserPlus size={20} />
          Adicionar Funcionário
        </button>
      </div>

      {/* Employee List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {employees.map(employee => (
          <div
            key={employee.id}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-slate-200"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900">{employee.name}</h3>
                <p className="text-slate-600 text-sm mt-1">{employee.position}</p>
                {employee.isSubstitute && (
                  <span className="inline-block mt-2 px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded">
                    Folguista
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(employee)}
                  className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(employee.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Escala:</span>
                <span className="font-medium text-slate-900">{employee.shiftType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Início:</span>
                <span className="font-medium text-slate-900">
                  {new Date(employee.startDate).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {employees.length === 0 && (
        <div className="text-center py-12">
          <UserPlus size={64} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-xl font-semibold text-slate-600 mb-2">
            Nenhum funcionário cadastrado
          </h3>
          <p className="text-slate-500">
            Adicione funcionários para começar a gerenciar as escalas
          </p>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center sticky top-0 bg-white">
              <h3 className="text-2xl font-bold text-slate-900">
                {editingEmployee ? 'Editar Funcionário' : 'Novo Funcionário'}
              </h3>
              <button
                onClick={resetForm}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Cargo *
                </label>
                <select
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="input-field"
                  required
                >
                  <option value="">Selecione um cargo</option>
                  {positions.map(pos => (
                    <option key={pos} value={pos}>{pos}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tipo de Escala *
                </label>
                <select
                  value={formData.shiftType}
                  onChange={(e) => setFormData({ ...formData, shiftType: e.target.value })}
                  className="input-field"
                  required
                  disabled={formData.isSubstitute}
                >
                  {shiftTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Data de Início da Escala *
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="input-field"
                  required
                  disabled={formData.isSubstitute}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isSubstitute"
                  checked={formData.isSubstitute}
                  onChange={(e) => setFormData({ ...formData, isSubstitute: e.target.checked })}
                  className="w-4 h-4 text-emerald-500 border-slate-300 rounded focus:ring-emerald-500"
                />
                <label htmlFor="isSubstitute" className="text-sm font-medium text-slate-700">
                  Este funcionário é folguista (substituto)
                </label>
              </div>

              {formData.isSubstitute && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                  <p className="text-sm text-emerald-800">
                    Folguistas cobrem automaticamente os cargos de funcionários que estão de folga.
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary"
                >
                  {editingEmployee ? 'Salvar' : 'Adicionar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeManagement;
