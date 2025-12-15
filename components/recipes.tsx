import { Image, Pressable, StyleSheet, Text, View, Platform } from 'react-native'
import React from 'react'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import MasonryList from '@react-native-seoul/masonry-list';
import { categoriesWithImages, MealType } from '@/constants/categoriesData';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Loading from './loading';
import { CachedImage } from '@/helpers/image';
import { useNavigation } from '@react-navigation/native';

export default function Recipes({meals,categories}: {meals?: any[], categories?: any[]}) {
  const Navigation=useNavigation();
    return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <Text style={styles.RecipeText}>Recipes</Text>
        <Text style={styles.subtitleText}>Discover delicious meals</Text>
      </View>

      {/* Masonry Grid */}
      
      {
        
        categories?.length ==0 || meals?.length ==0 ? (
            <Loading />
        )
        :(
        <MasonryList
        data={meals}
        keyExtractor={(item): string => item.idMeal}
        renderItem={({ item, i }) => <CardItem item={item} index={i} Navigation={Navigation}/>}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        onEndReachedThreshold={0.1}
      />)
      }
    </View>
  )
}

const CardItem = ({ item, index ,Navigation}: { item: MealType; index: number ; Navigation: any}) => {
  const isEven = index % 2 === 0;
  
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 100).duration(600).springify()}
      style={[
        styles.cardContainer,
        {
          marginRight: isEven ? hp(0.8) : 0,
          marginLeft: !isEven ? hp(0.8) : 0,
        }
      ]}
    >
      <Pressable
        style={({ pressed }) => [
          styles.cardPressable,
          pressed && styles.cardPressed
          
        ]}
        onPress={() => {
            Navigation.navigate('Recipe' as never, { ...item } as never);
        }}
      >
        {/* Image Container */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.strMealThumb }}
            style={[
              styles.cardImage,
              { height: index % 3 === 0 ? hp(25) : hp(35) }
            ]}
          />
          {/* <CachedImage
          uri={{ uri: item.strMealThumb }}
            style={[
              styles.cardImage,
              { height: index % 3 === 0 ? hp(25) : hp(35) }
            ]}
            /> */}
          
          {/* Gradient Overlay */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.gradient}
          />
          
          {/* Category Badge */}
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Popular</Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {item.strMeal}
          </Text>
          
          {/* Optional: Add rating or time */}
          <View style={styles.cardMeta}>
            <View style={styles.ratingContainer}>
              <Text style={styles.starIcon}>★</Text>
              <Text style={styles.ratingText}>4.5</Text>
            </View>
            <Text style={styles.timeText}>25 min</Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  headerContainer: {
    paddingHorizontal: hp(2),
    paddingTop: hp(2),
    paddingBottom: hp(1.5),
  },
  RecipeText: {
    fontSize: hp(3.5),
    fontWeight: '800',
    color: '#1a1a2e',
    letterSpacing: -0.5,
  },
  subtitleText: {
    fontSize: hp(1.8),
    color: '#6b7280',
    marginTop: hp(0.5),
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: hp(2),
    paddingBottom: hp(10),
  },
  cardContainer: {
    marginBottom: hp(1.6),
    borderRadius: 20,
    backgroundColor: '#ffffff',
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
  cardPressable: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  imageContainer: {
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: hp(10),
  },
  badge: {
    position: 'absolute',
    top: hp(1.2),
    left: hp(1.2),
    backgroundColor: '#FF6B6B',
    paddingHorizontal: hp(1.2),
    paddingVertical: hp(0.5),
    borderRadius: 20,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: hp(1.3),
    fontWeight: '700',
  },
  cardContent: {
    padding: hp(1.5),
  },
  cardTitle: {
    fontSize: hp(1.9),
    fontWeight: '700',
    color: '#1a1a2e',
    lineHeight: hp(2.4),
  },
  cardMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp(1),
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    color: '#FFB800',
    fontSize: hp(1.6),
    marginRight: 4,
  },
  ratingText: {
    fontSize: hp(1.5),
    color: '#4b5563',
    fontWeight: '600',
  },
  timeText: {
    fontSize: hp(1.4),
    color: '#9ca3af',
    fontWeight: '500',
  },
})