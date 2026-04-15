import { useState, useEffect } from 'react';
import { FaFolderOpen, FaUpload, FaTrash, FaSyncAlt } from 'react-icons/fa';
import { getDocuments, uploadDocument, deleteDocument } from '../services/documentService';
import { getEmployees } from '../services/employeeService';

function Documents() {
  const [docs, setDocs] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newDoc, setNewDoc] = useState({ employeeId: '', name: '', url: '', category: 'Other' });

  const loadDocs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDocuments();
      setDocs(data);
    } catch (err) {
      setError(err?.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadEmployees = async () => {
    try {
      const data = await getEmployees();
      setEmployees(data);
    } catch (err) {
      console.error('Failed to load employees', err);
    }
  };

  useEffect(() => {
    loadDocs();
    loadEmployees();
  }, []);

  const onUpload = async () => {
    if (!newDoc.name || !newDoc.url) {
      setError('Both document name and URL are required');
      return;
    }

    try {
      const payload = {
        name: newDoc.name,
        url: newDoc.url,
        category: newDoc.category
      };
      if (newDoc.employeeId) {
        payload.employeeId = newDoc.employeeId;
      }

      const created = await uploadDocument(payload);
      setDocs((p) => [created, ...p]);
      setNewDoc({ employeeId: '', name: '', url: '', category: 'Other' });
      setError(null);
    } catch (err) {
      setError(err?.response?.data?.error || err.message);
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete document?')) return;

    try {
      await deleteDocument(id);
      setDocs((p) => p.filter((doc) => doc._id !== id && doc.id !== id));
    } catch (err) {
      setError(err?.response?.data?.error || err.message);
    }
  };

  return (
    <div style={pageContainer}>
      <div style={headerStyle}>
        <h1 style={pageTitle}>Documents</h1>
        <button onClick={loadDocs} style={refreshButton}>
          <FaSyncAlt /> Refresh
        </button>
      </div>

      {error && <div style={errorStyle}>{error}</div>}

      <div style={addRow}>
        <select
          value={newDoc.employeeId}
          onChange={(e) => setNewDoc((doc) => ({ ...doc, employeeId: e.target.value }))}
          style={inputStyle}
        >
          <option value="">All employees</option>
          {employees.map((emp) => (
            <option key={emp._id || emp.id} value={emp._id || emp.id}>
              {emp.user?.name || emp.user?.email}
            </option>
          ))}
        </select>
        <input
          value={newDoc.name}
          onChange={(e) => setNewDoc((doc) => ({ ...doc, name: e.target.value }))}
          placeholder="Document name"
          style={inputStyle}
        />
        <input
          value={newDoc.url}
          onChange={(e) => setNewDoc((doc) => ({ ...doc, url: e.target.value }))}
          placeholder="Document URL"
          style={inputStyle}
        />
        <select
          value={newDoc.category}
          onChange={(e) => setNewDoc((doc) => ({ ...doc, category: e.target.value }))}
          style={inputStyle}
        >
          <option value="Other">Other</option>
          <option value="HR">HR</option>
          <option value="Legal">Legal</option>
        </select>
        <button onClick={onUpload} style={addButton}>
          <FaUpload /> Upload
        </button>
      </div>

      {loading ? (
        <div>Loading documents...</div>
      ) : (
        <div style={tableContainer}>
          <table style={table}>
            <thead>
              <tr>
                <th style={th}>Name</th>
                <th style={th}>Link</th>
                <th style={th}>Employee</th>
                <th style={th}>Category</th>
                <th style={th}>Uploaded By</th>
                <th style={th}>Uploaded At</th>
                <th style={th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(docs.length === 0) ? (
                <tr>
                  <td style={td} colSpan={7}>No documents found.</td>
                </tr>
              ) : docs.map((doc) => (
                <tr key={doc._id || doc.id}>
                  <td style={td}>{doc.name}</td>
                  <td style={td}>
                    <a target="_blank" rel="noreferrer" href={doc.url}>{doc.url}</a>
                  </td>
                  <td style={td}>{doc.employee?.user?.name || 'All employees'}</td>
                  <td style={td}>{doc.category || 'Other'}</td>
                  <td style={td}>{doc.uploadedBy?.name || 'Unknown'}</td>
                  <td style={td}>{new Date(doc.uploadedAt || Date.now()).toLocaleString()}</td>
                  <td style={td}>
                    <button onClick={() => onDelete(doc._id || doc.id)} style={actionBtn}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const pageContainer = { width: '100%', maxWidth: '1400px', margin: '0 auto', color: '#000' };
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', color: '#000' };
const pageTitle = { fontSize: '28px', color: '#000', margin: 0 };
const refreshButton = { border: 'none', background: '#3b82f6', color: 'white', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer' };
const errorStyle = { marginBottom: '16px', color: '#b91c1c', fontWeight: 600 };
const addRow = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', flexWrap: 'wrap', marginBottom: '16px', color: '#000' };
const inputStyle = { padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', width: '100%', color: '#6b7280' };
const addButton = { background: '#10b981', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer' };
const tableContainer = { background: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', overflowX: 'auto', color: '#000' };
const table = { width: '100%', borderCollapse: 'collapse', color: '#000' };
const th = { textAlign: 'left', padding: '12px', borderBottom: '2px solid #e2e8f0', background: '#f8fafc', color: '#000' };
const td = { padding: '12px', borderBottom: '1px solid #e2e8f0', color: '#000' };
const actionBtn = { border: 'none', background: '#ef4444', color: 'white', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer' };

export default Documents;
