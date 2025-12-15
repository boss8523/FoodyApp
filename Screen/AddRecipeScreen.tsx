// screens/AddRecipeScreen.tsx
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import React from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CustomRecipe } from './MyFoodScreen';

interface AddRecipeScreenProps {
  navigation: any;
  onRecipeAdded?: () => void;
}

export default function AddRecipeScreen({ navigation, onRecipeAdded }: AddRecipeScreenProps) {
  const [image, setImage] = React.useState<string | null>(null);
  const [recipeName, setRecipeName] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [cuisine, setCuisine] = React.useState('');
  const [prepTime, setPrepTime] = React.useState('');
  const [servings, setServings] = React.useState('');
  const [difficulty, setDifficulty] = React.useState('Easy');
  const [ingredients, setIngredients] = React.useState<{ ingredient: string; measure: string }[]>([
    { ingredient: '', measure: '' },
  ]);
  const [instructions, setInstructions] = React.useState<string[]>(['']);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const difficulties = ['Easy', 'Medium', 'Hard'];
  const categories = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Beverage'];

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions to upload images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera permissions to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      'Add Photo',
      'Choose how to add your dish photo',
      [
        { text: 'Take Photo', onPress: takePhoto },
        { text: 'Choose from Library', onPress: pickImage },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { ingredient: '', measure: '' }]);
  };

  const updateIngredient = (index: number, field: 'ingredient' | 'measure', value: string) => {
    const updated = [...ingredients];
    updated[index][field] = value;
    setIngredients(updated);
  };

  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };

  const addInstruction = () => {
    setInstructions([...instructions, '']);
  };

  const updateInstruction = (index: number, value: string) => {
    const updated = [...instructions];
    updated[index] = value;
    setInstructions(updated);
  };

  const removeInstruction = (index: number) => {
    if (instructions.length > 1) {
      setInstructions(instructions.filter((_, i) => i !== index));
    }
  };

  const validateForm = () => {
    if (!image) {
      Alert.alert('Missing Image', 'Please add a photo of your dish.');
      return false;
    }
    if (!recipeName.trim()) {
      Alert.alert('Missing Name', 'Please enter a recipe name.');
      return false;
    }
    if (!category) {
      Alert.alert('Missing Category', 'Please select a category.');
      return false;
    }
    if (ingredients.filter((i) => i.ingredient.trim()).length === 0) {
      Alert.alert('Missing Ingredients', 'Please add at least one ingredient.');
      return false;
    }
    if (instructions.filter((i) => i.trim()).length === 0) {
      Alert.alert('Missing Instructions', 'Please add at least one instruction step.');
      return false;
    }
    return true;
  };

  const saveRecipe = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const newRecipe: CustomRecipe = {
        id: Date.now().toString(),
        name: recipeName.trim(),
        image: image!,
        category,
        cuisine: cuisine.trim() || 'Homemade',
        prepTime: prepTime.trim() || '30 min',
        servings: servings.trim() || '4',
        difficulty,
        ingredients: ingredients.filter((i) => i.ingredient.trim()),
        instructions: instructions.filter((i) => i.trim()),
        createdAt: new Date().toISOString(),
      };

      // Get existing recipes
      const stored = await AsyncStorage.getItem('myRecipes');
      const existing: CustomRecipe[] = stored ? JSON.parse(stored) : [];
      
      // Add new recipe
      const updated = [newRecipe, ...existing];
      await AsyncStorage.setItem('myRecipes', JSON.stringify(updated));

      Alert.alert(
        'Recipe Saved! 🎉',
        'Your recipe has been added to My Food collection.',
        [
          {
            text: 'Great!',
            onPress: () => {
              if (onRecipeAdded) onRecipeAdded();
              navigation.goBack();
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error saving recipe:', error);
      Alert.alert('Error', 'Failed to save recipe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <Animated.View
        entering={FadeIn.duration(500)}
        style={styles.header}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="close" size={hp(3)} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Recipe</Text>
        <TouchableOpacity
          onPress={saveRecipe}
          disabled={isSubmitting}
          style={styles.saveButton}
        >
          <Text style={[styles.saveButtonText, isSubmitting && { opacity: 0.5 }]}>
            {isSubmitting ? 'Saving...' : 'Publish'}
          </Text>
        </TouchableOpacity>
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Image Upload Section */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(500)}
          style={styles.section}
        >
          <TouchableOpacity
            onPress={showImageOptions}
            style={styles.imageUpload}
            activeOpacity={0.8}
          >
            {image ? (
              <>
                <Image source={{ uri: image }} style={styles.uploadedImage} />
                <View style={styles.changeImageOverlay}>
                  <Icon name="camera" size={hp(3)} color="#fff" />
                  <Text style={styles.changeImageText}>Change Photo</Text>
                </View>
              </>
            ) : (
              <View style={styles.uploadPlaceholder}>
                <View style={styles.uploadIconContainer}>
                  <Icon name="camera-outline" size={hp(5)} color="#8B5CF6" />
                </View>
                <Text style={styles.uploadTitle}>Add a Photo</Text>
                <Text style={styles.uploadSubtitle}>
                  Tap to upload or take a photo of your dish
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </Animated.View>

        {/* Basic Info Section */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(500)}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>Basic Info</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Recipe Name *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g., Grandma's Apple Pie"
              placeholderTextColor="#9CA3AF"
              value={recipeName}
              onChangeText={setRecipeName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Category *</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryPills}
            >
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setCategory(cat)}
                  style={[
                    styles.categoryPill,
                    category === cat && styles.categoryPillActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryPillText,
                      category === cat && styles.categoryPillTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Cuisine (Optional)</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g., Italian, Mexican, Asian"
              placeholderTextColor="#9CA3AF"
              value={cuisine}
              onChangeText={setCuisine}
            />
          </View>

          <View style={styles.rowInputs}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.inputLabel}>Prep Time</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g., 30 min"
                placeholderTextColor="#9CA3AF"
                value={prepTime}
                onChangeText={setPrepTime}
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.inputLabel}>Servings</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g., 4"
                placeholderTextColor="#9CA3AF"
                value={servings}
                onChangeText={setServings}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Difficulty</Text>
            <View style={styles.difficultyContainer}>
              {difficulties.map((diff) => (
                <TouchableOpacity
                  key={diff}
                  onPress={() => setDifficulty(diff)}
                  style={[
                    styles.difficultyOption,
                    difficulty === diff && styles.difficultyOptionActive,
                  ]}
                >
                  <Icon
                    name={
                      diff === 'Easy'
                        ? 'leaf-outline'
                        : diff === 'Medium'
                        ? 'flame-outline'
                        : 'flash-outline'
                    }
                    size={hp(2.5)}
                    color={difficulty === diff ? '#fff' : '#6B7280'}
                  />
                  <Text
                    style={[
                      styles.difficultyText,
                      difficulty === diff && styles.difficultyTextActive,
                    ]}
                  >
                    {diff}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Animated.View>

        {/* Ingredients Section */}
        <Animated.View
          entering={FadeInDown.delay(300).duration(500)}
          style={styles.section}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            <TouchableOpacity onPress={addIngredient} style={styles.addItemButton}>
              <Icon name="add-circle" size={hp(3)} color="#8B5CF6" />
            </TouchableOpacity>
          </View>

          {ingredients.map((item, index) => (
            <View key={index} style={styles.ingredientRow}>
              <View style={styles.ingredientNumber}>
                <Text style={styles.ingredientNumberText}>{index + 1}</Text>
              </View>
              <TextInput
                style={[styles.textInput, { flex: 2 }]}
                placeholder="Ingredient"
                placeholderTextColor="#9CA3AF"
                value={item.ingredient}
                onChangeText={(text) => updateIngredient(index, 'ingredient', text)}
              />
              <TextInput
                style={[styles.textInput, { flex: 1 }]}
                placeholder="Amount"
                placeholderTextColor="#9CA3AF"
                value={item.measure}
                onChangeText={(text) => updateIngredient(index, 'measure', text)}
              />
              {ingredients.length > 1 && (
                <TouchableOpacity
                  onPress={() => removeIngredient(index)}
                  style={styles.removeButton}
                >
                  <Icon name="close-circle" size={hp(2.5)} color="#EF4444" />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </Animated.View>

        {/* Instructions Section */}
        <Animated.View
          entering={FadeInDown.delay(400).duration(500)}
          style={styles.section}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Instructions</Text>
            <TouchableOpacity onPress={addInstruction} style={styles.addItemButton}>
              <Icon name="add-circle" size={hp(3)} color="#8B5CF6" />
            </TouchableOpacity>
          </View>

          {instructions.map((step, index) => (
            <View key={index} style={styles.instructionRow}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <TextInput
                style={[styles.textInput, styles.instructionInput]}
                placeholder={`Step ${index + 1}...`}
                placeholderTextColor="#9CA3AF"
                value={step}
                onChangeText={(text) => updateInstruction(index, text)}
                multiline
                textAlignVertical="top"
              />
              {instructions.length > 1 && (
                <TouchableOpacity
                  onPress={() => removeInstruction(index)}
                  style={styles.removeButton}
                >
                  <Icon name="close-circle" size={hp(2.5)} color="#EF4444" />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </Animated.View>

        {/* Publish Button */}
        <Animated.View
          entering={FadeInDown.delay(500).duration(500)}
          style={styles.publishSection}
        >
          <TouchableOpacity
            onPress={saveRecipe}
            disabled={isSubmitting}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['#8B5CF6', '#7C3AED']}
              style={styles.publishButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Icon name="checkmark-circle" size={hp(2.8)} color="#fff" />
              <Text style={styles.publishButtonText}>
                {isSubmitting ? 'Publishing...' : 'Publish Recipe'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(5),
    paddingTop: hp(6),
    paddingBottom: hp(2),
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    width: hp(5),
    height: hp(5),
    borderRadius: hp(2.5),
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: hp(2.2),
    fontWeight: '700',
    color: '#1F2937',
  },
  saveButton: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
  },
  saveButtonText: {
    fontSize: hp(1.8),
    fontWeight: '700',
    color: '#8B5CF6',
  },
  scrollContent: {
    paddingBottom: hp(5),
  },
  section: {
    backgroundColor: '#fff',
    marginTop: hp(2),
    paddingHorizontal: wp(5),
    paddingVertical: hp(2.5),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(2),
  },
  sectionTitle: {
    fontSize: hp(2.2),
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: hp(2),
  },
  imageUpload: {
    width: '100%',
    height: hp(25),
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
  },
  changeImageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(1.5),
    gap: wp(2),
  },
  changeImageText: {
    color: '#fff',
    fontSize: hp(1.6),
    fontWeight: '600',
  },
  uploadPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadIconContainer: {
    width: hp(10),
    height: hp(10),
    borderRadius: hp(5),
    backgroundColor: '#EDE9FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(2),
  },
  uploadTitle: {
    fontSize: hp(2),
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: hp(0.5),
  },
  uploadSubtitle: {
    fontSize: hp(1.5),
    color: '#6B7280',
  },
  inputGroup: {
    marginBottom: hp(2),
  },
  inputLabel: {
    fontSize: hp(1.6),
    fontWeight: '600',
    color: '#374151',
    marginBottom: hp(1),
  },
  textInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    fontSize: hp(1.7),
    color: '#1F2937',
  },
  categoryPills: {
    gap: wp(2),
  },
  categoryPill: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryPillActive: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  categoryPillText: {
    fontSize: hp(1.5),
    fontWeight: '600',
    color: '#6B7280',
  },
  categoryPillTextActive: {
    color: '#fff',
  },
  rowInputs: {
    flexDirection: 'row',
    gap: wp(3),
  },
  difficultyContainer: {
    flexDirection: 'row',
    gap: wp(3),
  },
  difficultyOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(1.5),
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    gap: wp(2),
  },
  difficultyOptionActive: {
    backgroundColor: '#8B5CF6',
  },
  difficultyText: {
    fontSize: hp(1.5),
    fontWeight: '600',
    color: '#6B7280',
  },
  difficultyTextActive: {
    color: '#fff',
  },
  addItemButton: {
    padding: hp(0.5),
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2),
    marginBottom: hp(1.5),
  },
  ingredientNumber: {
    width: hp(3.5),
    height: hp(3.5),
    borderRadius: hp(1),
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ingredientNumberText: {
    fontSize: hp(1.4),
    fontWeight: '700',
    color: '#F59E0B',
  },
  removeButton: {
    padding: hp(0.5),
  },
  instructionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: wp(2),
    marginBottom: hp(1.5),
  },
  stepNumber: {
    width: hp(3.5),
    height: hp(3.5),
    borderRadius: hp(1),
    backgroundColor: '#EDE9FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(1),
  },
  stepNumberText: {
    fontSize: hp(1.4),
    fontWeight: '700',
    color: '#8B5CF6',
  },
  instructionInput: {
    flex: 1,
    minHeight: hp(10),
    paddingTop: hp(1.5),
  },
  publishSection: {
    paddingHorizontal: wp(5),
    paddingTop: hp(3),
  },
  publishButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(2.2),
    borderRadius: 16,
    gap: wp(2),
  },
  publishButtonText: {
    fontSize: hp(2),
    fontWeight: '700',
    color: '#fff',
  },
});