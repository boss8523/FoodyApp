import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import {createNativeStackNavigator} from '@react-navigation/native-stack' // {createNativeStackNavigator}

import HomeScreen from '../Screen/HomeScreen'
import WelcomeScreen from '@/Screen/WelcomeScreen';
import recipeScreen from '@/Screen/recipeScreen';
import AddRecipeScreen from '@/Screen/AddRecipeScreen';
import MyFoodScreen from '@/Screen/MyFoodScreen';
import FavoritesScreen from '@/Screen/FavoritesScreen';
export default function index() {
    const Stack=createNativeStackNavigator();
  return (
    <Stack.Navigator initialRouteName='Welcome' screenOptions={{headerShown:false}}>
        <Stack.Screen name="Home" component={HomeScreen}/>
    <Stack.Screen name="Welcome" component={WelcomeScreen}/>
    <Stack.Screen name="Recipe" component={recipeScreen}/>
    <Stack.Screen name="FavoritesScreen" component={FavoritesScreen}/>
    <Stack.Screen name="MyFoodScreen" component={MyFoodScreen}/>
    <Stack.Screen name="AddRecipeScreen" component={AddRecipeScreen}/>
    </Stack.Navigator>
  )
}

const styles = StyleSheet.create({})