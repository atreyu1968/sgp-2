import React, { useState } from 'react';
import { KeyRound, Shield, History } from 'lucide-react';

const SecuritySettings: React.FC = () => {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement password change
    console.log('Changing password:', passwordForm);
    setShowChangePassword(false);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const recentActivity = [
    {
      action: 'Inicio de sesión',
      device: 'Chrome en Windows',
      location: 'Madrid, España',
      date: '2024-03-15 10:30',
    },
    {
      action: 'Cambio de contraseña',
      device: 'Firefox en MacOS',
      location: 'Barcelona, España',
      date: '2024-03-10 15:45',
    },
    {
      action: 'Inicio de sesión',
      device: 'Safari en iOS',
      location: 'Valencia, España',
      date: '2024-03-08 09:15',
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Seguridad</h2>

      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <KeyRound className="text-gray-400" size={20} />
              <h3 className="text-base font-medium text-gray-900">Contraseña</h3>
            </div>
            <button
              onClick={() => setShowChangePassword(!showChangePassword)}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Cambiar contraseña
            </button>
          </div>

          {showChangePassword && (
            <form onSubmit={handlePasswordSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Contraseña actual
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nueva contraseña
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Confirmar nueva contraseña
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowChangePassword(false)}
                  className="btn btn-secondary"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Guardar cambios
                </button>
              </div>
            </form>
          )}
        </div>

        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Shield className="text-gray-400" size={20} />
            <h3 className="text-base font-medium text-gray-900">Verificación en dos pasos</h3>
          </div>

          <div className="flex items-center justify-between py-4 border-t border-gray-100">
            <div>
              <p className="text-sm font-medium text-gray-900">Autenticación por SMS</p>
              <p className="text-sm text-gray-500">
                Recibe un código por SMS para verificar tu identidad
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-4 border-t border-gray-100">
            <div>
              <p className="text-sm font-medium text-gray-900">Aplicación de autenticación</p>
              <p className="text-sm text-gray-500">
                Usa una aplicación como Google Authenticator
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        <div>
          <div className="flex items-center space-x-2 mb-4">
            <History className="text-gray-400" size={20} />
            <h3 className="text-base font-medium text-gray-900">Actividad reciente</h3>
          </div>

          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 border-t border-gray-100 first:border-t-0"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-500">
                    {activity.device} • {activity.location}
                  </p>
                </div>
                <span className="text-sm text-gray-500">{activity.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;