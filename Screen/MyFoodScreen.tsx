// screens/MyFoodScreen.tsx
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

export interface CustomRecipe {
  id: string;
  name: string;
  image: string;
  category: string;
  cuisine: string;
  prepTime: string;
  servings: string;
  difficulty: string;
  ingredients: { ingredient: string; measure: string }[];
  instructions: string[];
  createdAt: string;
}

interface MyFoodScreenProps {
  navigation: any;
  onAddRecipe: () => void;
  embedded?: boolean;
}

export default function MyFoodScreen({ navigation, onAddRecipe, embedded = true }: MyFoodScreenProps) {
  const [recipes, setRecipes] = React.useState<CustomRecipe[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    loadRecipes();
  }, []);

  // Reload recipes when screen comes into focus
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadRecipes();
    });
    return unsubscribe;
  }, [navigation]);

  const loadRecipes = async () => {
    try {
      const stored = await AsyncStorage.getItem('myRecipes');
      if (stored) {
        setRecipes(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading recipes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteRecipe = async (id: string) => {
    Alert.alert(
      'Delete Recipe',
      'Are you sure you want to delete this recipe?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updated = recipes.filter((r) => r.id !== id);
            setRecipes(updated);
            await AsyncStorage.setItem('myRecipes', JSON.stringify(updated));
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
        <Icon name="restaurant-outline" size={hp(6)} color="#D1D5DB" />
      </View>
      <Text style={styles.emptyTitle}>No Recipes Yet</Text>
      <Text style={styles.emptySubtitle}>
        Create your first recipe and build your personal cookbook
      </Text>
      <TouchableOpacity
        style={styles.emptyButton}
        onPress={onAddRecipe}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#8B5CF6', '#7C3AED']}
          style={styles.emptyButtonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Icon name="add" size={hp(2.2)} color="#fff" />
          <Text style={styles.emptyButtonText}>Add Recipe</Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderRecipeCard = ({ item, index }: { item: CustomRecipe; index: number }) => (
    <Animated.View
      entering={FadeInDown.delay(index * 100).duration(500)}
      style={styles.recipeCard}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.navigate('CustomRecipeDetail', { recipe: item })}
      >
        <Image
          source={{ uri: item.image }}
          style={styles.recipeImage}
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.recipeGradient}
        />
        
        {/* Delete Button */}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteRecipe(item.id)}
        >
          <Icon name="trash-outline" size={hp(1.8)} color="#EF4444" />
        </TouchableOpacity>

        {/* Difficulty Badge */}
        <View style={[
          styles.difficultyBadge,
          { backgroundColor: item.difficulty === 'Easy' ? '#10B981' : item.difficulty === 'Medium' ? '#F59E0B' : '#EF4444' }
        ]}>
          <Text style={styles.difficultyText}>{item.difficulty}</Text>
        </View>

        {/* Recipe Info */}
        <View style={styles.recipeInfo}>
          <Text style={styles.recipeName} numberOfLines={2}>
            {item.name}
          </Text>
          <View style={styles.recipeMeta}>
            <View style={styles.metaItem}>
              <Icon name="time-outline" size={hp(1.4)} color="rgba(255,255,255,0.8)" />
              <Text style={styles.metaText}>{item.prepTime}</Text>
            </View>
            <View style={styles.metaItem}>
              <Icon name="people-outline" size={hp(1.4)} color="rgba(255,255,255,0.8)" />
              <Text style={styles.metaText}>{item.servings}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  const AddRecipeCard = () => (
    <TouchableOpacity
      style={styles.addRecipeCard}
      onPress={onAddRecipe}
      activeOpacity={0.8}
    >
      <View style={styles.addRecipeContent}>
        <Icon name="add-circle-outline" size={hp(4)} color="#8B5CF6" />
        <Text style={styles.addRecipeText}>Add Recipe</Text>
      </View>
    </TouchableOpacity>
  );

  // Combine recipes with add card
  const dataWithAddCard = [...recipes, { id: 'add-card', isAddCard: true }];

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>My Food</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{recipes.length}</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={onAddRecipe}
          style={styles.addButton}
        >
          <Icon name="add" size={hp(2.5)} color="#8B5CF6" />
        </TouchableOpacity>
      </View>

      {recipes.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={dataWithAddCard}
          renderItem={({ item, index }) => 
            (item as any).isAddCard ? <AddRecipeCard /> : renderRecipeCard({ item: item as CustomRecipe, index })
          }
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(5),
    paddingTop: hp(2),
    paddingBottom: hp(1.5),
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2),
  },
  sectionTitle: {
    fontSize: hp(2.5),
    fontWeight: '700',
    color: '#1F2937',
  },
  countBadge: {
    backgroundColor: '#EDE9FE',
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.3),
    borderRadius: 12,
  },
  countText: {
    fontSize: hp(1.4),
    fontWeight: '700',
    color: '#8B5CF6',
  },
  addButton: {
    width: hp(4),
    height: hp(4),
    borderRadius: hp(1.2),
    backgroundColor: '#EDE9FE',
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: '#EDE9FE',
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
    marginBottom: hp(3),
  },
  emptyButton: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  emptyButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(5),
    gap: wp(2),
  },
  emptyButtonText: {
    fontSize: hp(1.7),
    fontWeight: '700',
    color: '#fff',
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
  deleteButton: {
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
  difficultyBadge: {
    position: 'absolute',
    top: hp(1),
    left: hp(1),
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.3),
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: hp(1.1),
    fontWeight: '700',
    color: '#fff',
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
  recipeMeta: {
    flexDirection: 'row',
    gap: wp(3),
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1),
  },
  metaText: {
    fontSize: hp(1.2),
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  addRecipeCard: {
    width: (width - wp(13)) / 2,
    height: hp(22),
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  addRecipeContent: {
    alignItems: 'center',
    gap: hp(1),
  },
  addRecipeText: {
    fontSize: hp(1.5),
    fontWeight: '600',
    color: '#8B5CF6',
  },
});