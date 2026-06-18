import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import api from '../services/api';

interface User {
  id: number;
  name: string;
  email: string;
  is_active: boolean;
  [key: string]: any;
}

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: any) => Promise<void>;
  user: User | null;
}

const MASTER_ENDPOINTS = [
  'religion', 'caste', 'gotra', 'nakshatra', 'rashi', 'state', 'city',
  'highest_education', 'profession', 'income_range', 'body_type',
  'complexion', 'blood_group', 'diet', 'marital_status', 'family_type', 'profile_created_for'
];

const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, onSave, user }) => {
  const [formData, setFormData] = useState<any>({
    name: '', email: '', password: '',
    smoking: false, drinking: false, manglik_status: false, verification: false,
    no_of_brothers: '', no_of_sisters: '', height: '', weight: '',
    mother_occupation: '', father_occupation: '', mother_name: '', father_name: '', bio: '',
    religion_id: '', caste_id: '', gotra_id: '', nakshatra_id: '', rashi_id: '',
    state_id: '', city_id: '', highest_education_id: '', profession_id: '', income_range_id: '',
    body_type_id: '', complexion_id: '', blood_group_id: '', diet_id: '', marital_status_id: '',
    family_type_id: '', profile_created_for_id: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [masterDataOptions, setMasterDataOptions] = useState<Record<string, any[]>>({});
  const [loadingMasterData, setLoadingMasterData] = useState(false);

  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        setLoadingMasterData(true);
        const response = await api.get(`/master-data`);
        setMasterDataOptions(response.data);
      } catch (err) {
        console.error('Failed to fetch master data options', err);
      } finally {
        setLoadingMasterData(false);
      }
    };
    
    if (isOpen && Object.keys(masterDataOptions).length === 0) {
      fetchMasterData();
    }
  }, [isOpen]);

  useEffect(() => {
    let active = true;
    if (active) {
      if (user) {
        setFormData({
          name: user.name || '',
          email: user.email || '',
          password: '',
          smoking: user.smoking || false,
          drinking: user.drinking || false,
          manglik_status: user.manglik_status || false,
          verification: user.verification || false,
          no_of_brothers: user.no_of_brothers || '',
          no_of_sisters: user.no_of_sisters || '',
          height: user.height || '',
          weight: user.weight || '',
          mother_occupation: user.mother_occupation || '',
          father_occupation: user.father_occupation || '',
          mother_name: user.mother_name || '',
          father_name: user.father_name || '',
          bio: user.bio || '',
          ...MASTER_ENDPOINTS.reduce((acc, endpoint) => ({
            ...acc,
            [`${endpoint}_id`]: user[`${endpoint}_id`] || ''
          }), {})
        });
      } else {
        setFormData({
          name: '', email: '', password: '',
          smoking: false, drinking: false, manglik_status: false, verification: false,
          no_of_brothers: '', no_of_sisters: '', height: '', weight: '',
          mother_occupation: '', father_occupation: '', mother_name: '', father_name: '', bio: '',
          ...MASTER_ENDPOINTS.reduce((acc, endpoint) => ({
            ...acc,
            [`${endpoint}_id`]: ''
          }), {})
        });
      }
      setError('');
    }
    return () => { active = false; };
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev: any) => ({ ...prev, [id]: checked }));
    } else {
      setFormData((prev: any) => ({ ...prev, [id]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const data = { ...formData };
      if (!data.password) {
        delete data.password;
      }
      await onSave(data);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const renderDropdown = (field: string, label: string) => {
    let options = masterDataOptions[field] || [];
    
    if (field === 'city' && formData.state_id) {
      // Cast both to String to ensure strict equality check passes if one is a number and other is string
      options = options.filter((opt: any) => String(opt.state_id) === String(formData.state_id));
    } else if (field === 'city') {
      options = [];
    }

    return (
      <div className="form-group" key={field}>
        <label htmlFor={`${field}_id`}>{label}</label>
        <select 
          id={`${field}_id`} 
          className="form-input" 
          value={formData[`${field}_id`]} 
          onChange={handleChange}
          required
        >
          <option value="">Select {label}</option>
          {options.map((option: any) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
      </div>
    );
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="modal-header">
          <h2>{user ? 'Edit User' : 'Add New User'}</h2>
          <button className="btn-icon" onClick={onClose} type="button">
            <X size={20} />
          </button>
        </div>
        
        {loadingMasterData ? (
          <div className="modal-body flex justify-center items-center py-12">
            <Loader2 className="animate-spin text-accent-primary" size={32} />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="modal-body">
            <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>Basic Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input type="text" id="name" className="form-input" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input type="email" id="email" className="form-input" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password {user && <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>(Leave blank to keep current)</span>}</label>
                <input type="password" id="password" className="form-input" value={formData.password} onChange={handleChange} required={!user} minLength={8} />
              </div>
            </div>

            <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>Master Data Relationships</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              {renderDropdown('religion', 'Religion')}
              {renderDropdown('caste', 'Caste')}
              {renderDropdown('gotra', 'Gotra')}
              {renderDropdown('nakshatra', 'Nakshatra')}
              {renderDropdown('rashi', 'Rashi')}
              {renderDropdown('highest_education', 'Highest Education')}
              {renderDropdown('profession', 'Profession')}
              {renderDropdown('income_range', 'Income Range')}
              {renderDropdown('body_type', 'Body Type')}
              {renderDropdown('complexion', 'Complexion')}
              {renderDropdown('blood_group', 'Blood Group')}
              {renderDropdown('diet', 'Diet')}
              {renderDropdown('marital_status', 'Marital Status')}
              {renderDropdown('family_type', 'Family Type')}
              {renderDropdown('profile_created_for', 'Profile Created For')}
              {renderDropdown('state', 'State')}
              {renderDropdown('city', 'City')}
            </div>

            <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>Personal & Family</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div className="form-group">
                <label htmlFor="height">Height</label>
                <input type="text" id="height" className="form-input" value={formData.height} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="weight">Weight</label>
                <input type="text" id="weight" className="form-input" value={formData.weight} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="no_of_brothers">No of Brothers</label>
                <input type="number" id="no_of_brothers" className="form-input" value={formData.no_of_brothers} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="no_of_sisters">No of Sisters</label>
                <input type="number" id="no_of_sisters" className="form-input" value={formData.no_of_sisters} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="mother_name">Mother Name</label>
                <input type="text" id="mother_name" className="form-input" value={formData.mother_name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="father_name">Father Name</label>
                <input type="text" id="father_name" className="form-input" value={formData.father_name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="mother_occupation">Mother Occupation</label>
                <input type="text" id="mother_occupation" className="form-input" value={formData.mother_occupation} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="father_occupation">Father Occupation</label>
                <input type="text" id="father_occupation" className="form-input" value={formData.father_occupation} onChange={handleChange} required />
              </div>
            </div>

            <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>Lifestyle & Status</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div className="form-group" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <input type="checkbox" id="smoking" checked={formData.smoking} onChange={handleChange} />
                <label htmlFor="smoking" style={{ margin: 0 }}>Smoking</label>
              </div>
              <div className="form-group" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <input type="checkbox" id="drinking" checked={formData.drinking} onChange={handleChange} />
                <label htmlFor="drinking" style={{ margin: 0 }}>Drinking</label>
              </div>
              <div className="form-group" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <input type="checkbox" id="manglik_status" checked={formData.manglik_status} onChange={handleChange} />
                <label htmlFor="manglik_status" style={{ margin: 0 }}>Manglik Status</label>
              </div>
              <div className="form-group" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <input type="checkbox" id="verification" checked={formData.verification} onChange={handleChange} />
                <label htmlFor="verification" style={{ margin: 0 }}>Verification</label>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="bio">Bio</label>
              <textarea id="bio" className="form-input" value={formData.bio} onChange={handleChange} rows={3} required />
            </div>

            {error && (
              <div className="error-message" style={{ marginBottom: '1.5rem', marginTop: '1rem' }}>
                <span>{error}</span>
              </div>
            )}

            <div className="modal-actions" style={{ marginTop: '1.5rem' }}>
              <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
                Cancel
              </button>
              <button type="submit" className="btn" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" size={20} /> : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UserModal;
