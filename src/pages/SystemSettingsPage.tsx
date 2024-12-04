import React, { useState } from 'react';
import { Settings, Palette, Database, Layout, Link, CheckSquare, KeyRound, FileText, Shield } from 'lucide-react';
import GeneralSettings from '../components/system-settings/GeneralSettings';
import AppearanceSettings from '../components/system-settings/AppearanceSettings';
import ViewSettings from '../components/system-settings/ViewSettings';
import BackupSettings from '../components/system-settings/BackupSettings';
import IntegrationSettings from '../components/system-settings/IntegrationSettings';
import ReviewSettings from '../components/system-settings/ReviewSettings';
import VerificationCodesSettings from '../components/system-settings/VerificationCodesSettings';
import LegalSettings from '../components/system-settings/LegalSettings';
import RBACSettings from '../components/system-settings/RBACSettings';
import Toast from '../components/ui/Toast';
import { useToast } from '../hooks/useToast';

interface SystemSettingsProps {
  onSave: (data: any) => Promise<void>;
  isSaving: boolean;
}

const SystemSettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const { toasts, showToast, removeToast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'appearance', label: 'Apariencia', icon: Palette },
    { id: 'views', label: 'Vistas', icon: Layout },
    { id: 'backup', label: 'Copias de Seguridad', icon: Database },
    { id: 'integrations', label: 'Integraciones', icon: Link },
    { id: 'reviews', label: 'Correcciones', icon: CheckSquare },
    { id: 'verification-codes', label: 'Códigos de Verificación', icon: KeyRound },
    { id: 'legal', label: 'Documentos Legales', icon: FileText },
    { id: 'rbac', label: 'Control de Acceso', icon: Shield }
  ];

  const handleSave = async (data: any) => {
    setIsSaving(true);
    try {
      // TODO: Implement API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      showToast('Cambios guardados correctamente', 'success');
    } catch (error) {
      showToast('Error al guardar los cambios', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const renderContent = () => {
    const commonProps = {
      onSave: handleSave,
      isSaving,
    };

    switch (activeTab) {
      case 'general':
        return <GeneralSettings {...commonProps} />;
      case 'appearance':
        return <AppearanceSettings {...commonProps} />;
      case 'views':
        return <ViewSettings {...commonProps} />;
      case 'backup':
        return <BackupSettings {...commonProps} />;
      case 'integrations':
        return <IntegrationSettings {...commonProps} />;
      case 'reviews':
        return <ReviewSettings {...commonProps} />;
      case 'verification-codes':
        return <VerificationCodesSettings {...commonProps} />;
      case 'legal':
        return <LegalSettings {...commonProps} />;
      case 'rbac':
        return <RBACSettings {...commonProps} />;
      default:
        return <GeneralSettings {...commonProps} />;
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Configuración del Sistema</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center py-4 px-6 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-5 h-5 mr-2" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {renderContent()}
        </div>
      </div>

      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

export default SystemSettingsPage;