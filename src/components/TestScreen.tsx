import React, { useState, useCallback } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native-unistyles';
import { moderateScale } from '../theme/responsiveSize';
import AppInput from '../ui/AppInput';
import AppText from '../ui/AppText';
import AppDropdown from '../ui/AppDropdown';
import OTPInput from '../ui/OtpInput';

// --- Test Data ---
const GENDER_OPTIONS = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Non-binary', value: 'non_binary' },
  { label: 'Prefer not to say', value: 'not_specified' },
];

const INTEREST_OPTIONS = [
  { label: '🎨 Design', value: 'design' },
  { label: '💻 Development', value: 'dev' },
  { label: '🚀 Marketing', value: 'marketing' },
  { label: '📊 Business', value: 'business' },
  { label: '🎵 Music', value: 'music' },
  { label: '🍳 Cooking', value: 'cooking' },
  { label: '🏃‍♂️ Fitness', value: 'fitness' },
  { label: '📸 Photography', value: 'photo' },
  { label: '🎮 Gaming', value: 'gaming' },
];

const COUNTRY_OPTIONS = [
  { label: 'United States', value: 'US' },
  { label: 'United Kingdom', value: 'GB' },
  { label: 'Canada', value: 'CA' },
  { label: 'Germany', value: 'DE' },
  { label: 'France', value: 'FR' },
  { label: 'India', value: 'IN' },
  { label: 'Japan', value: 'JP' },
  { label: 'Australia', value: 'AU' },
  { label: 'Brazil', value: 'BR' },
  { label: 'Mexico', value: 'MX' },
  { label: 'South Korea', value: 'KR' },
  { label: 'Italy', value: 'IT' },
  { label: 'Spain', value: 'ES' },
  { label: 'Netherlands', value: 'NL' },
  { label: 'Singapore', value: 'SG' },
];

const DropdownTestScreen = () => {
  // React 19 Unified Form State
  const [form, setForm] = useState({
    fullName: '',
    otp: '',
    gender: 'male', // Default single select
    interests: ['dev', 'design'], // Default multi-select
    country: '', // Empty searchable
  });

  // Reusable handler using your "field" pattern
  const handleUpdate = useCallback((value: any, field: string) => {
    console.log(value);
    console.log(`The value is ${value} and the field is ${field}`);
    setForm(prev => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <AppText
          text="Component Workshop"
          type="header"
          size="large"
          style={styles.title}
        />

        {/* 1. Standard Input Test */}
        <AppInput
          label="Full Name"
          field="fullName"
          value={form.fullName}
          onChangeText={handleUpdate}
          placeholder="Type your name..."
        />

        {/* 2. OTP Input Test */}
        <View style={styles.section}>
          <AppText text="Security Code" type="header" size="small" />
          <OTPInput
            cellCount={4}
            onCodeFilled={code => handleUpdate(code, 'otp')}
            onCodeChange={code => handleUpdate(code, 'otp')}
          />
        </View>

        {/* 3. Single Select Dropdown */}
        <AppDropdown
          label="Gender Identity"
          name="gender"
          options={GENDER_OPTIONS}
          value={form.gender}
          onSelect={handleUpdate}
        />

        {/* 4. Multi-Select Dropdown */}
        <AppDropdown
          label="Areas of Interest"
          name="interests"
          isMulti
          options={INTEREST_OPTIONS}
          value={form.interests}
          onSelect={handleUpdate}
          placeholder="Select multiple..."
        />

        {/* 5. Searchable Dropdown */}
        <AppDropdown
          label="Primary Country"
          name="country"
          hasSearch
          options={COUNTRY_OPTIONS}
          value={form.country}
          onSelect={handleUpdate}
          placeholder="Search for a country"
        />

        {/* 6. Debugger View */}
        <View style={styles.debugCard}>
          <AppText
            text="Live Form State"
            type="header"
            size="small"
            style={styles.debugTitle}
          />
          <AppText
            text={JSON.stringify(form, null, 2)}
            style={styles.debugText}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DropdownTestScreen;

const styles = StyleSheet.create(({ colors }) => ({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    padding: moderateScale(20),
    paddingBottom: moderateScale(100),
  },
  title: {
    marginBottom: moderateScale(24),
  },
  section: {
    marginVertical: moderateScale(10),
  },
  debugCard: {
    marginTop: moderateScale(30),
    padding: moderateScale(16),
    backgroundColor: colors.border + '20',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  debugTitle: {
    color: colors.primaryBrand,
    marginBottom: 8,
  },
  debugText: {
    fontFamily: 'Courier', // Use system monospace
    fontSize: 12,
    color: colors.typography,
  },
}));
