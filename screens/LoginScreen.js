import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native'
import { auth } from '../firebase'

const LoginScreen = () => {// Firebase kütüphanesi kayıt ve giriş işlemlerinde oldukça yardımcı oluyor. 
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigation = useNavigation()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {//Kullıcının rolü user olduğunda Home sayfasına yani kripto paraların olduğu sayfaya yönlendirilir.
        navigation.replace("Home")
      }
    })

    return unsubscribe
  }, [])

  const handleSignUp = () => {//Kayıt işlemi
    auth
      .createUserWithEmailAndPassword(email, password)//Girilen email ve şifre ile kayıt işlemi yapılır
      .then(userCredentials => {
        const user = userCredentials.user;     //kullanıcıya user rolü verilir
      })
      .catch(error => alert(error.message)) //herhangi bir hata varsa kullanıcı bilgilendirilir.
  }

  const handleLogin = () => {//Giriş işlemi
    auth
      .signInWithEmailAndPassword(email, password)//Girilen email ve şifre ile giriş işlemi yapılır
      .then(userCredentials => {
        const user = userCredentials.user;       //kullanıcıya user rolü verilir
      })
      .catch(error => alert(error.message))     //herhangi bir hata varsa kullanıcı bilgilendirilir.
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
    >
      <Image source={require('../assets/logo.png')} style={styles.image}/>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={text => setEmail(text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={text => setPassword(text)}
          style={styles.input}
          secureTextEntry
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleLogin}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSignUp}
          style={[styles.button, styles.buttonOutline]}
        >
          <Text style={styles.buttonOutlineText}>Register</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#181818'
  },
  inputContainer: {
    width: '80%',
    marginTop: 30
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginTop: 5,
    fontSize: 16,
  },
  buttonContainer: {
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  button: {
    backgroundColor: '#00ff8c',
    width: '100%',
    padding: 15,
    alignItems: 'center',
  },
  buttonOutline: {
    backgroundColor: 'black',
    marginTop: 5,
    borderColor: '#00ff8c',
    borderWidth: 1,
  },
  buttonText: {
    color: 'black',
    fontWeight: '700',
    fontSize: 16,
  },
  buttonOutlineText: {
    color: '#00ff8c',
    fontWeight: '700',
    fontSize: 16,
  },
  image:{
    width:250,
    height: 250,
    marginTop: -50
  }
})
