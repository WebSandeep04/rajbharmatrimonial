import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
  Switch,
  StyleSheet
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import { useNavigation, useRoute, CommonActions } from '@react-navigation/native';
import { typography } from '../theme/typography';
import { colors } from '../theme/colors';
import { styles } from '../styles/ProfileSetupScreenStyles';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchMasterDataAndProfile, saveProfileData } from '../store/slices/profileSetupSlice';

const SECTIONS = [
  'Basic Info',
  'Education & Career',
  'Family Details',
  'Astrology Details',
  'Physical Attributes & Location',
  'Lifestyle',
  'About Yourself'
];

const SECTION_FIELDS = [
  ['profile_created_for_id', 'religion_id', 'caste_id', 'gotra_id', 'marital_status_id', 'height', 'weight'],
  ['highest_education_id', 'profession_id', 'income_range_id'],
  ['family_type_id', 'mother_name', 'mother_occupation', 'father_name', 'father_occupation', 'no_of_brothers', 'no_of_sisters'],
  ['nakshatra_id', 'rashi_id', 'manglik_status'],
  ['body_type_id', 'complexion_id', 'blood_group_id', 'state_id', 'city_id'],
  ['diet_id', 'smoking', 'drinking'],
  ['bio']
];

const ProfileSetupScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const isEditing = route.params?.isEditing;
  const dispatch = useAppDispatch();
  
  const { masterDataOptions, loadingMasterData, savingProfile } = useAppSelector((state) => state.profileSetup);

  const [currentSection, setCurrentSection] = useState(0);

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
    const loadData = async () => {
      try {
        const resultAction = await dispatch(fetchMasterDataAndProfile());
        if (fetchMasterDataAndProfile.fulfilled.match(resultAction)) {
          const user = resultAction.payload.profile;
          if (user) {
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
        }
      } catch (err) {
        Alert.alert('Error', 'Failed to load options or profile. Please check your connection.');
      }
    };
    loadData();
  }, [dispatch]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    // Validate current section
    const currentFields = SECTION_FIELDS[currentSection];
    for (const field of currentFields) {
      if (typeof formData[field] === 'string' && formData[field].trim() === '') {
        Alert.alert('Incomplete', 'Please fill in all the mandatory fields before proceeding to the next section.');
        return;
      }
    }
    setCurrentSection(prev => prev + 1);
  };

  const handlePrevious = () => {
    setCurrentSection(prev => prev - 1);
  };

  const handleSubmit = async () => {
    // Validate the last section before submitting
    const currentFields = SECTION_FIELDS[currentSection];
    for (const field of currentFields) {
      if (typeof formData[field] === 'string' && formData[field].trim() === '') {
        Alert.alert('Incomplete', 'Please fill in all the mandatory fields.');
        return;
      }
    }

    try {
      const resultAction = await dispatch(saveProfileData(formData));
      if (saveProfileData.fulfilled.match(resultAction)) {
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
      } else {
        Alert.alert('Error', (resultAction.payload as string) || 'Failed to save profile.');
      }
    } catch (err: any) {
      Alert.alert('Error', 'An unexpected error occurred.');
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

  const renderLabel = (label: string, isMandatory: boolean = true) => (
    <Text style={styles.label}>
      {label} {isMandatory && <Text style={{ color: 'red' }}>*</Text>}
    </Text>
  );

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
        {renderLabel(label)}
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
      {renderLabel(label)}
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
    <SafeAreaView style={[styles.container, { backgroundColor: '#FFF0F5' }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={typography.h2}>{isEditing ? 'Edit Your Profile' : 'Complete Your Profile'}</Text>
          <Text style={styles.subtitle}>
            {isEditing ? 'Update your personal details below.' : 'Please fill out all the details below to continue.'}
          </Text>
        </View>

        {/* Progress Indicator */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 14, color: colors.textDark, marginBottom: 8, fontWeight: '600' }}>
            Step {currentSection + 1} of {SECTIONS.length}
          </Text>
          <View style={{ flexDirection: 'row', height: 6, backgroundColor: '#E5E7EB', borderRadius: 3, overflow: 'hidden' }}>
            {SECTIONS.map((_, index) => (
              <View 
                key={index}
                style={{
                  flex: 1,
                  backgroundColor: index <= currentSection ? colors.primary : 'transparent',
                  marginRight: index < SECTIONS.length - 1 ? 2 : 0,
                  borderRadius: 3,
                }}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{SECTIONS[currentSection]}</Text>
          
          {currentSection === 0 && (
            <>
              {renderPicker('profile_created_for', 'Profile Created For')}
              {renderPicker('religion', 'Religion')}
              {renderPicker('caste', 'Caste')}
              {renderPicker('gotra', 'Gotra')}
              {renderPicker('marital_status', 'Marital Status')}
              {renderInput('height', 'Height (e.g. 5ft 8in)')}
              {renderInput('weight', 'Weight (kg)', 'numeric')}
            </>
          )}

          {currentSection === 1 && (
            <>
              {renderPicker('highest_education', 'Highest Education')}
              {renderPicker('profession', 'Profession')}
              {renderPicker('income_range', 'Income Range')}
            </>
          )}

          {currentSection === 2 && (
            <>
              {renderPicker('family_type', 'Family Type')}
              {renderInput('mother_name', 'Mother Name')}
              {renderInput('mother_occupation', 'Mother Occupation')}
              {renderInput('father_name', 'Father Name')}
              {renderInput('father_occupation', 'Father Occupation')}
              {renderInput('no_of_brothers', 'No. of Brothers', 'numeric')}
              {renderInput('no_of_sisters', 'No. of Sisters', 'numeric')}
            </>
          )}

          {currentSection === 3 && (
            <>
              {renderPicker('nakshatra', 'Nakshatra')}
              {renderPicker('rashi', 'Rashi')}
              {renderSwitch('manglik_status', 'Are you Manglik?')}
            </>
          )}

          {currentSection === 4 && (
            <>
              {renderPicker('body_type', 'Body Type')}
              {renderPicker('complexion', 'Complexion')}
              {renderPicker('blood_group', 'Blood Group')}
              {renderPicker('state', 'State')}
              {renderPicker('city', 'City')}
            </>
          )}

          {currentSection === 5 && (
            <>
              {renderPicker('diet', 'Diet')}
              {renderSwitch('smoking', 'Do you Smoke?')}
              {renderSwitch('drinking', 'Do you Drink?')}
            </>
          )}

          {currentSection === 6 && (
            <>
              <View style={styles.inputGroup}>
                {renderLabel('Bio')}
                <TextInput
                  style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
                  value={formData.bio}
                  onChangeText={(val) => handleChange('bio', val)}
                  placeholder="Write a little about yourself..."
                  multiline
                />
              </View>
            </>
          )}
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
          {currentSection > 0 && (
            <TouchableOpacity 
              style={[styles.submitButton, { width: 140, marginRight: 15, backgroundColor: '#888' }]} 
              onPress={handlePrevious}
            >
              <Text style={styles.submitButtonText}>Previous</Text>
            </TouchableOpacity>
          )}

          {currentSection < SECTIONS.length - 1 ? (
            <TouchableOpacity 
              style={[styles.submitButton, { width: 140 }]} 
              onPress={handleNext}
            >
              <Text style={styles.submitButtonText}>Next</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={[styles.submitButton, { width: 150 }, savingProfile && { opacity: 0.7 }]} 
              onPress={handleSubmit}
              disabled={savingProfile}
            >
              {savingProfile ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Save Profile</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileSetupScreen;

