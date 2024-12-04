import React, { useState } from 'react';
import { X, ArrowLeft, ArrowRight, Save, AlertCircle } from 'lucide-react';
import { Project } from '../../types/project';
import { Review } from '../../types/review';

interface ReviewWizardProps {
  project: Project;
  onClose: () => void;
  onSave: (reviewData: any, isDraft: boolean) => Promise<void>;
  onRequestCorrection: (observations: string) => Promise<void>;
}

const ReviewWizard: React.FC<ReviewWizardProps> = ({
  project,
  onClose,
  onSave,
  onRequestCorrection,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    projectReview: {
      isComplete: false,
      needsCorrection: false,
      observations: '',
      fieldsToCorrect: [] as string[],
      documentsToCorrect: [] as string[],
    },
    review: {
      scores: {} as Record<string, number>,
      comments: {} as Record<string, string>,
      generalObservations: '',
    },
  });

  const [isSaving, setIsSaving] = useState(false);

  const steps = [
    {
      title: 'Revisión del Proyecto',
      content: (
        <div className="space-y-6">
          {/* Project Details */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Información del Proyecto</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Título</p>
                <p className="mt-1 text-base text-gray-900">{project.title}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Categoría</p>
                <p className="mt-1 text-base text-gray-900">{project.category?.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Centro</p>
                <p className="mt-1 text-base text-gray-900">{project.center}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Departamento</p>
                <p className="mt-1 text-base text-gray-900">{project.department}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Importe solicitado</p>
                <p className="mt-1 text-base text-gray-900">
                  {project.requestedAmount?.toLocaleString('es-ES')}€
                  {project.category?.totalBudget && (
                    <span className="text-sm text-gray-500 ml-1">
                      (Máx. {project.category.totalBudget.toLocaleString('es-ES')}€)
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Documentos</h3>
            <div className="space-y-3">
              {project.documents?.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.projectReview.documentsToCorrect.includes(doc.id)}
                      onChange={(e) => {
                        const newDocs = e.target.checked
                          ? [...formData.projectReview.documentsToCorrect, doc.id]
                          : formData.projectReview.documentsToCorrect.filter(id => id !== doc.id);
                        setFormData({
                          ...formData,
                          projectReview: {
                            ...formData.projectReview,
                            documentsToCorrect: newDocs,
                          },
                        });
                      }}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                      <p className="text-xs text-gray-500">
                        Subido el {new Date(doc.uploadDate).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => window.open(doc.url, '_blank')}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    Ver documento
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Review Decision */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Decisión de Revisión</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.projectReview.needsCorrection}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      projectReview: {
                        ...formData.projectReview,
                        needsCorrection: e.target.checked,
                      },
                    });
                  }}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300"
                />
                <label className="text-sm font-medium text-gray-700">
                  El proyecto requiere subsanación
                </label>
              </div>

              {formData.projectReview.needsCorrection && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Observaciones para la subsanación
                  </label>
                  <textarea
                    value={formData.projectReview.observations}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        projectReview: {
                          ...formData.projectReview,
                          observations: e.target.value,
                        },
                      });
                    }}
                    rows={4}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Describe los aspectos que necesitan ser subsanados..."
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      ),
      isValid: () => {
        if (formData.projectReview.needsCorrection) {
          return formData.projectReview.observations.trim() !== '';
        }
        return true;
      },
    },
    {
      title: 'Formulario de Corrección',
      content: (
        <div className="space-y-6">
          {project.category?.rubric?.sections.map((section) => (
            <div key={section.id} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900">{section.name}</h3>
                {section.description && (
                  <p className="mt-1 text-sm text-gray-500">{section.description}</p>
                )}
                <p className="mt-2 text-sm text-blue-600">
                  Peso en la evaluación: {section.weight}%
                </p>
              </div>

              <div className="space-y-6">
                {section.criteria.map((criterion) => (
                  <div key={criterion.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="mb-4">
                      <h4 className="text-base font-medium text-gray-900">{criterion.name}</h4>
                      <p className="mt-1 text-sm text-gray-500">{criterion.description}</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Puntuación
                        </label>
                        <select
                          value={formData.review.scores[criterion.id] || ''}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              review: {
                                ...formData.review,
                                scores: {
                                  ...formData.review.scores,
                                  [criterion.id]: Number(e.target.value),
                                },
                              },
                            });
                          }}
                          className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                        >
                          <option value="">Seleccionar puntuación</option>
                          {criterion.levels.map((level) => (
                            <option key={level.id} value={level.score}>
                              {level.score} - {level.description}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Comentarios
                        </label>
                        <textarea
                          value={formData.review.comments[criterion.id] || ''}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              review: {
                                ...formData.review,
                                comments: {
                                  ...formData.review.comments,
                                  [criterion.id]: e.target.value,
                                },
                              },
                            });
                          }}
                          rows={3}
                          className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                          placeholder="Añade comentarios justificativos de la puntuación..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Observaciones Generales
            </h3>
            <textarea
              value={formData.review.generalObservations}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  review: {
                    ...formData.review,
                    generalObservations: e.target.value,
                  },
                });
              }}
              rows={4}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Añade observaciones generales sobre el proyecto..."
            />
          </div>
        </div>
      ),
      isValid: () => {
        if (!project.category?.rubric) return false;
        return project.category.rubric.sections.every((section) =>
          section.criteria.every((criterion) => formData.review.scores[criterion.id])
        );
      },
    },
  ];

  const handleFinish = async () => {
    setIsSaving(true);
    try {
      if (formData.projectReview.needsCorrection) {
        await onRequestCorrection(formData.projectReview.observations);
      } else {
        await onSave(formData.review, false);
      }
      onClose();
    } catch (error) {
      console.error('Error saving review:', error);
      // TODO: Show error toast
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-200 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Nueva Corrección</h2>
            <p className="mt-1 text-sm text-gray-500">
              Paso {currentStep + 1} de {steps.length}: {steps[currentStep].title}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {steps[currentStep].content}
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-between">
          <button
            onClick={() => setCurrentStep(currentStep - 1)}
            disabled={currentStep === 0}
            className={`btn btn-secondary flex items-center space-x-2 ${
              currentStep === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <ArrowLeft size={20} />
            <span>Anterior</span>
          </button>

          <div className="flex items-center space-x-4">
            {currentStep === steps.length - 1 ? (
              <button
                onClick={handleFinish}
                disabled={isSaving || !steps[currentStep].isValid()}
                className="btn btn-primary flex items-center space-x-2"
              >
                <Save size={20} />
                <span>
                  {isSaving ? 'Guardando...' : 
                   formData.projectReview.needsCorrection ? 'Solicitar subsanación' : 
                   'Guardar corrección'}
                </span>
              </button>
            ) : (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!steps[currentStep].isValid()}
                className="btn btn-primary flex items-center space-x-2"
              >
                <span>Siguiente</span>
                <ArrowRight size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewWizard;