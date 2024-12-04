import React from 'react';
import { ReportType, ReportFilter } from '../../types/report';

interface ReportPreviewProps {
  reportType: ReportType;
  filters: ReportFilter[];
}

const ReportPreview: React.FC<ReportPreviewProps> = ({
  reportType,
  filters
}) => {
  // Mock data for preview
  const previewData = {
    projects: [
      {
        id: '1',
        title: 'Sistema IoT',
        category: 'Tecnología',
        status: 'active',
        center: 'IES Tecnológico',
        department: 'Informática',
        score: 8.5,
        submissionDate: '2024-03-15',
      },
      {
        id: '2',
        title: 'Plataforma Educativa',
        category: 'Educación',
        status: 'reviewing',
        center: 'IES Innovación',
        department: 'Pedagogía',
        score: null,
        submissionDate: '2024-03-10',
      }
    ],
    users: [
      {
        id: '1',
        name: 'Juan Pérez',
        email: 'juan@example.com',
        role: 'admin',
        center: 'IES Tecnológico',
        department: 'Informática',
        active: true,
        lastLogin: '2024-03-15',
      },
      {
        id: '2',
        name: 'Ana Martínez',
        email: 'ana@example.com',
        role: 'reviewer',
        center: 'IES Innovación',
        department: 'Pedagogía',
        active: true,
        lastLogin: '2024-03-14',
      }
    ],
    reviews: [
      {
        id: '1',
        projectId: '1',
        projectTitle: 'Sistema IoT',
        reviewerId: '2',
        reviewerName: 'Ana Martínez',
        score: 8.5,
        status: 'completed',
        createdAt: '2024-03-15',
        updatedAt: '2024-03-15',
      },
      {
        id: '2',
        projectId: '1',
        projectTitle: 'Sistema IoT',
        reviewerId: '3',
        reviewerName: 'Carlos López',
        score: 9.0,
        status: 'completed',
        createdAt: '2024-03-14',
        updatedAt: '2024-03-14',
      }
    ],
    statistics: [
      {
        metric: 'Proyectos Activos',
        value: 15,
        category: 'Proyectos',
        period: '2024',
      },
      {
        metric: 'Revisiones Completadas',
        value: 45,
        category: 'Revisiones',
        period: '2024',
      }
    ]
  };

  const getColumns = (type: ReportType) => {
    switch (type) {
      case 'projects':
        return ['ID', 'Título', 'Categoría', 'Estado', 'Centro', 'Departamento', 'Puntuación', 'Fecha'];
      case 'users':
        return ['ID', 'Nombre', 'Email', 'Rol', 'Centro', 'Departamento', 'Estado', 'Último Acceso'];
      case 'reviews':
        return ['ID', 'Proyecto', 'Revisor', 'Puntuación', 'Estado', 'Fecha'];
      case 'statistics':
        return ['Métrica', 'Valor', 'Categoría', 'Período'];
      default:
        return [];
    }
  };

  const getData = (type: ReportType) => {
    return previewData[type] || [];
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {getColumns(reportType).map((column, index) => (
              <th
                key={index}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {getData(reportType).map((row: any, index: number) => (
            <tr key={index}>
              {Object.values(row).map((value: any, cellIndex: number) => (
                <td
                  key={cellIndex}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                >
                  {value?.toString() || '-'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {getData(reportType).length === 0 && (
        <div className="text-center py-12">
          <p className="text-sm text-gray-500">No hay datos para mostrar</p>
        </div>
      )}
    </div>
  );
};

export default ReportPreview;