import React from 'react';
import { ReportType, ReportFilter } from '../../types/report';
import { Plus, X } from 'lucide-react';

interface ReportFiltersProps {
  reportType: ReportType;
  filters: ReportFilter[];
  onChange: (filters: ReportFilter[]) => void;
}

const ReportFilters: React.FC<ReportFiltersProps> = ({
  reportType,
  filters,
  onChange
}) => {
  const getAvailableFields = (type: ReportType) => {
    switch (type) {
      case 'projects':
        return [
          { value: 'category', label: 'Categoría' },
          { value: 'status', label: 'Estado' },
          { value: 'center', label: 'Centro' },
          { value: 'department', label: 'Departamento' },
          { value: 'score', label: 'Puntuación' },
          { value: 'submissionDate', label: 'Fecha de Presentación' },
        ];
      case 'users':
        return [
          { value: 'role', label: 'Rol' },
          { value: 'center', label: 'Centro' },
          { value: 'department', label: 'Departamento' },
          { value: 'active', label: 'Estado' },
          { value: 'lastLogin', label: 'Último Acceso' },
        ];
      case 'reviews':
        return [
          { value: 'score', label: 'Puntuación' },
          { value: 'status', label: 'Estado' },
          { value: 'createdAt', label: 'Fecha de Creación' },
          { value: 'reviewerId', label: 'Revisor' },
        ];
      case 'statistics':
        return [
          { value: 'category', label: 'Categoría' },
          { value: 'period', label: 'Período' },
        ];
      default:
        return [];
    }
  };

  const addFilter = () => {
    const fields = getAvailableFields(reportType);
    if (fields.length === 0) return;

    const newFilter: ReportFilter = {
      field: fields[0].value,
      operator: 'equals',
      value: ''
    };

    onChange([...filters, newFilter]);
  };

  const removeFilter = (index: number) => {
    const newFilters = filters.filter((_, i) => i !== index);
    onChange(newFilters);
  };

  const updateFilter = (index: number, field: string, value: any) => {
    const newFilters = [...filters];
    newFilters[index] = { ...newFilters[index], [field]: value };
    onChange(newFilters);
  };

  return (
    <div className="space-y-4">
      {filters.map((filter, index) => (
        <div key={index} className="flex items-center space-x-2">
          <select
            value={filter.field}
            onChange={(e) => updateFilter(index, 'field', e.target.value)}
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
          >
            {getAvailableFields(reportType).map(field => (
              <option key={field.value} value={field.value}>
                {field.label}
              </option>
            ))}
          </select>

          <select
            value={filter.operator}
            onChange={(e) => updateFilter(index, 'operator', e.target.value)}
            className="w-32 rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="equals">Igual a</option>
            <option value="contains">Contiene</option>
            <option value="greaterThan">Mayor que</option>
            <option value="lessThan">Menor que</option>
            <option value="between">Entre</option>
            <option value="in">En lista</option>
          </select>

          <input
            type="text"
            value={filter.value}
            onChange={(e) => updateFilter(index, 'value', e.target.value)}
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
            placeholder="Valor"
          />

          <button
            onClick={() => removeFilter(index)}
            className="p-2 text-gray-400 hover:text-red-500"
          >
            <X size={20} />
          </button>
        </div>
      ))}

      <button
        onClick={addFilter}
        className="w-full flex items-center justify-center space-x-2 py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:border-blue-500 hover:text-blue-500"
      >
        <Plus size={20} />
        <span>Añadir filtro</span>
      </button>
    </div>
  );
};

export default ReportFilters;