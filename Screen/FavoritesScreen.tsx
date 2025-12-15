// screens/FavoritesScreen.tsx
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  Dimensions,
  Alert,
  FlatList,
} from 'react-native';
import React from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

interface FavoriteRecipe {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory?: string;
  strArea?: string;
}

interface FavoritesScreenProps {
  navigation: any;
  embedded?: boolean; // When true, hides header for embedding in HomeScreen
}

export default function FavoritesScreen({ navigation, embedded = true }: FavoritesScreenProps) {
  const [favorites, setFavorites] = React.useState<FavoriteRecipe[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    loadFavorites();
  }, []);

  // Reload favorites when screen comes into focus
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadFavorites();
    });
    return unsubscribe;
  }, [navigation]);

  const loadFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem('favorites');
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFavorite = async (id: string) => {
    Alert.alert(
      'Remove from Favorites',
      'Are you sure you want to remove this recipe?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            const updated = favorites.filter((f) => f.idMeal !== id);
            setFavorites(updated);
            await AsyncStorage.setItem('favorites', JSON.stringify(updated));
          },
        },
      ]
    );
  };

  const EmptyState = () => (
    <Animated.View
      entering={FadeIn.delay(200).duration(500)}
      style={styles.emptyContainer}
    >
      <View style={styles.emptyIconContainer}>
        <Icon name="heart-outline" size={hp(6)} color="#D1D5DB" />
      </View>
      <Text style={styles.emptyTitle}>No Favorites Yet</Text>
      <Text style={styles.emptySubtitle}>
        Tap the heart icon on any recipe to save it here
      </Text>
    </Animated.View>
  );

  const renderRecipeCard = ({ item, index }: { item: FavoriteRecipe; index: number }) => (
    <Animated.View
      entering={FadeInDown.delay(index * 100).duration(500)}
      style={styles.recipeCard}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.navigate('recipeScreen', item)}
      >
        <Image
          source={{ uri: item.strMealThumb }}
          style={styles.recipeImage}
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.recipeGradient}
        />
        
        {/* Heart Button */}
        <TouchableOpacity
          style={styles.heartButton}
          onPress={() => removeFavorite(item.idMeal)}
        >
          <Icon name="heart" size={hp(2.2)} color="#EF4444" />
        </TouchableOpacity>

        {/* Recipe Info */}
        <View style={styles.recipeInfo}>
          <Text style={styles.recipeName} numberOfLines={2}>
            {item.strMeal}
          </Text>
          {item.strCategory && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{item.strCategory}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      {/* Header - Only show if not embedded */}
      {!embedded && (
        <Animated.View
          entering={FadeInDown.duration(500)}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>My Favorites</Text>
          <Text style={styles.headerSubtitle}>
            {favorites.length} {favorites.length === 1 ? 'recipe' : 'recipes'} saved
          </Text>
        </Animated.View>
      )}

      {/* Section Title for embedded view */}
      {embedded && (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Favorites</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{favorites.length}</Text>
          </View>
        </View>
      )}

      {favorites.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderRecipeCard}
          keyExtractor={(item) => item.idMeal}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false} // Disable scroll since parent ScrollView handles it
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    paddingHorizontal: wp(5),
    paddingTop: hp(2),
    paddingBottom: hp(2),
  },
  headerTitle: {
    fontSize: hp(3),
    fontWeight: '800',
    color: '#1F2937',
  },
  headerSubtitle: {
    fontSize: hp(1.6),
    color: '#6B7280',
    marginTop: hp(0.3),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(5),
    paddingTop: hp(2),
    paddingBottom: hp(1.5),
    gap: wp(2),
  },
  sectionTitle: {
    fontSize: hp(2.5),
    fontWeight: '700',
    color: '#1F2937',
  },
  countBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.3),
    borderRadius: 12,
  },
  countText: {
    fontSize: hp(1.4),
    fontWeight: '700',
    color: '#EF4444',
  },
  listContent: {
    paddingHorizontal: wp(5),
    paddingBottom: hp(2),
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: hp(2),
  },
  emptyContainer: {
    paddingVertical: hp(8),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(10),
  },
  emptyIconContainer: {
    width: hp(12),
    height: hp(12),
    borderRadius: hp(6),
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(2),
  },
  emptyTitle: {
    fontSize: hp(2.2),
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: hp(0.8),
  },
  emptySubtitle: {
    fontSize: hp(1.6),
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: hp(2.3),
  },
  recipeCard: {
    width: (width - wp(13)) / 2,
    height: hp(22),
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  recipeImage: {
    width: '100%',
    height: '100%',
  },
  recipeGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
  },
  heartButton: {
    position: 'absolute',
    top: hp(1),
    right: hp(1),
    width: hp(3.5),
    height: hp(3.5),
    borderRadius: hp(1.75),
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recipeInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: hp(1.2),
  },
  recipeName: {
    fontSize: hp(1.6),
    fontWeight: '700',
    color: '#fff',
    marginBottom: hp(0.4),
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.2),
    borderRadius: 6,
  },
  categoryText: {
    fontSize: hp(1.1),
    color: '#fff',
    fontWeight: '500',
  },
});