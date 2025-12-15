# 🍳 RecipeApp
<img width="200" height="400" alt="image" src="https://github.com/user-attachments/assets/bc86b8e0-9c5c-4b29-a72c-0fe49ccb756c" />
<img width="591" height="1280" alt="image" src="https://github.com/user-attachments/assets/ed91964f-dbb6-4479-8cf2-812172de37de" />
<img width="591" height="1280" alt="image" src="https://github.com/user-attachments/assets/b4a26454-793a-48bf-bc8e-86336c1f7a9c" />
<img width="591" height="1280" alt="image" src="https://github.com/user-attachments/assets/d5fc21d7-1298-40d6-8177-1bbebc9aa1dc" />
<img width="591" height="1280" alt="image" src="https://github.com/user-attachments/assets/5aba0f11-447c-4848-a005-e6bd68054c56" />
<img width="591" height="1280" alt="image" src="https://github.com/user-attachments/assets/792273fc-480c-4df4-9588-7f906d84cdfc" />
<img width="591" height="1280" alt="image" src="https://github.com/user-attachments/assets/a2aba149-5a9f-471b-9b3b-601578b76f4c" />
<img width="591" height="1280" alt="image" src="https://github.com/user-attachments/assets/f1821d8d-78ca-41fb-bad3-115d28cc4611" />
<img width="591" height="1280" alt="image" src="https://github.com/user-attachments/assets/468bc3cd-999d-46cb-ab2c-a5c3cf49dbca" />
<img width="591" height="1280" alt="image" src="https://github.com/user-attachments/assets/f35afe73-95d7-4d9d-9bb7-6d367cea4aeb" />
<img width="591" height="1280" alt="image" src="https://github.com/user-attachments/assets/b45e47c0-7b06-4ee0-8c02-7dab4afa2f94" />
<img width="591" height="1280" alt="image" src="https://github.com/user-attachments/assets/4637c680-5792-4ea2-9d45-b91b17e91743" />
<img width="591" height="1280" alt="image" src="https://github.com/user-attachments/assets/c06f5e9e-9be2-459a-afb4-ceaef8d438b6" />
<img width="591" height="1280" alt="image" src="https://github.com/user-attachments/assets/5bbfe23c-a795-421c-9212-47eb75752d51" />




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
