import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  is_active: boolean;
}

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: any) => Promise<void>;
  user: User | null;
}

const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, onSave, user }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPassword('');
    } else {
      setName('');
      setEmail('');
      setPassword('');
    }
    setError('');
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const data: any = { name, email };
      if (password) {
        data.password = password;
      }
      
      await onSave(data);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{user ? 'Edit User' : 'Add New User'}</h2>
          <button className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">
              Password {user && <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>(Leave blank to keep current)</span>}
            </label>
            <input
              type="password"
              id="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={!user}
              minLength={8}
            />
          </div>

          {error && (
            <div className="error-message" style={{ marginBottom: '1.5rem' }}>
              <span>{error}</span>
            </div>
          )}

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
