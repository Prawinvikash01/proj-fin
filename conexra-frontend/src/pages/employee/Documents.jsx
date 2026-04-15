import { useState, useEffect } from 'react';
import { FaFolderOpen, FaSyncAlt } from 'react-icons/fa';
import { getDocuments } from '../../services/documentService';

function EmployeeDocuments() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadDocuments = async () => {
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
    loadDocuments();
  }, []);

  return (
    <div style={pageContainer}>
      <div style={headerStyle}>
        <div style={titleRow}>
          <FaFolderOpen style={iconStyle} />
          <div>
            <h1 style={pageTitle}>My Documents</h1>
            <p style={subtitle}>Access the documents assigned to your profile.</p>
          </div>
        </div>
        <button onClick={loadDocuments} style={refreshButton}>
          <FaSyncAlt /> Refresh
        </button>
      </div>

      {error && <div style={errorStyle}>{error}</div>}

      {loading ? (
        <div>Loading documents...</div>
      ) : (
        <div style={tableContainer}>
          <table style={table}>
            <thead>
              <tr>
                <th style={th}>Name</th>
                <th style={th}>Link</th>
                <th style={th}>Category</th>
                <th style={th}>Uploaded By</th>
                <th style={th}>Uploaded At</th>
              </tr>
            </thead>
            <tbody>
              {docs.length === 0 ? (
                <tr>
                  <td style={td} colSpan={5}>No documents available.</td>
                </tr>
              ) : (
                docs.map((doc) => (
                  <tr key={doc._id || doc.id}>
                    <td style={td}>{doc.name}</td>
                    <td style={td}>
                      <a target="_blank" rel="noreferrer" href={doc.url} style={linkStyle}>
                        View
                      </a>
                    </td>
                    <td style={td}>{doc.category || 'Other'}</td>
                    <td style={td}>{doc.uploadedBy?.name || doc.uploadedBy?.email || 'Unknown'}</td>
                    <td style={td}>{new Date(doc.uploadedAt || Date.now()).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const pageContainer = { width: '100%', maxWidth: '1200px', margin: '0 auto', color: '#000' };
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', color: '#000' };
const titleRow = { display: 'flex', alignItems: 'center', gap: '12px' };
const iconStyle = { color: '#2563eb', fontSize: '28px' };
const pageTitle = { fontSize: '28px', margin: 0, color: '#000' };
const subtitle = { margin: '4px 0 0', color: '#4b5563' };
const refreshButton = { border: 'none', background: '#3b82f6', color: 'white', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer' };
const errorStyle = { marginBottom: '16px', color: '#b91c1c', fontWeight: 600 };
const tableContainer = { background: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', overflowX: 'auto', color: '#000' };
const table = { width: '100%', borderCollapse: 'collapse', color: '#000' };
const th = { textAlign: 'left', padding: '14px', borderBottom: '2px solid #e5e7eb', background: '#f8fafc', color: '#000' };
const td = { padding: '14px', borderBottom: '1px solid #e5e7eb', color: '#000' };
const linkStyle = { color: '#1d4ed8', textDecoration: 'none' };

export default EmployeeDocuments;
