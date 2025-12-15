import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, Platform, Dimensions, Modal } from 'react-native'
import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import Loading from '@/components/loading';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import YoutubeIframe from 'react-native-youtube-iframe';
import AsyncStorage from '@react-native-async-storage/async-storage';
const { width } = Dimensions.get('window');

export default function RecipeScreen(props: any) {
  const [meals, setMeals] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isFavorite, setIsFavorite] = React.useState(false);
  const [showVideo, setShowVideo] = React.useState(false);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [showFullScreenVideo, setShowFullScreenVideo] = React.useState(false);
  
  let item = props.route.params;

  React.useEffect(() => {
    getMealDetails(item.idMeal);
  }, []);

  const getMealDetails = async (id: string): Promise<void> => {
    try {
      const response = await axios.get(`https://themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
      if (response && response.data) {
        setMeals(response.data.meals[0]);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching meal details:", error);
    }
  }

  // Extract YouTube video ID from URL
  const getYoutubeVideoId = (url: string) => {
    if (!url) return null;
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const videoId = getYoutubeVideoId(meals?.strYoutube);

  // Extract ingredients from meal data
  const getIngredients = (meal: any) => {
    if (!meal) return [];
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ingredient && ingredient.trim()) {
        ingredients.push({
          ingredient: ingredient.trim(),
          measure: measure?.trim() || '',
        });
      }
    }
    return ingredients;
  };

  const ingredients = getIngredients(meals);

  // Info cards data
  const infoCards = [
    { icon: 'time-outline', label: 'Time', value: '25 min', color: '#3B82F6' },
    { icon: 'people-outline', label: 'Servings', value: '4', color: '#10B981' },
    { icon: 'flame-outline', label: 'Calories', value: '320 kcal', color: '#F59E0B' },
    { icon: 'speedometer-outline', label: 'Difficulty', value: 'Easy', color: '#8B5CF6' },
  ];

  const onStateChange = React.useCallback((state: string) => {
    if (state === 'ended') {
      setIsPlaying(false);
    }
  }, []);
// Add this function to your recipeScreen.tsx to save favorites
const toggleFavorite = async () => {
  try {
    const stored = await AsyncStorage.getItem('favorites');
    let favorites: any[] = stored ? JSON.parse(stored) : [];
    
    if (isFavorite) {
      // Remove from favorites
      favorites = favorites.filter((f) => f.idMeal !== item.idMeal);
    } else {
      // Add to favorites
      favorites.push({
        idMeal: item.idMeal,
        strMeal: meals?.strMeal || item.strMeal,
        strMealThumb: item.strMealThumb,
        strCategory: meals?.strCategory,
        strArea: meals?.strArea,
      });
    }
    
    await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
    setIsFavorite(!isFavorite);
  } catch (error) {
    console.error('Error toggling favorite:', error);
  }
};

// Check if recipe is favorite on load
React.useEffect(() => {
  checkIfFavorite();
}, []);

const checkIfFavorite = async () => {
  try {
    const stored = await AsyncStorage.getItem('favorites');
    if (stored) {
      const favorites = JSON.parse(stored);
      setIsFavorite(favorites.some((f: any) => f.idMeal === item.idMeal));
    }
  } catch (error) {
    console.error('Error checking favorite:', error);
  }
};

// Update your heart button onPress:

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Hero Image Section */}
      <View style={styles.imageContainer}>
        <Animated.Image
          entering={FadeIn.duration(500)}
          source={{ uri: item.strMealThumb }}
          style={styles.heroImage}
          resizeMode='cover'
        />
        <LinearGradient
          colors={['rgba(0,0,0,0.4)', 'transparent', 'rgba(0,0,0,0.6)']}
          style={styles.imageOverlay}
        />
        
        {/* Play Button Overlay - Only show if video exists */}
        {videoId && (
          <TouchableOpacity 
            style={styles.playButtonOverlay}
            onPress={() => setShowVideo(true)}
            activeOpacity={0.9}
          >
            <View style={styles.playButtonCircle}>
              <Icon name="play" size={hp(4)} color="#fff" style={{ marginLeft: 4 }} />
            </View>
            <Text style={styles.playButtonText}>Watch Video</Text>
          </TouchableOpacity>
        )}
        
        {/* Header Buttons */}
        <View style={styles.headerContainer}>
          <TouchableOpacity 
            onPress={() => props.navigation.goBack()} 
            style={styles.headerButton}
            activeOpacity={0.8}
          >
            <Icon name="arrow-back" size={hp(2.8)} color="#1F2937" />
          </TouchableOpacity>
          
        <TouchableOpacity 
  onPress={toggleFavorite} 
  style={[styles.headerButton, isFavorite && styles.favoriteActive]}
  activeOpacity={0.8}
>
  <Icon 
    name={isFavorite ? "heart" : "heart-outline"} 
    size={hp(2.8)} 
    color={isFavorite ? '#fff' : '#1F2937'} 
  />
</TouchableOpacity>
        </View>
      </View>

      {/* Content Section */}
      <ScrollView
        style={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: hp(12) }}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Loading />
          </View>
        ) : (
          <>
            {/* Title Section */}
            <Animated.View 
              entering={FadeInDown.delay(200).duration(500)}
              style={styles.titleSection}
            >
              <Text style={styles.mealTitle}>{meals?.strMeal}</Text>
              <View style={styles.categoryRow}>
                <View style={styles.categoryBadge}>
                  <Icon name="restaurant-outline" size={hp(1.8)} color="#6366F1" />
                  <Text style={styles.categoryText}>{meals?.strCategory}</Text>
                </View>
                <View style={styles.areaBadge}>
                  <Icon name="location-outline" size={hp(1.8)} color="#EC4899" />
                  <Text style={styles.areaText}>{meals?.strArea}</Text>
                </View>
              </View>
            </Animated.View>

            {/* Info Cards */}
            <Animated.View 
              entering={FadeInDown.delay(300).duration(500)}
              style={styles.infoCardsContainer}
            >
              {infoCards.map((card, index) => (
                <View key={index} style={styles.infoCard}>
                  <View style={[styles.infoIconContainer, { backgroundColor: `${card.color}15` }]}>
                    <Icon name={card.icon} size={hp(2.5)} color={card.color} />
                  </View>
                  <Text style={styles.infoValue}>{card.value}</Text>
                  <Text style={styles.infoLabel}>{card.label}</Text>
                </View>
              ))}
            </Animated.View>

            {/* Embedded Video Section */}
            {videoId && (
              <Animated.View 
                entering={FadeInDown.delay(350).duration(500)}
                style={styles.section}
              >
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Video Tutorial</Text>
                  <TouchableOpacity 
                    style={styles.fullscreenButton}
                    onPress={() => setShowFullScreenVideo(true)}
                  >
                    <Icon name="expand-outline" size={hp(2.2)} color="#6B7280" />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.videoContainer}>
                  <YoutubeIframe
                    height={hp(25)}
                    width={width - wp(10)}
                    videoId={videoId}
                    play={isPlaying}
                    onChangeState={onStateChange}
                    webViewProps={{
                      allowsInlineMediaPlayback: true,
                    }}
                  />
                </View>
              </Animated.View>
            )}

            {/* Ingredients Section */}
            <Animated.View 
              entering={FadeInDown.delay(400).duration(500)}
              style={styles.section}
            >
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Ingredients</Text>
                <View style={styles.ingredientCount}>
                  <Text style={styles.ingredientCountText}>{ingredients.length} items</Text>
                </View>
              </View>
              
              <View style={styles.ingredientsList}>
                {ingredients.map((item, index) => (
                  <Animated.View 
                    key={index}
                    entering={FadeInDown.delay(450 + index * 50).duration(400)}
                    style={[
                      styles.ingredientItem,
                      index === ingredients.length - 1 && { borderBottomWidth: 0 }
                    ]}
                  >
                    <View style={styles.ingredientDot} />
                    <View style={styles.ingredientInfo}>
                      <Text style={styles.ingredientName}>{item.ingredient}</Text>
                      <Text style={styles.ingredientMeasure}>{item.measure}</Text>
                    </View>
                    <TouchableOpacity style={styles.checkButton}>
                      <Icon name="checkmark-circle-outline" size={hp(2.5)} color="#D1D5DB" />
                    </TouchableOpacity>
                  </Animated.View>
                ))}
              </View>
            </Animated.View>

            {/* Instructions Section */}
            <Animated.View 
              entering={FadeInDown.delay(500).duration(500)}
              style={styles.section}
            >
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Instructions</Text>
              </View>
              
              <View style={styles.instructionsContainer}>
                {meals?.strInstructions?.split('\r\n').filter((step: string) => step.trim()).map((step: string, index: number) => (
                  <Animated.View 
                    key={index}
                    entering={FadeInDown.delay(550 + index * 30).duration(400)}
                    style={styles.instructionStep}
                  >
                    <View style={styles.stepNumber}>
                      <Text style={styles.stepNumberText}>{index + 1}</Text>
                    </View>
                    <Text style={styles.stepText}>{step.trim()}</Text>
                  </Animated.View>
                ))}
              </View>
            </Animated.View>
          </>
        )}
      </ScrollView>

      {/* Bottom Action Button */}
      {!isLoading && (
        <Animated.View 
          entering={FadeInDown.delay(700).duration(500)}
          style={styles.bottomAction}
        >
          <TouchableOpacity style={styles.startCookingButton} activeOpacity={0.9}>
            <LinearGradient
              colors={['#F59E0B', '#F97316']}
              style={styles.startCookingGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Icon name="flame" size={hp(2.5)} color="#fff" />
              <Text style={styles.startCookingText}>Start Cooking</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Full Screen Video Modal */}
      <Modal
        visible={showVideo || showFullScreenVideo}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => {
          setShowVideo(false);
          setShowFullScreenVideo(false);
          setIsPlaying(false);
        }}
      >
        <View style={styles.modalContainer}>
          <StatusBar style="light" />
          
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              onPress={() => {
                setShowVideo(false);
                setShowFullScreenVideo(false);
                setIsPlaying(false);
              }}
              style={styles.modalCloseButton}
            >
              <Icon name="close" size={hp(3)} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.modalTitle} numberOfLines={1}>{meals?.strMeal}</Text>
            <View style={{ width: hp(5) }} />
          </View>

          {/* Video Player */}
          <View style={styles.modalVideoContainer}>
            {videoId && (
              <YoutubeIframe
                height={hp(30)}
                width={width}
                videoId={videoId}
                play={showVideo || showFullScreenVideo}
                onChangeState={onStateChange}
                webViewProps={{
                  allowsInlineMediaPlayback: true,
                }}
              />
            )}
          </View>

          {/* Video Info */}
          <View style={styles.modalInfo}>
            <View style={styles.modalInfoRow}>
              <View style={styles.modalBadge}>
                <Icon name="restaurant-outline" size={hp(2)} color="#fff" />
                <Text style={styles.modalBadgeText}>{meals?.strCategory}</Text>
              </View>
              <View style={styles.modalBadge}>
                <Icon name="location-outline" size={hp(2)} color="#fff" />
                <Text style={styles.modalBadgeText}>{meals?.strArea}</Text>
              </View>
            </View>
            
            <Text style={styles.modalDescription}>
              Watch this step-by-step video tutorial to learn how to make {meals?.strMeal}. 
              Follow along with the chef and create this delicious dish at home!
            </Text>

            {/* Quick Actions */}
            <View style={styles.quickActions}>
              <TouchableOpacity style={styles.quickActionButton}>
                <Icon name="bookmark-outline" size={hp(2.5)} color="#fff" />
                <Text style={styles.quickActionText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickActionButton}>
                <Icon name="share-social-outline" size={hp(2.5)} color="#fff" />
                <Text style={styles.quickActionText}>Share</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.quickActionButton}
                onPress={() => {
                  setShowVideo(false);
                  setShowFullScreenVideo(false);
                }}
              >
                <Icon name="book-outline" size={hp(2.5)} color="#fff" />
                <Text style={styles.quickActionText}>Recipe</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  imageContainer: {
    width: '100%',
    height: hp(45),
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  playButtonOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonCircle: {
    width: hp(8),
    height: hp(8),
    borderRadius: hp(4),
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(1),
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  playButtonText: {
    color: '#fff',
    fontSize: hp(1.8),
    fontWeight: '700',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  headerContainer: {
    position: 'absolute',
    top: hp(6),
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: wp(5),
    zIndex: 10,
  },
  headerButton: {
    width: hp(5.5),
    height: hp(5.5),
    backgroundColor: '#fff',
    borderRadius: hp(2),
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  favoriteActive: {
    backgroundColor: '#EF4444',
  },
  contentContainer: {
    flex: 1,
    marginTop: -hp(5),
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: '#F9FAFB',
    paddingTop: hp(3),
  },
  loadingContainer: {
    height: hp(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleSection: {
    paddingHorizontal: wp(5),
    marginBottom: hp(2),
  },
  mealTitle: {
    fontSize: hp(3.2),
    fontWeight: '800',
    color: '#1F2937',
    letterSpacing: -0.5,
    marginBottom: hp(1.2),
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(3),
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.8),
    borderRadius: 20,
    gap: wp(1.5),
  },
  categoryText: {
    fontSize: hp(1.6),
    fontWeight: '600',
    color: '#6366F1',
  },
  areaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FCE7F3',
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.8),
    borderRadius: 20,
    gap: wp(1.5),
  },
  areaText: {
    fontSize: hp(1.6),
    fontWeight: '600',
    color: '#EC4899',
  },
  infoCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: wp(5),
    marginBottom: hp(3),
  },
  infoCard: {
    width: (width - wp(14)) / 4,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: hp(1.8),
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  infoIconContainer: {
    width: hp(5),
    height: hp(5),
    borderRadius: hp(1.5),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(1),
  },
  infoValue: {
    fontSize: hp(1.6),
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: hp(0.3),
  },
  infoLabel: {
    fontSize: hp(1.3),
    fontWeight: '500',
    color: '#9CA3AF',
  },
  section: {
    paddingHorizontal: wp(5),
    marginBottom: hp(2.5),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(2),
  },
  sectionTitle: {
    fontSize: hp(2.4),
    fontWeight: '700',
    color: '#1F2937',
  },
  fullscreenButton: {
    padding: hp(1),
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
  },
  videoContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#000',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  ingredientCount: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.5),
    borderRadius: 12,
  },
  ingredientCountText: {
    fontSize: hp(1.4),
    fontWeight: '600',
    color: '#6B7280',
  },
  ingredientsList: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: wp(4),
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(1.5),
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  ingredientDot: {
    width: hp(1),
    height: hp(1),
    borderRadius: hp(0.5),
    backgroundColor: '#F59E0B',
    marginRight: wp(3),
  },
  ingredientInfo: {
    flex: 1,
  },
  ingredientName: {
    fontSize: hp(1.8),
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: hp(0.3),
  },
  ingredientMeasure: {
    fontSize: hp(1.5),
    fontWeight: '500',
    color: '#9CA3AF',
  },
  checkButton: {
    padding: wp(2),
  },
  instructionsContainer: {
    gap: hp(2),
  },
  instructionStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    padding: wp(4),
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  stepNumber: {
    width: hp(3.5),
    height: hp(3.5),
    borderRadius: hp(1),
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(3),
  },
  stepNumberText: {
    fontSize: hp(1.6),
    fontWeight: '700',
    color: '#F59E0B',
  },
  stepText: {
    flex: 1,
    fontSize: hp(1.7),
    fontWeight: '500',
    color: '#4B5563',
    lineHeight: hp(2.6),
  },
  bottomAction: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: wp(5),
    paddingTop: hp(1.5),
    paddingBottom: hp(4),
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  startCookingButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  startCookingGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(2.2),
    gap: wp(2),
  },
  startCookingText: {
    fontSize: hp(2),
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#0F0F0F',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: hp(6),
    paddingHorizontal: wp(5),
    paddingBottom: hp(2),
  },
  modalCloseButton: {
    width: hp(5),
    height: hp(5),
    borderRadius: hp(2.5),
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    flex: 1,
    fontSize: hp(2.2),
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginHorizontal: wp(3),
  },
  modalVideoContainer: {
    width: '100%',
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalInfo: {
    flex: 1,
    paddingHorizontal: wp(5),
    paddingTop: hp(3),
  },
  modalInfoRow: {
    flexDirection: 'row',
    gap: wp(3),
    marginBottom: hp(2),
  },
  modalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
    borderRadius: 25,
    gap: wp(2),
  },
  modalBadgeText: {
    fontSize: hp(1.7),
    fontWeight: '600',
    color: '#fff',
  },
  modalDescription: {
    fontSize: hp(1.8),
    fontWeight: '400',
    color: 'rgba(255,255,255,0.7)',
    lineHeight: hp(2.8),
    marginBottom: hp(4),
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: hp(2),
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  quickActionButton: {
    alignItems: 'center',
    gap: hp(0.8),
  },
  quickActionText: {
    fontSize: hp(1.5),
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
  },
})