// components/Categories.tsx
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';

export default function Categories({
  categories,
  activeCategory,
  handleChangeCategory,
}: {
  categories?: any[];
  activeCategory: string | null;
  handleChangeCategory: (category: string | null) => void;
}) {
  // Special categories that appear first
  const specialCategories = [
    {
      idCategory: 'favorites',
      strCategory: 'Favorites',
      icon: 'heart',
      color: '#EF4444',
      bgColor: '#FEE2E2',
    },
    {
      idCategory: 'my-food',
      strCategory: 'My Food',
      icon: 'person',
      color: '#8B5CF6',
      bgColor: '#EDE9FE',
    },
  ];

  return (
    <Animated.View
      entering={FadeInDown.duration(500).springify()}
      style={styles.container}
    >
      <ScrollView
        showsHorizontalScrollIndicator={false}
        horizontal
        contentContainerStyle={styles.scrollContent}
      >
        {/* Special Categories (Favorites & My Food) */}
        {specialCategories.map((category, index) => {
          const isActive = category.strCategory === activeCategory;

          return (
            <Animated.View
              key={category.idCategory}
              entering={FadeInDown.delay(index * 100).springify()}
            >
              <TouchableOpacity
                onPress={() => handleChangeCategory(category.strCategory)}
                activeOpacity={0.8}
              >
                <View style={styles.categoryItem}>
                  <View
                    style={[
                      styles.specialCategoryCircle,
                      {
                        backgroundColor: category.bgColor,
                        borderWidth: isActive ? 3 : 0,
                        borderColor: isActive ? category.color : 'transparent',
                      },
                    ]}
                  >
                    <Icon
                      name={isActive ? category.icon : `${category.icon}-outline`}
                      size={hp(4)}
                      color={category.color}
                    />
                  </View>
                  <Text
                    style={[
                      styles.categoryText,
                      isActive && { color: category.color, fontWeight: '700' },
                    ]}
                  >
                    {category.strCategory}
                  </Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          );
        })}

        {/* Divider */}
        <View style={styles.divider} />

        {/* Regular Categories from API */}
        {categories?.map((category, index) => {
          const isActive = category.strCategory === activeCategory;

          return (
            <Animated.View
              key={category.idCategory}
              entering={FadeInDown.delay((index + 2) * 100).springify()}
            >
              <TouchableOpacity
                onPress={() => handleChangeCategory(category.strCategory)}
                activeOpacity={0.8}
              >
                <View style={styles.categoryItem}>
                  <View
                    style={[
                      styles.categoryCircle,
                      {
                        borderWidth: isActive ? 3 : 0,
                        borderColor: isActive ? '#F59E0B' : 'transparent',
                      },
                    ]}
                  >
                    <Image
                      source={{ uri: category.strCategoryThumb }}
                      style={styles.categoryImage}
                    />
                  </View>
                  <Text
                    style={[
                      styles.categoryText,
                      isActive && { color: '#F59E0B', fontWeight: '700' },
                    ]}
                  >
                    {category.strCategory}
                  </Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: hp(2),
  },
  scrollContent: {
    gap: wp(3),
    paddingHorizontal: wp(4),
    alignItems: 'center',
  },
  categoryItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: hp(0.8),
  },
  categoryCircle: {
    width: hp(9),
    height: hp(9),
    borderRadius: hp(4.5),
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  specialCategoryCircle: {
    width: hp(9),
    height: hp(9),
    borderRadius: hp(4.5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryImage: {
    width: hp(8),
    height: hp(8),
    borderRadius: hp(4),
  },
  categoryText: {
    fontSize: hp(1.5),
    fontWeight: '500',
    color: '#4B5563',
    maxWidth: hp(10),
    textAlign: 'center',
  },
  divider: {
    width: 1,
    height: hp(6),
    backgroundColor: '#E5E7EB',
    marginHorizontal: wp(1),
  },
});