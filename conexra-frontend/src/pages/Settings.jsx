import { useState, useEffect } from 'react';
import { FaCog, FaSave } from 'react-icons/fa';
import { getSettings, updateSettings } from '../services/settingsService';

function Settings() {
  const [settings, setSettings] = useState({ companyName: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    getSettings()
      .then((data) => {
        setSettings(data);
        setError(null);
      })
      .catch((err) => setError(err?.response?.data?.error || err.message))
      .finally(() => setLoading(false));
  }, []);

  const onSave = async () => {
    setError(null);
    try {
      const updated = await updateSettings(settings);
      setSettings(updated);
      setMessage('Settings saved successfully');
      setTimeout(() => setMessage(''), 2500);
    } catch (err) {
      setError(err?.response?.data?.error || err.message);
    }
  };

  if (loading) return <div style={{ padding: '24px' }}>Loading settings...</div>;

  return (
    <div style={pageContainer}>
      <h1 style={pageTitle}>Application Settings</h1>
      {error && <div style={errorText}>{error}</div>}
      {message && <div style={successText}>{message}</div>}
      <div style={settingsForm}>
        <label style={label}>Company Name</label>
        <input
          value={settings.companyName || ''}
          onChange={(e) => setSettings((prev) => ({ ...prev, companyName: e.target.value }))}
          style={inputStyle}
        />

        <label style={label}>Support Email</label>
        <input
          value={settings.email || ''}
          onChange={(e) => setSettings((prev) => ({ ...prev, email: e.target.value }))}
          style={inputStyle}
        />

        <button onClick={onSave} style={saveBtn}><FaSave /> Save Settings</button>
      </div>
    </div>
  );
}

const pageContainer = { width: '100%', maxWidth: '1400px', margin: '0 auto' };
const pageTitle = { fontSize: '28px', color: '#0f172a', marginBottom: '16px' };
const settingsForm = { background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', display: 'grid', gap: '12px', maxWidth: '500px' };
const label = { fontSize: '14px', fontWeight: 600, color: '#334155' };
const inputStyle = { padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px' };
const saveBtn = { marginTop: '12px', padding: '10px 14px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' };
const errorText = { color: '#b91c1c', marginBottom: '10px' };
const successText = { color: '#065f46', marginBottom: '10px' };

export default Settings;
