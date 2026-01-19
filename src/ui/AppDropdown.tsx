import React, { useState, memo, useMemo, useCallback } from 'react';
import { View, TouchableOpacity, TextInput, Image } from 'react-native';
import Modal from 'react-native-modal';
import Animated, { 
  
} from 'react-native-reanimated';
import { StyleSheet } from 'react-native-unistyles';
import AppText from './AppText';
import { moderateScale } from '../theme/responsiveSize';
import imagePath from '../constants/imagePath';
import { AppDropdownProps } from '../types/formComponentTypes';


const AppDropdown = ({
  label,
  options = [],
  value,
  name = '',
  placeholder = 'Select option',
  isMulti = false,
  hasSearch = false,
  onSelect,
  errorMessage,
}: AppDropdownProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  styles.useVariants({ hasError: !!errorMessage });

  // 1. React 19 / Reanimated 4 optimized Set lookup
  const selectedSet = useMemo(() => {
    const vals = isMulti ? (Array.isArray(value) ? value : []) : ((value != null&&`${value}`.length>0 )? [value] : []);
    return new Set(vals);
  }, [value, isMulti]);

  // 2. Derive Display Text
  const displayText = useMemo(() => {
    if (selectedSet.size === 0) return placeholder;
    const selectedLabels = options
      .filter(opt => selectedSet.has(opt.value))
      .map(opt => opt.label);
    return selectedLabels.join(', ');
  }, [selectedSet, options, placeholder]);

  // 3. Search Logic
  const filteredOptions = useMemo(() => {
    if (!searchQuery) return options;
    const lowerQuery = searchQuery.toLowerCase();
    return options.filter(opt => opt.label.toLowerCase().includes(lowerQuery));
  }, [options, searchQuery]);

  // 4. Selection Handler
  const handleToggle = useCallback((itemValue: string | number) => {
    if (isMulti) {
      const nextSet = new Set(selectedSet);
      nextSet.has(itemValue) ? nextSet.delete(itemValue) : nextSet.add(itemValue);
      onSelect(Array.from(nextSet), name);
    } else {
      onSelect(itemValue, name);
      setIsVisible(false);
      setSearchQuery('');
    }
  }, [isMulti, selectedSet, onSelect, name]);

  const onConfirmPress=()=>{
    setIsVisible(false);
    setSearchQuery('');
  }

  return (
    <View style={styles.container}>
      {label && <AppText text={label} type="header" size="small" style={styles.label} />}

      <TouchableOpacity style={styles.trigger} onPress={() => setIsVisible(true)} activeOpacity={0.7}>
        <AppText 
          text={displayText} 
          style={selectedSet.size > 0 ? styles.selectedText : styles.placeholderText} 
          numberOfLines={1}
        />
        <Image source={imagePath.downArrow} style={styles.chevron} />
      </TouchableOpacity>

      {!!errorMessage && <AppText text={errorMessage} style={styles.errorText} />}

      <Modal
        isVisible={isVisible}
        onBackdropPress={() => { setIsVisible(false); setSearchQuery(''); }}
        onSwipeComplete={() => { setIsVisible(false); setSearchQuery(''); }}
        swipeDirection={['down']}
        propagateSwipe
        style={styles.modalMargin}
        backdropOpacity={0.4}
        useNativeDriverForBackdrop
        statusBarTranslucent
      >
        <View style={[styles.sheet, !!searchQuery && styles.sheetSearchMode]}>
          <View style={styles.handle} />
          {!!label && (
            <View style={styles.headerContainer}>
              <AppText text={label} type="header" style={styles.headerTitle} />
            </View>
          )}
          
          {hasSearch && (
            <View style={styles.searchContainer}>
              <View style={styles.searchWrapper}>
                <TextInput
                  placeholder="Search..."
                  style={styles.searchInput}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholderTextColor={styles.placeholderText.color}
                  autoCorrect={false}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
                    <AppText text="✕" style={styles.clearText} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}

          <Animated.FlatList
            data={filteredOptions}
            keyExtractor={(item) => item.value.toString()}
            
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <AppText text="No results found" style={styles.emptyText} />
                <AppText text={`"${searchQuery}" matches nothing`} style={styles.emptySubText} />
              </View>
            }
            renderItem={({ item }) => {
              const isSelected = selectedSet.has(item.value);
              return (
                <TouchableOpacity
                  style={[styles.optionItem, isSelected && styles.activeOption]}
                  onPress={() => handleToggle(item.value)}
                >
                  <AppText 
                    text={item.label} 
                    style={isSelected ? styles.activeOptionText : styles.optionText} 
                  />
                  {isSelected && (
                    <View style={isMulti ? styles.multiCheck : styles.radioDot}>
                      {isMulti && <AppText text="✓" style={styles.checkMark} />}
                    </View>
                  )}
                </TouchableOpacity>
              );
            }}
          />

          {isMulti && (
            <TouchableOpacity style={styles.doneButton} onPress={onConfirmPress}>
              <AppText text="DONE" type="header" style={styles.doneText} />
            </TouchableOpacity>
          )}
        </View>
      </Modal>
    </View>
  );
};

export default memo(AppDropdown);

const styles = StyleSheet.create(({ colors }) => ({
  container: { width: '100%', marginBottom: moderateScale(12) },
  label: { marginBottom: moderateScale(6) },
  trigger: {
    height: moderateScale(52),
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.background,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    variants: { hasError: { true: { borderColor: colors.error } } }
  },
  placeholderText: { color: colors.placeholder || '#999', flex: 1 },
  selectedText: { color: colors.typography, flex: 1, },
  chevron: { height: 14, width: 14, resizeMode:'contain', color: colors.placeholder },
  errorText: { color: colors.error, fontSize: 12, marginTop: 4 },
  
  modalMargin: { margin: 0, justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '85%',
    paddingBottom: moderateScale(20),
  },
  // 🔥 Lock the height when searching to prevent jumping
  sheetSearchMode: {
    height: moderateScale(550),
  },
  handle: { width: 40, height: 5, backgroundColor: colors.border, borderRadius: 10, alignSelf: 'center', marginVertical: 15 },
  headerContainer: { paddingHorizontal: 24, paddingBottom: 12, alignItems: 'center' },
  headerTitle: { fontSize: 18, color: colors.typography },
  searchContainer: { paddingHorizontal: 20, marginBottom: 10 },
  searchWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.border + '30', borderRadius: 12 },
  searchInput: { flex: 1, padding: moderateScale(12), color: colors.typography, fontSize: 16 },
  clearButton: { paddingHorizontal: 12 },
  clearText: { fontSize: 14, color: colors.placeholder },
  
  listContent: { flexGrow: 1, paddingBottom: 20 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
  emptyText: { fontWeight: 'bold', color: colors.typography },
  emptySubText: { color: colors.placeholder, marginTop: 4 },
  
  optionItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16, paddingHorizontal: 24 },
  activeOption: { backgroundColor: colors.primaryBrand + '08' },
  optionText: { 
    color: colors.typography, 
    fontSize: moderateScale(16), // Same size
    // fontWeight: '400',
  },
  activeOptionText: { 
    color: colors.primaryBrand, 
    fontSize: moderateScale(16), // Same size
    // fontWeight: '600', // Only change weight
  },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primaryBrand },
  multiCheck: { backgroundColor: colors.primaryBrand, borderRadius: 4, paddingHorizontal: 4, paddingVertical: 2 },
  checkMark: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  doneButton: { margin: 20, backgroundColor: colors.primaryBrand, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  doneText: { color: '#fff', fontSize: 16, fontWeight: '700', textTransform: 'uppercase' },
}));