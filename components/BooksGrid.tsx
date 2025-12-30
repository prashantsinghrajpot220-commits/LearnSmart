import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Linking,
} from 'react-native';
import { Spacing, BorderRadius, FontSizes, FontWeights } from '@/constants/theme';
import { useTheme, ThemeColors } from './ThemeContext';
import { Feather } from '@expo/vector-icons';

interface Book {
  id: string;
  pathwayId: string;
  pathwayName: string;
  title: string;
  author: string;
  description: string;
  thumbnail: string;
  amazonUrl: string;
  isbn: string;
}

interface BooksGridProps {
  pathwayName: string;
  books?: Book[];
}

export default function BooksGrid({ pathwayName, books }: BooksGridProps) {
  const { colors } = useTheme();

  const handleBuyPress = (amazonUrl: string) => {
    Linking.openURL(amazonUrl).catch((err) => {
      console.error('Failed to open URL:', err);
    });
  };

  const displayBooks = books || [];

  const styles = getStyles(colors);

  if (displayBooks.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Feather name="book" size={48} color={colors.textSecondary} />
        <Text style={styles.emptyText}>No books available for this pathway</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.content}>
        {displayBooks.map((book) => (
          <View key={book.id} style={styles.bookCard}>
            <View style={styles.bookHeader}>
              <View style={styles.thumbnailContainer}>
                <Text style={styles.thumbnail}>{book.thumbnail}</Text>
              </View>
              <View style={styles.titleContainer}>
                <Text style={styles.bookTitle} numberOfLines={2}>
                  {book.title}
                </Text>
                <Text style={styles.authorName}>{book.author}</Text>
              </View>
            </View>

            <Text style={styles.description} numberOfLines={3}>
              {book.description}
            </Text>

            <TouchableOpacity
              style={styles.buyButton}
              onPress={() => handleBuyPress(book.amazonUrl)}
              activeOpacity={0.8}
            >
              <Feather name="shopping-cart" size={16} color="#333333" />
              <Text style={styles.buyButtonText}>Buy on Amazon</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const getStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -Spacing.sm,
  },
  bookCard: {
    backgroundColor: colors.cardBackground,
    flexBasis: Platform.select({ web: '48%', default: '46%' }),
    margin: Spacing.sm,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: colors.lightGray,
    minHeight: 220,
    justifyContent: 'space-between',
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  bookHeader: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
  },
  thumbnailContainer: {
    width: 50,
    height: 70,
    borderRadius: BorderRadius.sm,
    backgroundColor: colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  thumbnail: {
    fontSize: 32,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  bookTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: colors.text,
    lineHeight: 18,
    marginBottom: 4,
  },
  authorName: {
    fontSize: FontSizes.sm,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  description: {
    fontSize: FontSizes.sm,
    color: colors.textSecondary,
    lineHeight: 16,
    marginBottom: Spacing.md,
    flex: 1,
  },
  buyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFD700',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: '#E6C200',
  },
  buyButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: '#333333',
    marginLeft: Spacing.xs,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxxl,
  },
  emptyText: {
    fontSize: FontSizes.md,
    color: colors.textSecondary,
    marginTop: Spacing.md,
  },
});
