import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, FlatList, Image, TouchableOpacity, 
  ActivityIndicator, Modal, ScrollView 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CheckCircle2, MapPin, Briefcase, GraduationCap, Filter, X } from 'lucide-react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import api from '../services/api';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

import TopAppBar from '../components/home/TopAppBar';

const SearchScreen = () => {
  const navigation = useNavigation<any>();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  
  // Modal & Master Data State
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [masterDataOptions, setMasterDataOptions] = useState<Record<string, any[]>>({});
  
  // Filter States
  const [filters, setFilters] = useState<any>({
    religion_id: '', caste_id: '', gotra_id: '', nakshatra_id: '', rashi_id: '',
    state_id: '', city_id: '', marital_status_id: '', profile_created_for_id: '',
    highest_education_id: '', profession_id: '', income_range_id: '',
    body_type_id: '', complexion_id: '', blood_group_id: '',
    diet_id: '', family_type_id: '', smoking: '', drinking: '', manglik_status: ''
  });

  useEffect(() => {
    fetchMasterData();
    fetchMatches();
  }, []);

  const fetchMasterData = async () => {
    try {
      const response = await api.get('/master-data');
      setMasterDataOptions(response.data);
    } catch (err) {
      console.error('Failed to load filter options', err);
    }
  };

  const fetchMatches = async (currentFilters = filters) => {
    try {
      setSearching(true);
      const response = await api.post('/matches/search', currentFilters);
      setProfiles(response.data);
    } catch (err) {
      console.error('Failed to search matches', err);
    } finally {
      setLoading(false);
      setSearching(false);
    }
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev: any) => ({ ...prev, [field]: value }));
  };

  const applyFilters = () => {
    setFilterModalVisible(false);
    fetchMatches(filters);
  };

  const clearFilters = () => {
    const emptyFilters = {
      religion_id: '', caste_id: '', gotra_id: '', nakshatra_id: '', rashi_id: '',
      state_id: '', city_id: '', marital_status_id: '', profile_created_for_id: '',
      highest_education_id: '', profession_id: '', income_range_id: '',
      body_type_id: '', complexion_id: '', blood_group_id: '',
      diet_id: '', family_type_id: '', smoking: '', drinking: '', manglik_status: ''
    };
    setFilters(emptyFilters);
    setFilterModalVisible(false);
    fetchMatches(emptyFilters);
  };

  const renderFilterPicker = (field: keyof typeof filters, label: string, masterKey: string) => {
    let options = masterDataOptions[masterKey] || [];
    
    // Dependent dropdown for city
    if (masterKey === 'city' && filters.state_id) {
      options = options.filter((opt: any) => String(opt.state_id) === String(filters.state_id));
    } else if (masterKey === 'city') {
      options = [];
    }

    return (
      <View style={styles.inputGroup} key={field}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={filters[field]}
            onValueChange={(val) => handleFilterChange(field, val)}
          >
            <Picker.Item label={`Any ${label}`} value="" />
            {options.map((opt: any) => (
              <Picker.Item key={opt.id} label={opt.name} value={opt.id} />
            ))}
          </Picker>
        </View>
      </View>
    );
  };

  const renderProfile = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <View style={styles.matchBadge}>
          <Text style={styles.matchText}>{item.matchPercentage}% Match</Text>
        </View>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
          {item.verified && <CheckCircle2 size={16} color={colors.secondary} style={styles.verifiedIcon} />}
        </View>
        <Text style={styles.ageText}>{item.age} yrs • {item.city}</Text>

        <View style={styles.detailRow}>
          <Briefcase size={14} color={colors.textLight} />
          <Text style={styles.detailText} numberOfLines={1}>{item.profession}</Text>
        </View>

        <TouchableOpacity 
          style={styles.viewButton}
          onPress={() => navigation.navigate('UserProfile', { userId: item.id })}
        >
          <Text style={styles.viewButtonText}>View Full Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TopAppBar />
      <View style={styles.header}>
        <Text style={typography.h2}>Explore Matches</Text>
        <TouchableOpacity style={styles.filterButtonIcon} onPress={() => setFilterModalVisible(true)}>
          <Filter size={24} color={colors.surface} />
        </TouchableOpacity>
      </View>

      {loading || searching ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={{ marginTop: 12, color: colors.textLight, fontSize: 16 }}>Finding your perfect match...</Text>
        </View>
      ) : profiles.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={typography.h2}>No matches found</Text>
          <Text style={{ color: colors.textLight, marginTop: 8, marginBottom: 24, fontSize: 16 }}>Try adjusting your filters.</Text>
          <TouchableOpacity style={styles.clearFilterButtonBtn} onPress={clearFilters}>
            <Text style={styles.clearFilterText}>Clear Filters</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={profiles}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderProfile}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          columnWrapperStyle={styles.row}
        />
      )}

      {/* Filter Modal */}
      <Modal visible={filterModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.grabHandle} />
            <View style={styles.modalHeader}>
              <Text style={typography.h2}>Filters</Text>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                <X size={28} color={colors.textDark} />
              </TouchableOpacity>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.sectionHeader}>Religious Filters</Text>
              {renderFilterPicker('religion_id', 'Religion', 'religion')}
              {renderFilterPicker('caste_id', 'Caste', 'caste')}
              {renderFilterPicker('gotra_id', 'Gotra', 'gotra')}
              {renderFilterPicker('nakshatra_id', 'Nakshatra', 'nakshatra')}
              {renderFilterPicker('rashi_id', 'Rashi', 'rashi')}

              <Text style={styles.sectionHeader}>Basic Filters</Text>
              {renderFilterPicker('profile_created_for_id', 'Profile For', 'profile_created_for')}
              {renderFilterPicker('marital_status_id', 'Marital Status', 'marital_status')}
              {renderFilterPicker('highest_education_id', 'Education', 'highest_education')}
              {renderFilterPicker('profession_id', 'Profession', 'profession')}
              {renderFilterPicker('income_range_id', 'Income Range', 'income_range')}
              
              <Text style={styles.sectionHeader}>Location Filters</Text>
              {renderFilterPicker('state_id', 'State', 'state')}
              {renderFilterPicker('city_id', 'City', 'city')}

              <Text style={styles.sectionHeader}>Physical Attributes</Text>
              {renderFilterPicker('body_type_id', 'Body Type', 'body_type')}
              {renderFilterPicker('complexion_id', 'Complexion', 'complexion')}
              {renderFilterPicker('blood_group_id', 'Blood Group', 'blood_group')}

              <Text style={styles.sectionHeader}>Lifestyle Filters</Text>
              {renderFilterPicker('diet_id', 'Diet', 'diet')}
              {renderFilterPicker('family_type_id', 'Family Type', 'family_type')}
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Smoking</Text>
                <View style={styles.pickerContainer}>
                  <Picker selectedValue={filters.smoking} onValueChange={(val) => handleFilterChange('smoking', val)}>
                    <Picker.Item label="Any" value="" />
                    <Picker.Item label="Yes" value="yes" />
                    <Picker.Item label="No" value="no" />
                  </Picker>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Drinking</Text>
                <View style={styles.pickerContainer}>
                  <Picker selectedValue={filters.drinking} onValueChange={(val) => handleFilterChange('drinking', val)}>
                    <Picker.Item label="Any" value="" />
                    <Picker.Item label="Yes" value="yes" />
                    <Picker.Item label="No" value="no" />
                  </Picker>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Manglik Status</Text>
                <View style={styles.pickerContainer}>
                  <Picker selectedValue={filters.manglik_status} onValueChange={(val) => handleFilterChange('manglik_status', val)}>
                    <Picker.Item label="Any" value="" />
                    <Picker.Item label="Yes" value="yes" />
                    <Picker.Item label="No" value="no" />
                  </Picker>
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.clearFilterButtonBtn} onPress={clearFilters}>
                <Text style={styles.clearFilterText}>Clear</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.applyFilterButton} onPress={applyFilters}>
                <Text style={styles.applyFilterText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'transparent',
    marginBottom: 8,
  },
  filterButtonIcon: {
    padding: 10,
    backgroundColor: colors.primary,
    borderRadius: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  row: {
    justifyContent: 'space-between',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  card: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: 20,
    marginBottom: 20,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 160,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  matchBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  matchText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 10,
  },
  infoContainer: {
    padding: 12,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  name: {
    ...typography.h3,
    fontSize: 15,
    flex: 1,
  },
  verifiedIcon: {
    marginLeft: 4,
  },
  ageText: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 12,
    color: colors.textLight,
    marginLeft: 6,
    flex: 1,
  },
  viewButton: {
    backgroundColor: colors.primaryLight,
    paddingVertical: 8,
    borderRadius: 16,
    alignItems: 'center',
  },
  viewButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 16,
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  grabHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionHeader: {
    ...typography.h3,
    color: colors.primary,
    marginTop: 20,
    marginBottom: 16,
    paddingBottom: 8,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 10,
  },
  pickerContainer: {
    backgroundColor: colors.background,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalFooter: {
    flexDirection: 'row',
    marginTop: 24,
    justifyContent: 'space-between',
    gap: 16,
  },
  clearFilterButtonBtn: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: colors.background,
  },
  clearFilterText: {
    color: colors.textDark,
    fontWeight: 'bold',
    fontSize: 16,
  },
  applyFilterButton: {
    flex: 2,
    backgroundColor: colors.primary,
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  applyFilterText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default SearchScreen;
