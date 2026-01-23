import React, { useState } from 'react';
import { Alert, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { getCurrentLocation, LocationData } from '../services/loactionService';
import Button from './Button';
import AppText from './AppText';
interface LocationPickerProps {
  value?: LocationData | null;
  onLocationSelect: (location: LocationData) => void;
  label?: string;
  errorMessage?: string;
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  value,
  onLocationSelect,
  label,
  errorMessage,
}) => {
  const [loading, setLoading] = useState(false);

  const handleFetch = async () => {
    setLoading(true);
    try {
      const coords = await getCurrentLocation();
      onLocationSelect(coords);
    } catch (err: any) {
      if (err.message !== 'PERMISSION_DENIED') {
        Alert.alert(
          'Location Error',
          'Unable to retrieve your current position.',
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {!!label && <AppText text={label} type="label" />}

      <Button
        title={value ? '📍 Update Location' : 'Fetch Current Location'}
        onPress={handleFetch}
        isDisabled={loading}
      />

      {!!value && !loading && (
        <AppText
          text={`${value.latitude.toFixed(4)}, ${value.longitude.toFixed(4)}`}
          type="label"
        />
      )}

      {!!errorMessage && <AppText text={errorMessage}  color="error" size='small' />}
    </View>
  );
};

export default LocationPicker;
const styles = StyleSheet.create(({ colors }) => ({
  container: { marginVertical: 10, width: '100%' },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    color: colors.labelText,
  },
  button: {
    backgroundColor: colors.primaryBrand,
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  errorBorder: { borderColor: colors.error, borderWidth: 1 },
  btnText: { color: colors.inverse, fontWeight: 'bold', fontSize: 15 },
  coordText: { marginTop: 6, fontSize: 12, color: '#666', textAlign: 'center' },
  errorText: { color: colors.error, fontSize: 12, marginTop: 4 },
}));
