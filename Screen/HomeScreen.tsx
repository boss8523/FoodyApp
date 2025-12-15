// screens/HomeScreen.tsx
import { Image, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import { StatusBar } from 'expo-status-bar';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Ionicons';
import Categories from '@/components/categories';
import axios from 'axios';
import Recipes from '@/components/recipes';
import { useNavigation } from '@react-navigation/native';
import FavoritesScreen from './FavoritesScreen';
import MyFoodScreen from './MyFoodScreen';

export default function HomeScreen() {
  const [activeCategory, setActiveCategory] = React.useState<string | null>("Beef");
  const [categories, setCategories] = React.useState([]);
  const [recipes, setRecipes] = React.useState([]);
  const [showFavorites, setShowFavorites] = React.useState(false);
  const [showMyFood, setShowMyFood] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  
  const navigation = useNavigation();

  React.useEffect(() => {
    getCategories();
    getRecipes("Beef");
  }, []);

  const handleChangeCategory = (category: string | null) => {
    setActiveCategory(category);
    
    // Reset views
    setShowFavorites(false);
    setShowMyFood(false);
    
    if (category === 'Favorites') {
      setShowFavorites(true);
      setRecipes([]);
    } else if (category === 'My Food') {
      setShowMyFood(true);
      setRecipes([]);
    } else if (category) {
      // Fetch meals for the selected category
      getRecipes(category);
    }
  }

  const getCategories = async () => {
    try {
      const response = await axios.get('https://themealdb.com/api/json/v1/1/categories.php');
      if (response && response.data) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }

  const getRecipes = async (category: string = 'Beef'): Promise<void> => {
    try {
      const response = await axios.get(`https://themealdb.com/api/json/v1/1/filter.php?c=${category}`);
      if (response && response.data) {
        setRecipes(response.data.meals);
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  }

  const searchRecipes = async (query: string) => {
    if (!query.trim()) {
      getRecipes(activeCategory || 'Beef');
      return;
    }
    
    try {
      const response = await axios.get(`https://themealdb.com/api/json/v1/1/search.php?s=${query}`);
      if (response && response.data) {
        setRecipes(response.data.meals || []);
        // Reset special views when searching
        setShowFavorites(false);
        setShowMyFood(false);
        setActiveCategory(null);
      }
    } catch (error) {
      console.error("Error searching recipes:", error);
    }
  }

  const handleAddRecipe = () => {
    navigation.navigate('AddRecipeScreen' as never);
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
        style={styles.scrollView}
      >
        {/* Header Card */}
        <View style={styles.card}>
          <Image 
            source={require('@/assets/images/Profile.png')} 
            style={{ width: hp(5.5), height: hp(5), borderRadius: hp(2.5) }} 
          />
          <Icon name="notifications-outline" size={hp(4)} color="black" />
        </View>

        {/* Greetings Section */}
        <View style={styles.greetings}>
          <Text style={styles.greetingText}>Hello, Abdi</Text>
          <View>
            <Text style={styles.greetingText2}>
              Time to boost your mood with a quick{' '}
              <Text style={{ color: '#d6cd25ff', fontWeight: 'bold' }}>recipe!</Text>
            </Text>
          </View>
        </View>

        {/* Search Section */}
        <View style={styles.search}>
          <TextInput
            placeholder='Search for recipes'
            placeholderTextColor={'gray'}
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => searchRecipes(searchQuery)}
            returnKeyType="search"
          />
          <Icon 
            name="search-outline" 
            size={hp(3)} 
            color="#6B7280" 
            onPress={() => searchRecipes(searchQuery)}
          />
        </View>

        {/* Categories Section */}
        <View>
          {categories.length > 0 && (
            <Categories 
              categories={categories} 
              activeCategory={activeCategory} 
              handleChangeCategory={handleChangeCategory} 
            />
          )}
        </View>

        {/* Content Section - Conditionally render based on active category */}
        <View style={styles.contentSection}>
          {showFavorites ? (
            <FavoritesScreen navigation={navigation} />
          ) : showMyFood ? (
            <MyFoodScreen navigation={navigation} onAddRecipe={handleAddRecipe} />
          ) : (
            <Recipes meals={recipes} />
          )}
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  scrollView: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    flex: 1,
    paddingTop: hp(5),
    width: '100%',
  },
  card: {
    display: 'flex',
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: wp(5),
    marginBottom: hp(2)
  },
  greetings: {
    marginHorizontal: wp(5),
    marginBottom: hp(2)
  },
  greetingText: {
    fontSize: hp(2.5),
    color: 'gray'
  },
  greetingText2: {
    fontSize: hp(3.5),
  },
  search: {
    marginHorizontal: wp(5),
    height: hp(6),
    backgroundColor: '#f9f3f3ff',
    borderRadius: hp(1.5),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(4),
    justifyContent: 'space-between'
  },
  searchInput: {
    paddingHorizontal: 10,
    flex: 1,
    height: '100%',
    fontSize: hp(1.8),
  },
  contentSection: {
    flex: 1,
    minHeight: hp(50),
  }
})