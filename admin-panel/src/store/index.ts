import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import religionReducer from './slices/masters/religionSlice';
import casteReducer from './slices/masters/casteSlice';
import gotraReducer from './slices/masters/gotraSlice';
import nakshatraReducer from './slices/masters/nakshatraSlice';
import rashiReducer from './slices/masters/rashiSlice';
import stateReducer from './slices/masters/stateSlice';
import cityReducer from './slices/masters/citySlice';
import highestEducationReducer from './slices/masters/highestEducationSlice';
import professionReducer from './slices/masters/professionSlice';
import incomeRangeReducer from './slices/masters/incomeRangeSlice';
import bodyTypeReducer from './slices/masters/bodyTypeSlice';
import complexionReducer from './slices/masters/complexionSlice';
import bloodGroupReducer from './slices/masters/bloodGroupSlice';
import dietReducer from './slices/masters/dietSlice';
import maritalStatusReducer from './slices/masters/maritalStatusSlice';
import familyTypeReducer from './slices/masters/familyTypeSlice';
import profileCreatedForReducer from './slices/masters/profileCreatedForSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    religion: religionReducer,
    caste: casteReducer,
    gotra: gotraReducer,
    nakshatra: nakshatraReducer,
    rashi: rashiReducer,
    state: stateReducer,
    city: cityReducer,
    highestEducation: highestEducationReducer,
    profession: professionReducer,
    incomeRange: incomeRangeReducer,
    bodyType: bodyTypeReducer,
    complexion: complexionReducer,
    bloodGroup: bloodGroupReducer,
    diet: dietReducer,
    maritalStatus: maritalStatusReducer,
    familyType: familyTypeReducer,
    profileCreatedFor: profileCreatedForReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
