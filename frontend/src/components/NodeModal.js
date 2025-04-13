import React from 'react';
import './NodeModal.css';

const NodeModal = ({ node, onClose, onSave }) => {
  const [formData, setFormData] = React.useState({
    subject: node?.data?.subject || '',
    body: node?.data?.body || '',
    duration: node?.data?.duration || '1',
    type: node?.data?.type || 'Manual Input',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const renderFields = () => {
    switch (node?.type) {
      case 'coldEmail':
        return (
          <>
            <div className="form-group">
              <label>Subject:</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Enter email subject"
              />
            </div>
            <div className="form-group">
              <label>Body:</label>
              <textarea
                value={formData.body}
                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                placeholder="Enter email body"
                rows={5}
              />
            </div>
          </>
        );
      case 'wait':
        return (
          <div className="form-group">
            <label>Duration (hours):</label>
            <input
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              min="1"
            />
          </div>
        );
      case 'leadSource':
        return (
          <div className="form-group">
            <label>Source Type:</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="Manual Input">Manual Input</option>
              <option value="CSV Upload">CSV Upload</option>
              <option value="API Integration">API Integration</option>
              <option value="Form Submission">Form Submission</option>
            </select>
          </div>
        );
      default:
        return null;
    }
  };

  if (!node) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Edit {node.type === 'coldEmail' ? 'Cold Email' : 
              node.type === 'wait' ? 'Wait Duration' : 'Lead Source'}</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          {renderFields()}
          <div className="modal-footer">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="save-button">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NodeModal; 