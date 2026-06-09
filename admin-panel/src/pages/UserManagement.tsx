import React, { useState, useEffect } from 'react';
import { UserPlus, Edit2, Shield, ShieldOff, Loader2 } from 'lucide-react';
import api from '../services/api';
import UserModal from '../components/UserModal';

interface User {
  id: number;
  name: string;
  email: string;
  is_active: boolean;
  created_at: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenModal = (user: User | null = null) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleSaveUser = async (userData: any) => {
    if (selectedUser) {
      // Update
      await api.put(`/admin/users/${selectedUser.id}`, userData);
    } else {
      // Create
      await api.post('/admin/users', userData);
    }
    fetchUsers();
  };

  const handleToggleStatus = async (userId: number) => {
    try {
      await api.patch(`/admin/users/${userId}/status`);
      fetchUsers();
    } catch (err) {
      console.error('Failed to toggle status', err);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-secondary mt-1">Manage platform users and their access.</p>
        </div>
        <button className="btn" onClick={() => handleOpenModal()} style={{ width: 'auto', padding: '0.75rem 1.5rem' }}>
          <UserPlus size={18} style={{ marginRight: '0.5rem' }} /> Add User
        </button>
      </div>

      <div className="card table-container">
        {loading ? (
          <div className="flex justify-center items-center p-12">
            <Loader2 className="animate-spin text-accent-primary" size={32} />
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Joined</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="font-medium">{user.name}</div>
                  </td>
                  <td className="text-secondary">{user.email}</td>
                  <td>
                    <span className={`status-badge ${user.is_active ? 'status-active' : 'status-inactive'}`}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="text-secondary">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="text-right">
                    <div className="flex gap-2 justify-end">
                      <button 
                        className="btn-icon text-accent-primary" 
                        title="Edit User"
                        onClick={() => handleOpenModal(user)}
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        className={`btn-icon ${user.is_active ? 'text-danger' : 'text-success'}`} 
                        title={user.is_active ? "Deactivate User" : "Activate User"}
                        onClick={() => handleToggleStatus(user.id)}
                      >
                        {user.is_active ? <ShieldOff size={18} /> : <Shield size={18} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center p-8 text-secondary">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <UserModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveUser} 
        user={selectedUser} 
      />
    </div>
  );
};

export default UserManagement;
