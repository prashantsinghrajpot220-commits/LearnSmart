import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { Spacing, BorderRadius, FontSizes, FontWeights } from '@/constants/theme';
import { useTheme, ThemeColors } from './ThemeContext';
import { useUserStore } from '@/store/userStore';
import { ContentValidator } from '@/services/ContentValidator';
import { Feather } from '@expo/vector-icons';
import { 
  generateAffiliateLink, 
  convertToAffiliateUrl,
  openAffiliateLink,
  getAffiliateDisclosure 
} from '@/utils/affiliateLinks';
import { isUsingTestAffiliateTag } from '@/config/affiliateConfig';

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
  asin?: string;
}

interface BooksGridProps {
  pathwayName: string;
  books?: Book[];
}

export default function BooksGrid({ pathwayName, books }: BooksGridProps) {
  const { colors } = useTheme();
  const ageGroup = useUserStore((s) => s.ageGroup) ?? 'under12';

  const displayBooks = useMemo(
    () =>
      ContentValidator.validateBooksSync<Book>(books ?? [], {
        contentId: `books:${pathwayName}`,
        ageGroup,
        source: 'BooksGrid',
      }),
    [books, pathwayName, ageGroup]
  );

  const handleBuyPress = (book: Book) => {
    let affiliateLink;
    
    // Try to generate affiliate link using ASIN first (most reliable)
    if (book.asin) {
      affiliateLink = generateAffiliateLink({
        asin: book.asin,
        keywords: book.title,
        useFallback: true
      });
    } 
    // Fallback to ISBN if ASIN not available
    else if (book.isbn) {
      affiliateLink = generateAffiliateLink({
        isbn: book.isbn,
        keywords: book.title,
        useFallback: true
      });
    }
    // Final fallback: convert existing Amazon URL
    else {
      affiliateLink = convertToAffiliateUrl(book.amazonUrl);
    }
    
    if (!affiliateLink.isValid) {
      console.error('Invalid affiliate link generated for book:', book.title);
      Alert.alert('Error', 'Invalid product link. Please try again later.');
      return;
    }
    
    // Open the affiliate link with tracking
    openAffiliateLink(affiliateLink.url, {
      bookTitle: book.title,
      bookId: book.id,
      pathwayName: pathwayName
    }).catch((err) => {
      console.error('Failed to open affiliate link:', err);
    });
  };

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
              onPress={() => handleBuyPress(book)}
              activeOpacity={0.8}
            >
              <Feather name="shopping-cart" size={16} color="#333333" />
              <Text style={styles.buyButtonText}>Buy on Amazon</Text>
            </TouchableOpacity>
            {isUsingTestAffiliateTag() && (
              <Text style={styles.testModeText}>Test affiliate links - no real commissions</Text>
            )}
          </View>
        ))}
      </View>
      <View style={styles.disclaimerContainer}>
        <Text style={styles.disclaimerText}>{getAffiliateDisclosure()}</Text>
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
  testModeText: {
   fontSize: FontSizes.xs,
   color: colors.textSecondary,
   textAlign: 'center',
   marginTop: Spacing.xs,
   fontStyle: 'italic',
  },
  disclaimerContainer: {
   padding: Spacing.md,
   paddingBottom: Spacing.xl,
   alignItems: 'center',
  },
  disclaimerText: {
   fontSize: FontSizes.xs,
   color: colors.textSecondary,
   textAlign: 'center',
   lineHeight: 16,
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
