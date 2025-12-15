import React from 'react';
import { Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated from 'react-native-reanimated';

export const CachedImage = (props: any) => {
  const [cachedSource, setCachedSource] = React.useState<any>(null);
  const { uri } = props;

  React.useEffect(() => {
    const getCachedImage = async () => {
      try {
        const cachedImageData = await AsyncStorage.getItem(uri);

        if (cachedImageData) {
          // Load from cache
          setCachedSource({ uri: cachedImageData });
        } else {
          // Download image
          const response = await fetch(uri);
          const blob = await response.blob();

          // Convert blob → base64
          const base64Data: any = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });

          // Save to cache
          await AsyncStorage.setItem(uri, base64Data);

          // Update state
          setCachedSource({ uri: base64Data });
        }
      } catch (error) {
        console.error('Error caching image:', error);
      }
    };

    getCachedImage();
  }, [uri]);

  // While loading, return nothing or a placeholder
  if (!cachedSource) return null;

  return <Animated.Image {...props} source={cachedSource} />;
};