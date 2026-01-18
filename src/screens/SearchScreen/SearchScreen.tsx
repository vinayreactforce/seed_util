import React, { useState, useEffect, useCallback, memo } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StyleSheet } from 'react-native-unistyles';
import { SEARCH_CONFIG, SearchType } from './searchConfig';
import AppText from '../../ui/AppText';
import { SafeAreaView } from 'react-native-safe-area-context';

const GlobalSearchScreen = () => {
  const route = useRoute();
  const params = route.params as { 
    searchType: SearchType; 
    mode?: 'debounce' | 'button' 
  };

  const navigation = useNavigation();
  

  // Extract params
  const searchType = (params?.searchType as SearchType) || 'USERS';
  const mode = params?.mode || 'debounce'; // 'debounce' | 'button'
  const config = SEARCH_CONFIG[searchType];

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // The core search function
  const handleSearch = useCallback(async (text: string) => {
    const cleanText = text.trim();
    if (!cleanText) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await config.fetcher(cleanText);
      setResults(response.data || []);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  }, [config]);

  // Debounce logic: Only runs if mode is 'debounce'
  useEffect(() => {
    if (mode !== 'debounce' || !query) return;

    const timer = setTimeout(() => {
      handleSearch(query);
    }, 500);

    return () => clearTimeout(timer);
  }, [query, mode, handleSearch]);

  const ItemComponent = config.component;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <AppText text="←" style={styles.backIcon} />
        </TouchableOpacity>

        <View style={styles.searchBar}>
          <TextInput
            style={styles.input}
            placeholder={config.placeholder}
            value={query}
            onChangeText={setQuery}
            autoFocus
            returnKeyType="search"
            placeholderTextColor="#999"
            onSubmitEditing={() => handleSearch(query)}
          />
          {loading && <ActivityIndicator size="small" style={styles.loader} />}
        </View>

        {mode === 'button' && (
          <TouchableOpacity 
            style={styles.actionBtn} 
            onPress={() => handleSearch(query)}
          >
            <AppText text="Search" style={styles.actionBtnText} />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <ItemComponent item={item} />}
        contentContainerStyle={styles.listContainer}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          !loading && query.length > 0 ? (
            <View style={styles.emptyContainer}>
              <AppText text="No results found" style={styles.emptyText} />
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
};

export default memo(GlobalSearchScreen);

const styles = StyleSheet.create(({ colors }) => ({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: {
    paddingRight: 12,
  },
  backIcon: {
    fontSize: 24,
    color: colors.typography,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.border + '30',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 45,
  },
  input: {
    flex: 1,
    color: colors.typography,
    fontSize: 16,
    paddingVertical: 0,
  },
  loader: {
    marginLeft: 8,
  },
  actionBtn: {
    marginLeft: 12,
    backgroundColor: colors.primaryBrand,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  actionBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  listContainer: {
    paddingBottom: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    color: colors.placeholder,
    fontSize: 14,
  },
}));