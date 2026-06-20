import React, { useState, useEffect } from 'react';
import { 
  View, Text, FlatList, Image, TouchableOpacity, 
  ActivityIndicator, Modal, ScrollView 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CheckCircle2, MapPin, Briefcase, GraduationCap, Filter, X } from 'lucide-react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { styles } from '../styles/SearchScreenStyles';
import TopAppBar from '../components/home/TopAppBar';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { 
  fetchSearchMasterData, 
  performSearch, 
  setFilters, 
  clearFilters as clearSearchFilters 
} from '../store/slices/searchSlice';

const SearchScreen = () => {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  
  const { 
    profiles, 
    searching, 
    loadingMasterData, 
    masterDataOptions, 
    filters 
  } = useAppSelector((state) => state.search);

  // Keep modal visibility as local state
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  useEffect(() => {
    dispatch(fetchSearchMasterData());
    dispatch(performSearch(filters));
  }, [dispatch]);

  const handleFilterChange = (field: string, value: string) => {
    dispatch(setFilters({ [field]: value }));
  };

  const applyFilters = () => {
    setFilterModalVisible(false);
    dispatch(performSearch(filters));
  };

  const clearFilters = () => {
    dispatch(clearSearchFilters());
    setFilterModalVisible(false);
    
    // We need to wait for the state to update, or pass the empty object directly
    const emptyFilters = {
      religion_id: '', caste_id: '', gotra_id: '', nakshatra_id: '', rashi_id: '',
      state_id: '', city_id: '', marital_status_id: '', profile_created_for_id: '',
      highest_education_id: '', profession_id: '', income_range_id: '',
      body_type_id: '', complexion_id: '', blood_group_id: '',
      diet_id: '', family_type_id: '', smoking: '', drinking: '', manglik_status: ''
    };
    dispatch(performSearch(emptyFilters));
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

      {searching || loadingMasterData ? (
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

export default SearchScreen;
