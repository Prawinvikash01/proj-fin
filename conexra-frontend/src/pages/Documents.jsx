import { useState, useEffect } from 'react';
import { FaFolderOpen, FaUpload, FaTrash, FaSyncAlt } from 'react-icons/fa';
import { getDocuments, uploadDocument, deleteDocument } from '../services/documentService';

function Documents() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newName, setNewName] = useState('');
  const [newUrl, setNewUrl] = useState('');

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

  useEffect(() => {
    loadDocs();
  }, []);

  const onUpload = async () => {
    if (!newName || !newUrl) {
      setError('Both document name and URL are required');
      return;
    }

    try {
      const created = await uploadDocument({ name: newName, url: newUrl });
      setDocs((p) => [created, ...p]);
      setNewName('');
      setNewUrl('');
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
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Document name"
          style={inputStyle}
        />
        <input
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          placeholder="Document URL"
          style={inputStyle}
        />
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
                <th style={th}>Uploaded</th>
                <th style={th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(docs.length === 0) ? (
                <tr>
                  <td style={td} colSpan={4}>No documents found.</td>
                </tr>
              ) : docs.map((doc) => (
                <tr key={doc._id || doc.id}>
                  <td style={td}>{doc.name}</td>
                  <td style={td}><a target="_blank" rel="noreferrer" href={doc.url}>{doc.url}</a></td>
                  <td style={td}>{new Date(doc.uploadedAt || doc.createdAt || Date.now()).toLocaleString()}</td>
                  <td style={td}>
                    <button onClick={() => onDelete(doc._id || doc.id)} style={actionBtn}> <FaTrash /> </button>
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

const pageContainer = { width: '100%', maxWidth: '1400px', margin: '0 auto' };
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' };
const pageTitle = { fontSize: '28px', color: '#0f172a', margin: 0 };
const refreshButton = { border: 'none', background: '#3b82f6', color: 'white', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer' };
const errorStyle = { marginBottom: '16px', color: '#b91c1c', fontWeight: 600 };
const addRow = { display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' };
const inputStyle = { padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', minWidth: '160px' };
const addButton = { background: '#10b981', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer' };
const tableContainer = { background: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', overflowX: 'auto' };
const table = { width: '100%', borderCollapse: 'collapse' };
const th = { textAlign: 'left', padding: '12px', borderBottom: '2px solid #e2e8f0', background: '#f8fafc' };
const td = { padding: '12px', borderBottom: '1px solid #e2e8f0' };
const actionBtn = { border: 'none', background: '#ef4444', color: 'white', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer' };

export default Documents;
