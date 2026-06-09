import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Loader2, Database } from 'lucide-react';
import api from '../services/api';
import MasterDataModal from '../components/MasterDataModal';

const masterTypes = [
  { id: 'religion', name: 'Religion' },
  { id: 'caste', name: 'Caste' },
  { id: 'gotra', name: 'Gotra' },
  { id: 'nakshatra', name: 'Nakshatra' },
  { id: 'rashi', name: 'Rashi' },
  { id: 'state', name: 'State' },
  { id: 'city', name: 'City' },
  { id: 'highest_education', name: 'Highest Education' },
  { id: 'profession', name: 'Profession' },
  { id: 'income_range', name: 'Income Range' },
  { id: 'body_type', name: 'Body Type' },
  { id: 'complexion', name: 'Complexion' },
  { id: 'blood_group', name: 'Blood Group' },
  { id: 'diet', name: 'Diet' },
  { id: 'marital_status', name: 'Marital Status' },
  { id: 'family_type', name: 'Family Type' },
  { id: 'profile_created_for', name: 'Profile Created For' },
];

const MasterDataManagement: React.FC = () => {
  const [activeMaster, setActiveMaster] = useState(masterTypes[0].id);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<any>(null);

  const fetchMasterData = async (type: string) => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/masters/${type}`);
      setData(response.data);
    } catch (err) {
      console.error('Failed to fetch master data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMasterData(activeMaster);
  }, [activeMaster]);

  const handleOpenModal = (entry: any = null) => {
    setSelectedEntry(entry);
    setIsModalOpen(true);
  };

  const handleSave = async (formData: any) => {
    try {
      if (selectedEntry) {
        await api.put(`/admin/masters/${activeMaster}/${selectedEntry.id}`, formData);
      } else {
        await api.post(`/admin/masters/${activeMaster}`, formData);
      }
      fetchMasterData(activeMaster);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to save master data', err);
      throw err;
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await api.delete(`/admin/masters/${activeMaster}/${id}`);
        fetchMasterData(activeMaster);
      } catch (err) {
        console.error('Failed to delete master data', err);
      }
    }
  };

  const getActiveMasterName = () => {
    return masterTypes.find(m => m.id === activeMaster)?.name || 'Master Data';
  };

  return (
    <div className="page-container flex gap-6">
      {/* Sidebar for Masters */}
      <div className="card" style={{ width: '250px', padding: '1rem', height: 'fit-content' }}>
        <h3 className="font-bold mb-4 flex items-center gap-2 text-secondary">
          <Database size={18} /> Masters List
        </h3>
        <div className="flex flex-col gap-1">
          {masterTypes.map(master => (
            <button
              key={master.id}
              className={`text-left px-4 py-2 rounded-lg transition-colors ${
                activeMaster === master.id 
                  ? 'bg-accent-primary text-white font-medium' 
                  : 'text-secondary hover:bg-bg-primary hover:text-white'
              }`}
              onClick={() => setActiveMaster(master.id)}
            >
              {master.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1">
        <div className="page-header flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">{getActiveMasterName()} Data</h1>
            <p className="text-secondary mt-1">Manage entries for {getActiveMasterName().toLowerCase()}.</p>
          </div>
          <button className="btn" onClick={() => handleOpenModal()} style={{ width: 'auto', padding: '0.75rem 1.5rem' }}>
            <Plus size={18} style={{ marginRight: '0.5rem' }} /> Add Entry
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
                  <th style={{ width: '80px' }}>ID</th>
                  <th>Name</th>
                  {activeMaster === 'caste' && <th>Religion</th>}
                  {activeMaster === 'city' && <th>State</th>}
                  <th>Added On</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.id}>
                    <td className="text-secondary">#{item.id}</td>
                    <td className="font-medium">{item.name}</td>
                    {activeMaster === 'caste' && <td>{item.religion?.name}</td>}
                    {activeMaster === 'city' && <td>{item.state?.name}</td>}
                    <td className="text-secondary">
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>
                    <td className="text-right">
                      <div className="flex gap-2 justify-end">
                        <button 
                          className="btn-icon text-accent-primary" 
                          title="Edit"
                          onClick={() => handleOpenModal(item)}
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          className="btn-icon text-danger" 
                          title="Delete"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {data.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center p-8 text-secondary">
                      No entries found for {getActiveMasterName()}.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {isModalOpen && (
        <MasterDataModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          entry={selectedEntry}
          masterType={activeMaster}
          masterName={getActiveMasterName()}
        />
      )}
    </div>
  );
};

export default MasterDataManagement;
