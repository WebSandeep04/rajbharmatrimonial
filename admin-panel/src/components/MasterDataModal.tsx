import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import api from '../services/api';

interface MasterDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  entry: any | null;
  masterType: string;
  masterName: string;
}

const MasterDataModal: React.FC<MasterDataModalProps> = ({ isOpen, onClose, onSave, entry, masterType, masterName }) => {
  const [name, setName] = useState('');
  const [parentId, setParentId] = useState('');
  const [parentOptions, setParentOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (entry) {
      setName(entry.name);
      if (masterType === 'caste') setParentId(entry.religion_id || '');
      if (masterType === 'city') setParentId(entry.state_id || '');
    } else {
      setName('');
      setParentId('');
    }
    setError('');
  }, [entry, isOpen, masterType]);

  useEffect(() => {
    if (!isOpen) return;

    const fetchParents = async () => {
      try {
        if (masterType === 'caste') {
          const res = await api.get('/admin/masters/religion');
          setParentOptions(res.data);
        } else if (masterType === 'city') {
          const res = await api.get('/admin/masters/state');
          setParentOptions(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch parent options', err);
      }
    };

    if (masterType === 'caste' || masterType === 'city') {
      fetchParents();
    }
  }, [isOpen, masterType]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    if ((masterType === 'caste' || masterType === 'city') && !parentId) {
      setError('Please select a parent option');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data: any = { name };
      if (masterType === 'caste') data.religion_id = parentId;
      if (masterType === 'city') data.state_id = parentId;

      await onSave(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{entry ? `Edit ${masterName}` : `Add New ${masterName}`}</h2>
          <button className="btn-icon" onClick={onClose} disabled={loading}>
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-body">
          {error && (
            <div className="error-message mb-4" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: '8px' }}>
              {error}
            </div>
          )}

          {(masterType === 'caste' || masterType === 'city') && (
            <div className="form-group">
              <label>{masterType === 'caste' ? 'Religion' : 'State'}</label>
              <select 
                className="form-input" 
                value={parentId} 
                onChange={(e) => setParentId(e.target.value)}
                disabled={loading}
              >
                <option value="">Select {masterType === 'caste' ? 'Religion' : 'State'}</option>
                {parentOptions.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.name}</option>
                ))}
              </select>
            </div>
          )}

          <div className="form-group">
            <label>{masterName} Name</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder={`Enter ${masterName.toLowerCase()} name`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              autoFocus
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn" disabled={loading}>
              {loading ? <Loader2 size={18} className="animate-spin" /> : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MasterDataModal;
