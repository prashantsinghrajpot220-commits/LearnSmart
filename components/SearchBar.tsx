import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { qaSearchService } from '@/services/QASearchService';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  onSuggestions?: (suggestions: string[]) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  onSubmit,
  placeholder = 'Search questions...',
  onSuggestions,
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const performSearch = useCallback(async (keyword: string) => {
    if (keyword.trim().length >= 2) {
      setIsSearching(true);
      try {
        const results = await qaSearchService.getSuggestions(keyword);
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
        onSuggestions?.(results);
      } catch (error) {
        console.error('Search suggestions error:', error);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      onSuggestions?.([]);
    }
  }, [onSuggestions]);

  const handleChangeText = (text: string) => {
    onChangeText(text);

    // Clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Debounce search suggestions (400ms)
    debounceRef.current = setTimeout(() => {
      performSearch(text);
    }, 400);
  };

  const handleSubmit = () => {
    Keyboard.dismiss();
    setShowSuggestions(false);
    onSubmit?.();
  };

  const handleClear = () => {
    onChangeText('');
    setSuggestions([]);
    setShowSuggestions(false);
    Keyboard.dismiss();
  };

  const handleSuggestionPress = (suggestion: string) => {
    onChangeText(suggestion);
    setShowSuggestions(false);
    Keyboard.dismiss();
    onSubmit?.();
  };

  useEffect(() => {
    if (showSuggestions) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [showSuggestions, fadeAnim]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons 
          name="search" 
          size={20} 
          color={Colors.light.textSecondary} 
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={handleChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.light.textSecondary}
          returnKeyType="search"
          onSubmitEditing={handleSubmit}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {isSearching && (
          <Animated.View style={[styles.loadingIndicator, { opacity: fadeAnim }]}>
            <ActivityIndicator size="small" color={Colors.light.primary} />
          </Animated.View>
        )}
        {value.length > 0 && !isSearching && (
          <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color={Colors.light.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {showSuggestions && (
        <Animated.View style={[styles.suggestionsContainer, { opacity: fadeAnim }]}>
          {suggestions.map((suggestion, index) => (
            <TouchableOpacity
              key={`${suggestion}-${index}`}
              style={styles.suggestionItem}
              onPress={() => handleSuggestionPress(suggestion)}
            >
              <Ionicons name="search" size={16} color={Colors.light.textSecondary} />
              <Text style={styles.suggestionText} numberOfLines={1}>
                {suggestion}
              </Text>
            </TouchableOpacity>
          ))}
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1000,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.light.text,
    padding: 0,
  },
  loadingIndicator: {
    marginLeft: 8,
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 54,
    left: 0,
    right: 0,
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  suggestionText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: Colors.light.text,
  },
});

export default SearchBar;
