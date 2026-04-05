import { useEffect, useState } from 'react';
import { FaBell, FaCheckDouble, FaSyncAlt } from 'react-icons/fa';
import { getNotifications, markAllAsRead } from '../services/notificationService';

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (err) {
      setError(err?.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const markRead = async () => {
    try {
      await markAllAsRead();
      await load();
    } catch (err) {
      setError(err?.response?.data?.error || err.message);
    }
  };

  return (
    <div style={pageContainer}>
      <div style={headerStyle}>
        <h1 style={pageTitle}>Notifications</h1>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={load} style={refreshButton}><FaSyncAlt /> Refresh</button>
          <button onClick={markRead} style={markButton}><FaCheckDouble /> Mark all read</button>
        </div>
      </div>

      {error && <div style={errorStyle}>{error}</div>}
      {loading ? <div>Loading notifications...</div> : (
        <ul style={list}>
          {notifications.length === 0 && <li style={item}>No notifications available.</li>}
          {notifications.map((item) => (
            <li
              key={item._id || item.id}
              style={{ ...itemStyle, opacity: item.read ? 0.6 : 1, backgroundColor: item.read ? '#e2e8f0' : '#f8fafc' }}
            >
              <div style={itemTitle}><FaBell /> {item.message}</div>
              <div style={itemSub}>{new Date(item.createdAt || item.updatedAt || Date.now()).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const pageContainer = { width: '100%', maxWidth: '1400px', margin: '0 auto' };
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' };
const pageTitle = { fontSize: '28px', color: '#0f172a' };
const refreshButton = { background: '#3b82f6', color: 'white', border: 'none', padding: '8px 10px', borderRadius: '8px', cursor: 'pointer' };
const markButton = { background: '#10b981', color: 'white', border: 'none', padding: '8px 10px', borderRadius: '8px', cursor: 'pointer' };
const errorStyle = { marginBottom: '10px', color: '#b91c1c', fontWeight: 600 };
const list = { listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '12px' };
const item = { padding: '10px', border: '1px solid #e2e8f0', borderRadius: '8px' };
const itemStyle = { padding: '14px', border: '1px solid #e2e8f0', borderRadius: '8px' };
const itemTitle = { fontWeight: 600, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' };
const itemSub = { fontSize: '12px', color: '#64748b' };

export default Notifications;
