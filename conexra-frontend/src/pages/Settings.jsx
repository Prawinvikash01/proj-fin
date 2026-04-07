import { useState, useEffect } from 'react';
import { FaCog, FaSave, FaPlus, FaTrash } from 'react-icons/fa';
import { getSettings, updateSettings } from '../services/settingsService';

function Settings() {
  const [settings, setSettings] = useState({ companyName: '', email: '', leaveTypes: [], holidays: [] });
  const [newLeaveType, setNewLeaveType] = useState('');
  const [newHoliday, setNewHoliday] = useState({ name: '', date: '' });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    getSettings()
      .then((data) => {
        setSettings({
          companyName: data.companyName || '',
          email: data.email || '',
          leaveTypes: Array.isArray(data.leaveTypes) ? data.leaveTypes : [],
          holidays: Array.isArray(data.holidays) ? data.holidays : []
        });
        setError(null);
      })
      .catch((err) => setError(err?.response?.data?.error || err.message))
      .finally(() => setLoading(false));
  }, []);

  const onSave = async () => {
    setError(null);
    try {
      const updated = await updateSettings(settings);
      setSettings({
        companyName: updated.companyName || '',
        email: updated.email || '',
        leaveTypes: Array.isArray(updated.leaveTypes) ? updated.leaveTypes : [],
        holidays: Array.isArray(updated.holidays) ? updated.holidays : []
      });
      setMessage('Settings saved successfully');
      setTimeout(() => setMessage(''), 2500);
    } catch (err) {
      setError(err?.response?.data?.error || err.message);
    }
  };

  const addLeaveType = () => {
    if (!newLeaveType.trim()) {
      setError('Leave type name is required.');
      return;
    }
    if (settings.leaveTypes.includes(newLeaveType.trim())) {
      setError('This leave type already exists.');
      return;
    }
    setSettings((prev) => ({ ...prev, leaveTypes: [...prev.leaveTypes, newLeaveType.trim()] }));
    setNewLeaveType('');
    setError(null);
  };

  const removeLeaveType = (type) => {
    setSettings((prev) => ({ ...prev, leaveTypes: prev.leaveTypes.filter((item) => item !== type) }));
  };

  const addHoliday = () => {
    if (!newHoliday.name.trim() || !newHoliday.date) {
      setError('Holiday name and date are required.');
      return;
    }
    setSettings((prev) => ({
      ...prev,
      holidays: [...prev.holidays, { name: newHoliday.name.trim(), date: newHoliday.date }]
    }));
    setNewHoliday({ name: '', date: '' });
    setError(null);
  };

  const removeHoliday = (date) => {
    setSettings((prev) => ({ ...prev, holidays: prev.holidays.filter((holiday) => holiday.date !== date) }));
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
          value={settings.companyName}
          onChange={(e) => setSettings((prev) => ({ ...prev, companyName: e.target.value }))}
          style={inputStyle}
        />

        <label style={label}>Support Email</label>
        <input
          value={settings.email}
          onChange={(e) => setSettings((prev) => ({ ...prev, email: e.target.value }))}
          style={inputStyle}
        />

        <div style={section}>
          <h2 style={sectionTitle}>Leave Types</h2>
          <div style={sectionRow}>
            <input
              value={newLeaveType}
              onChange={(e) => setNewLeaveType(e.target.value)}
              placeholder="New leave type"
              style={inputStyle}
            />
            <button onClick={addLeaveType} style={secondaryButton}><FaPlus /> Add type</button>
          </div>
          <div style={chipRow}>
            {settings.leaveTypes.length === 0 && <span style={hintText}>No leave types configured.</span>}
            {settings.leaveTypes.map((type) => (
              <div key={type} style={chip}>
                {type}
                <button onClick={() => removeLeaveType(type)} style={chipRemove}>&times;</button>
              </div>
            ))}
          </div>
        </div>

        <div style={section}>
          <h2 style={sectionTitle}>Holiday Calendar</h2>
          <div style={sectionRow}>
            <input
              value={newHoliday.name}
              onChange={(e) => setNewHoliday((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Holiday name"
              style={inputStyle}
            />
            <input
              type="date"
              value={newHoliday.date}
              onChange={(e) => setNewHoliday((prev) => ({ ...prev, date: e.target.value }))}
              style={inputStyle}
            />
            <button onClick={addHoliday} style={secondaryButton}><FaPlus /> Add holiday</button>
          </div>
          <div style={holidayList}>
            {settings.holidays.length === 0 && <div style={hintText}>No holidays configured.</div>}
            {settings.holidays.map((holiday) => (
              <div key={holiday.date} style={holidayItem}>
                <div><strong>{holiday.name}</strong> — {new Date(holiday.date).toLocaleDateString()}</div>
                <button onClick={() => removeHoliday(holiday.date)} style={chipRemove}>&times;</button>
              </div>
            ))}
          </div>
        </div>

        <button onClick={onSave} style={saveBtn}><FaSave /> Save Settings</button>
      </div>
    </div>
  );
}

const pageContainer = { width: '100%', maxWidth: '1400px', margin: '0 auto' };
const pageTitle = { fontSize: '28px', color: '#0f172a', marginBottom: '16px' };
const settingsForm = { background: 'white', padding: '24px', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', display: 'grid', gap: '16px', maxWidth: '800px' };
const label = { fontSize: '14px', fontWeight: 600, color: '#334155' };
const inputStyle = { padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', width: '100%' };
const saveBtn = { marginTop: '12px', padding: '12px 18px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', width: 'fit-content' };
const errorText = { color: '#b91c1c', marginBottom: '10px' };
const successText = { color: '#065f46', marginBottom: '10px' };
const section = { background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0' };
const sectionTitle = { fontSize: '18px', marginBottom: '12px' };
const sectionRow = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', alignItems: 'center', marginBottom: '12px' };
const secondaryButton = { background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 14px', cursor: 'pointer', width: 'fit-content' };
const chipRow = { display: 'flex', flexWrap: 'wrap', gap: '10px' };
const chip = { display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '8px 12px', background: 'white', borderRadius: '9999px', border: '1px solid #cbd5e1' };
const chipRemove = { border: 'none', background: 'transparent', color: '#ef4444', fontSize: '16px', cursor: 'pointer' };
const holidayList = { display: 'grid', gap: '10px' };
const holidayItem = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'white', borderRadius: '10px', border: '1px solid #e2e8f0' };
const hintText = { color: '#64748b' };

export default Settings;
