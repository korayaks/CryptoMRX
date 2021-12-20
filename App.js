import React, { useRef, useMemo, useState, useEffect } from 'react';
import { FlatList, StyleSheet, Text, View, SafeAreaView, RefreshControl } from 'react-native';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export default function App() {            //Uygulamada sadece iki farklı sayfa var. İlki giriş ve kayıt ekranı diğeri ise kripto paraların durumunu görebildiğimiz sayfa.
const Stack = createNativeStackNavigator();//native-stack sayesinde bu iki sayfa arasında geçiş yapabiliyorum. Aşağıda da görebileceğiniz gibi iki farklı screen var birisi
  return (                                 //Login screen diğeri ise Home. Login olan kayıt ve giriş sayfası, home ise uygulamamın ana sayfası yani kripto paraların görüldüğü sayfa.            
    <NavigationContainer>                 
      <Stack.Navigator
       screenOptions={{
        headerShown: false
      }}>
        <Stack.Screen options={{ headerShown: false }} name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  titleWrapper: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  largeTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#A9ABB1',
    marginHorizontal: 16,
    marginTop: 16,
  },
  bottomSheet: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
