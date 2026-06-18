import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
  Switch
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import { useNavigation, useRoute, CommonActions } from '@react-navigation/native';
import api from '../services/api';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

const MASTER_ENDPOINTS = [
  'religion', 'caste', 'gotra', 'nakshatra', 'rashi', 'state', 'city',
  'highest_education', 'profession', 'income_range', 'body_type',
  'complexion', 'blood_group', 'diet', 'marital_status', 'family_type', 'profile_created_for'
];

const ProfileSetupScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const isEditing = route.params?.isEditing;

  const [loading, setLoading] = useState(false);
  const [loadingMasterData, setLoadingMasterData] = useState(true);
  const [masterDataOptions, setMasterDataOptions] = useState<Record<string, any[]>>({});

  const [formData, setFormData] = useState<any>({
    smoking: false, drinking: false, manglik_status: false, verification: false,
    no_of_brothers: '', no_of_sisters: '', height: '', weight: '',
    mother_occupation: '', father_occupation: '', mother_name: '', father_name: '', bio: '',
    religion_id: '', caste_id: '', gotra_id: '', nakshatra_id: '', rashi_id: '',
    state_id: '', city_id: '', highest_education_id: '', profession_id: '', income_range_id: '',
    body_type_id: '', complexion_id: '', blood_group_id: '', diet_id: '', marital_status_id: '',
    family_type_id: '', profile_created_for_id: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [masterRes, profileRes] = await Promise.all([
          api.get('/master-data'),
          api.get('/profile')
        ]);
        
        setMasterDataOptions(masterRes.data);
        
        if (profileRes.data?.user) {
          const user = profileRes.data.user;
          setFormData({
            smoking: user.smoking || false,
            drinking: user.drinking || false,
            manglik_status: user.manglik_status || false,
            verification: user.verification || false,
            no_of_brothers: user.no_of_brothers ?? '',
            no_of_sisters: user.no_of_sisters ?? '',
            height: user.height || '',
            weight: user.weight || '',
            mother_occupation: user.mother_occupation || '',
            father_occupation: user.father_occupation || '',
            mother_name: user.mother_name || '',
            father_name: user.father_name || '',
            bio: user.bio || '',
            religion_id: user.religion_id || '',
            caste_id: user.caste_id || '',
            gotra_id: user.gotra_id || '',
            nakshatra_id: user.nakshatra_id || '',
            rashi_id: user.rashi_id || '',
            state_id: user.state_id || '',
            city_id: user.city_id || '',
            highest_education_id: user.highest_education_id || '',
            profession_id: user.profession_id || '',
            income_range_id: user.income_range_id || '',
            body_type_id: user.body_type_id || '',
            complexion_id: user.complexion_id || '',
            blood_group_id: user.blood_group_id || '',
            diet_id: user.diet_id || '',
            marital_status_id: user.marital_status_id || '',
            family_type_id: user.family_type_id || '',
            profile_created_for_id: user.profile_created_for_id || ''
          });
        }
      } catch (err) {
        Alert.alert('Error', 'Failed to load options or profile. Please check your connection.');
        console.error(err);
      } finally {
        setLoadingMasterData(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    // Basic validation check to ensure no fields are completely empty strings (except booleans which are false)
    for (const key of Object.keys(formData)) {
      if (typeof formData[key] === 'string' && formData[key].trim() === '') {
        Alert.alert('Incomplete', 'Please fill in all the required fields.');
        return;
      }
    }

    try {
      setLoading(true);
      await api.put('/profile', formData);
      Alert.alert('Success', 'Profile updated successfully!', [
        {
          text: isEditing ? 'OK' : 'Continue',
          onPress: () => {
            if (isEditing) {
              navigation.goBack();
            } else {
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'Main' }],
                })
              );
            }
          }
        }
      ]);
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to save profile.');
    } finally {
      setLoading(false);
    }
  };

  if (loadingMasterData) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 10 }}>Loading setup details...</Text>
      </SafeAreaView>
    );
  }

  const renderPicker = (field: string, label: string) => {
    let options = masterDataOptions[field] || [];
    
    // Filter cities by selected state
    if (field === 'city' && formData.state_id) {
      options = options.filter((opt: any) => String(opt.state_id) === String(formData.state_id));
    } else if (field === 'city') {
      options = []; // Show no cities until state is selected
    }

    return (
      <View style={styles.inputGroup} key={field}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData[`${field}_id`]}
            onValueChange={(val) => handleChange(`${field}_id`, val)}
          >
            <Picker.Item label={`Select ${label}`} value="" />
            {options.map((opt: any) => (
              <Picker.Item key={opt.id} label={opt.name} value={opt.id} />
            ))}
          </Picker>
        </View>
      </View>
    );
  };

  const renderInput = (field: string, label: string, keyboardType = 'default') => (
    <View style={styles.inputGroup} key={field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={String(formData[field])}
        onChangeText={(val) => handleChange(field, val)}
        keyboardType={keyboardType as any}
        placeholder={`Enter ${label}`}
      />
    </View>
  );

  const renderSwitch = (field: string, label: string) => (
    <View style={styles.switchGroup} key={field}>
      <Text style={styles.label}>{label}</Text>
      <Switch
        value={formData[field]}
        onValueChange={(val) => handleChange(field, val)}
        trackColor={{ false: '#767577', true: colors.primary }}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={typography.h2}>{isEditing ? 'Edit Your Profile' : 'Complete Your Profile'}</Text>
          <Text style={styles.subtitle}>
            {isEditing ? 'Update your personal details below.' : 'Please fill out all the details below to continue.'}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Info</Text>
          {renderPicker('profile_created_for', 'Profile Created For')}
          {renderPicker('religion', 'Religion')}
          {renderPicker('caste', 'Caste')}
          {renderPicker('gotra', 'Gotra')}
          {renderPicker('marital_status', 'Marital Status')}
          {renderInput('height', 'Height (e.g. 5ft 8in)')}
          {renderInput('weight', 'Weight (kg)', 'numeric')}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education & Career</Text>
          {renderPicker('highest_education', 'Highest Education')}
          {renderPicker('profession', 'Profession')}
          {renderPicker('income_range', 'Income Range')}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Family Details</Text>
          {renderPicker('family_type', 'Family Type')}
          {renderInput('mother_name', 'Mother Name')}
          {renderInput('mother_occupation', 'Mother Occupation')}
          {renderInput('father_name', 'Father Name')}
          {renderInput('father_occupation', 'Father Occupation')}
          {renderInput('no_of_brothers', 'No. of Brothers', 'numeric')}
          {renderInput('no_of_sisters', 'No. of Sisters', 'numeric')}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Astrology Details</Text>
          {renderPicker('nakshatra', 'Nakshatra')}
          {renderPicker('rashi', 'Rashi')}
          {renderSwitch('manglik_status', 'Are you Manglik?')}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Physical Attributes & Location</Text>
          {renderPicker('body_type', 'Body Type')}
          {renderPicker('complexion', 'Complexion')}
          {renderPicker('blood_group', 'Blood Group')}
          {renderPicker('state', 'State')}
          {renderPicker('city', 'City')}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lifestyle</Text>
          {renderPicker('diet', 'Diet')}
          {renderSwitch('smoking', 'Do you Smoke?')}
          {renderSwitch('drinking', 'Do you Drink?')}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About Yourself</Text>
          <View style={styles.inputGroup}>
            <TextInput
              style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
              value={formData.bio}
              onChangeText={(val) => handleChange('bio', val)}
              placeholder="Write a little about yourself..."
              multiline
            />
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.submitButton, loading && { opacity: 0.7 }]} 
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Save Profile</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
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
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 30,
    marginTop: 10,
  },
  subtitle: {
    ...typography.subtitle,
    marginTop: 8,
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 8,
  },
  inputGroup: {
    marginBottom: 16,
  },
  switchGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 8,
  },
  label: {
    fontSize: 14,
    color: colors.textDark,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    backgroundColor: '#fafafa',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: '#fafafa',
    overflow: 'hidden',
  },
  submitButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    elevation: 3,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default ProfileSetupScreen;
