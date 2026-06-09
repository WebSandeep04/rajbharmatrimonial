import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Edit2, Trash2, Loader2, Database } from 'lucide-react';
import MasterDataModal from '../components/MasterDataModal';
import type { AppDispatch, RootState } from '../store';

// Import all actions
import { fetchReligion, addReligion, updateReligion, deleteReligion } from '../store/slices/masters/religionSlice';
import { fetchCaste, addCaste, updateCaste, deleteCaste } from '../store/slices/masters/casteSlice';
import { fetchGotra, addGotra, updateGotra, deleteGotra } from '../store/slices/masters/gotraSlice';
import { fetchNakshatra, addNakshatra, updateNakshatra, deleteNakshatra } from '../store/slices/masters/nakshatraSlice';
import { fetchRashi, addRashi, updateRashi, deleteRashi } from '../store/slices/masters/rashiSlice';
import { fetchState, addState, updateState, deleteState } from '../store/slices/masters/stateSlice';
import { fetchCity, addCity, updateCity, deleteCity } from '../store/slices/masters/citySlice';
import { fetchHighestEducation, addHighestEducation, updateHighestEducation, deleteHighestEducation } from '../store/slices/masters/highestEducationSlice';
import { fetchProfession, addProfession, updateProfession, deleteProfession } from '../store/slices/masters/professionSlice';
import { fetchIncomeRange, addIncomeRange, updateIncomeRange, deleteIncomeRange } from '../store/slices/masters/incomeRangeSlice';
import { fetchBodyType, addBodyType, updateBodyType, deleteBodyType } from '../store/slices/masters/bodyTypeSlice';
import { fetchComplexion, addComplexion, updateComplexion, deleteComplexion } from '../store/slices/masters/complexionSlice';
import { fetchBloodGroup, addBloodGroup, updateBloodGroup, deleteBloodGroup } from '../store/slices/masters/bloodGroupSlice';
import { fetchDiet, addDiet, updateDiet, deleteDiet } from '../store/slices/masters/dietSlice';
import { fetchMaritalStatus, addMaritalStatus, updateMaritalStatus, deleteMaritalStatus } from '../store/slices/masters/maritalStatusSlice';
import { fetchFamilyType, addFamilyType, updateFamilyType, deleteFamilyType } from '../store/slices/masters/familyTypeSlice';
import { fetchProfileCreatedFor, addProfileCreatedFor, updateProfileCreatedFor, deleteProfileCreatedFor } from '../store/slices/masters/profileCreatedForSlice';

const masterActions: Record<string, { fetch: Function, add: Function, update: Function, delete: Function, stateKey: string }> = {
  religion: { fetch: fetchReligion, add: addReligion, update: updateReligion, delete: deleteReligion, stateKey: 'religion' },
  caste: { fetch: fetchCaste, add: addCaste, update: updateCaste, delete: deleteCaste, stateKey: 'caste' },
  gotra: { fetch: fetchGotra, add: addGotra, update: updateGotra, delete: deleteGotra, stateKey: 'gotra' },
  nakshatra: { fetch: fetchNakshatra, add: addNakshatra, update: updateNakshatra, delete: deleteNakshatra, stateKey: 'nakshatra' },
  rashi: { fetch: fetchRashi, add: addRashi, update: updateRashi, delete: deleteRashi, stateKey: 'rashi' },
  state: { fetch: fetchState, add: addState, update: updateState, delete: deleteState, stateKey: 'state' },
  city: { fetch: fetchCity, add: addCity, update: updateCity, delete: deleteCity, stateKey: 'city' },
  highest_education: { fetch: fetchHighestEducation, add: addHighestEducation, update: updateHighestEducation, delete: deleteHighestEducation, stateKey: 'highestEducation' },
  profession: { fetch: fetchProfession, add: addProfession, update: updateProfession, delete: deleteProfession, stateKey: 'profession' },
  income_range: { fetch: fetchIncomeRange, add: addIncomeRange, update: updateIncomeRange, delete: deleteIncomeRange, stateKey: 'incomeRange' },
  body_type: { fetch: fetchBodyType, add: addBodyType, update: updateBodyType, delete: deleteBodyType, stateKey: 'bodyType' },
  complexion: { fetch: fetchComplexion, add: addComplexion, update: updateComplexion, delete: deleteComplexion, stateKey: 'complexion' },
  blood_group: { fetch: fetchBloodGroup, add: addBloodGroup, update: updateBloodGroup, delete: deleteBloodGroup, stateKey: 'bloodGroup' },
  diet: { fetch: fetchDiet, add: addDiet, update: updateDiet, delete: deleteDiet, stateKey: 'diet' },
  marital_status: { fetch: fetchMaritalStatus, add: addMaritalStatus, update: updateMaritalStatus, delete: deleteMaritalStatus, stateKey: 'maritalStatus' },
  family_type: { fetch: fetchFamilyType, add: addFamilyType, update: updateFamilyType, delete: deleteFamilyType, stateKey: 'familyType' },
  profile_created_for: { fetch: fetchProfileCreatedFor, add: addProfileCreatedFor, update: updateProfileCreatedFor, delete: deleteProfileCreatedFor, stateKey: 'profileCreatedFor' },
};

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
  const dispatch = useDispatch<AppDispatch>();

  const [activeMaster, setActiveMaster] = useState(masterTypes[0].id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<Record<string, unknown> | null>(null);

  const activeActions = masterActions[activeMaster];

  const currentState = useSelector((state: RootState) => {
    return (state as Record<string, any>)[activeActions.stateKey] || { data: [], loading: false };
  });

  const { data, loading } = currentState;

  useEffect(() => {
    dispatch(activeActions.fetch());
  }, [activeMaster, dispatch, activeActions]);

  const handleOpenModal = (entry: Record<string, unknown> | null = null) => {
    setSelectedEntry(entry);
    setIsModalOpen(true);
  };

  const handleSave = async (formData: Record<string, unknown>) => {
    if (selectedEntry) {
      await dispatch(activeActions.update({ id: selectedEntry.id, data: formData })).unwrap();
    } else {
      await dispatch(activeActions.add(formData)).unwrap();
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      await dispatch(activeActions.delete(id));
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
              className={`text-left px-4 py-2 rounded-lg transition-colors ${activeMaster === master.id
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
