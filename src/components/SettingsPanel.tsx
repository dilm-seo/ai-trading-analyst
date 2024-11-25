import React from 'react';
import { Settings, Save } from 'lucide-react';
import { useSettingsStore } from '../store/settings';

export const SettingsPanel: React.FC = () => {
  const { apiKey, model, language, setApiKey, setModel, setLanguage } = useSettingsStore();
  const [isOpen, setIsOpen] = React.useState(false);
  const [tempSettings, setTempSettings] = React.useState({
    apiKey,
    model,
    language,
  });

  const models = [
    'gpt-4-turbo-preview',
    'gpt-4',
    'gpt-3.5-turbo',
  ];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
    { code: 'es', name: 'Español' },
    { code: 'de', name: 'Deutsch' },
    { code: 'it', name: 'Italiano' },
    { code: 'pt', name: 'Português' },
    { code: 'nl', name: 'Nederlands' },
    { code: 'ru', name: 'Русский' },
    { code: 'zh', name: '中文' },
    { code: 'ja', name: '日本語' },
  ];

  const handleSave = () => {
    setApiKey(tempSettings.apiKey);
    setModel(tempSettings.model);
    setLanguage(tempSettings.language);
    setIsOpen(false);
  };

  React.useEffect(() => {
    setTempSettings({ apiKey, model, language });
  }, [isOpen]);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-slate-700 transition-colors"
      >
        <Settings className="w-6 h-6 text-slate-200" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-slate-800 rounded-lg shadow-xl p-4 z-50">
          <h3 className="text-lg font-semibold text-slate-200 mb-4">Settings</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                OpenAI API Key
              </label>
              <input
                type="password"
                value={tempSettings.apiKey}
                onChange={(e) => setTempSettings({ ...tempSettings, apiKey: e.target.value })}
                className="w-full bg-slate-700 text-slate-200 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                placeholder="sk-..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Model
              </label>
              <select
                value={tempSettings.model}
                onChange={(e) => setTempSettings({ ...tempSettings, model: e.target.value })}
                className="w-full bg-slate-700 text-slate-200 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
              >
                {models.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Language
              </label>
              <select
                value={tempSettings.language}
                onChange={(e) => setTempSettings({ ...tempSettings, language: e.target.value })}
                className="w-full bg-slate-700 text-slate-200 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleSave}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 px-4 flex items-center justify-center gap-2 transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
};