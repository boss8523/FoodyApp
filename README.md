# 🍳 RecipeApp
<img width="591" height="1280" alt="image" src="https://github.com/user-attachments/assets/bc86b8e0-9c5c-4b29-a72c-0fe49ccb756c" />
![photo_2025-12-15_23-16-42](https://github.com/user-attachments/assets/496a4d20-bd8a-45df-9e74-3585f778e72f)


A beautiful, feature-rich recipe application built with React Native and Expo. Discover delicious meals from around the world, save your favorites, and create your own personal cookbook.



## ✨ Features

### 🔍 Discover Recipes
- Browse recipes by categories (Beef, Chicken, Dessert, Seafood, Vegetarian, and more)
- Search for specific recipes by name
- View detailed recipe information including ingredients and step-by-step instructions
- Beautiful masonry grid layout for recipe browsing

### ❤️ Favorites
- Save your favorite recipes with one tap
- Quick access to all saved recipes
- Persistent storage - your favorites are saved locally

### 👨‍🍳 My Food - Personal Cookbook
- Create and publish your own recipes
- Upload photos of your dishes (camera or gallery)
- Add custom ingredients with measurements
- Write step-by-step cooking instructions
- Set preparation time, servings, and difficulty level

### 🎥 Video Tutorials
- Watch YouTube cooking tutorials directly in the app
- Fullscreen video player with controls

### 🎨 Beautiful UI/UX
- Modern, clean interface with smooth animations
- Responsive design for all screen sizes
- Platform-specific styling (iOS & Android)

## 🛠️ Tech Stack

- **React Native** - Cross-platform mobile framework
- **Expo** - Development platform
- **TypeScript** - Type-safe JavaScript
- **React Navigation** - Screen navigation
- **React Native Reanimated** - Animations
- **AsyncStorage** - Local data persistence
- **Axios** - API requests
- **TheMealDB API** - Recipe data source

## 📦 Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/recipe-app.git
   cd recipe-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Expo dependencies**
   ```bash
   npx expo install expo-linear-gradient expo-image-picker @react-native-async-storage/async-storage react-native-reanimated react-native-youtube-iframe react-native-webview react-native-responsive-screen
   ```

4. **Configure Reanimated** - Add to `babel.config.js`:
   ```javascript
   module.exports = function(api) {
     api.cache(true);
     return {
       presets: ['babel-preset-expo'],
       plugins: ['react-native-reanimated/plugin'],
     };
   };
   ```

5. **Start the app**
   ```bash
   npx expo start
   ```

6. **Run on device**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app

## 📁 Project Structure

```
recipe-app/
├── assets/images/
├── components/
│   ├── Categories.tsx
│   ├── Recipes.tsx
│   └── Loading.tsx
├── screens/
│   ├── HomeScreen.tsx
│   ├── RecipeScreen.tsx
│   ├── FavoritesScreen.tsx
│   ├── MyFoodScreen.tsx
│   └── AddRecipeScreen.tsx
├── constants/
├── navigation/
├── App.tsx
└── package.json
```

## 🔗 API

Uses [TheMealDB API](https://www.themealdb.com/api.php) for recipe data.

| Endpoint | Description |
|----------|-------------|
| `/categories.php` | List all categories |
| `/filter.php?c={category}` | Filter by category |
| `/lookup.php?i={id}` | Get meal details |
| `/search.php?s={name}` | Search meals |

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [TheMealDB](https://www.themealdb.com/) - Recipe API
- [Expo](https://expo.dev/) - Development platform
- Original project creators and contributors

---

⭐ If you found this project helpful, please give it a star!
