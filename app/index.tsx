import { Link }                                                              from 'expo-router';
import React   ,                                                                 { useState, useEffect } from 'react';
import { Image, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { auth }                                                              from "../src/services/firebaseConfig"
import { signInWithEmailAndPassword, sendPasswordResetEmail }                from 'firebase/auth';
import { useRouter }                                                         from 'expo-router';
import AsyncStorage                                                          from '@react-native-async-storage/async-storage';
import { registrarUltimoLogin }                                              from '../src/services/userDataService';


export default function LoginScreen() {

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const router = useRouter()
  useEffect(() => {
    const verificarUsuarioLogado = async () => {
      try {
        const usuarioSalvo = await AsyncStorage.getItem("@user")
        if (usuarioSalvo) {
          router.replace("/Home")
        }
      } catch (error) {
        console.log("Error ao verificar login: ", error)
      }
    }
    verificarUsuarioLogado()
  }, [])

  const handleLogin = () => {
    if (!email || !senha) {
      Alert.alert('Atenção', 'Preencha todos os campos!');
      return;
    }
    signInWithEmailAndPassword(auth, email, senha)
      .then(async (userCredential) => {

        const user = userCredential.user;
        await registrarUltimoLogin(user.uid, user.email)


        await AsyncStorage.setItem("@user", JSON.stringify(user))

        router.replace("/Home")
      })
      .catch((error) => {
        const errorCode    = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage)
        Alert.alert("ATENÇÃO", "Credenciais Inválidas, verifique e-mail e senha:", [
          { text: "OK" }
        ])
      });
  };


  return (
    <View style = {styles.container}>
    <Text style = {styles.titulo}>🦤dodonotas🦤</Text>


      {/* Campo Email */}
      <TextInput
        style                = {styles.input}
        placeholder          = "E-mail"
        placeholderTextColor = "#aaa"
        keyboardType         = "email-address"
        autoCapitalize       = "none"
        value                = {email}
        onChangeText         = {setEmail}
      />

      {/* Campo Senha */}
      <TextInput
        style                = {styles.input}
        placeholder          = "senha"
        placeholderTextColor = "#aaa"
        secureTextEntry
        value        = {senha}
        onChangeText = {setSenha}
      />

      {/* Botão */}
      <TouchableOpacity style = {styles.botao} onPress = {handleLogin}>
      <Text             style = {styles.textoBotao}>Login</Text>
      </TouchableOpacity>

      <View style = {{alignItems:"center"}}>
      <Link href  = "CadastrarScreen" style = {{ marginTop: 20, color: 'white' }}>registrar</Link>
      </View>

    </View>
  );
}

  // Estilização
const styles = StyleSheet.create({
  container: {
    flex           : 1,
    backgroundColor: '#0D1117',
    justifyContent : 'center',
    padding        : 20,
  },
  titulo: {
    fontSize    : 28,
    fontWeight  : 'bold',
    color       : '#fff',
    marginBottom: 30,
    textAlign   : 'center',
  },
  input: {
    backgroundColor: '#1E1E1E',
    color          : '#fff',
    borderRadius   : 10,
    padding        : 15,
    marginBottom   : 15,
    fontSize       : 16,
    borderWidth    : 1,
    borderColor    : '#333',
  },
  botao: {
    backgroundColor: '#1F6FEB',
    padding        : 15,
    borderRadius   : 10,
    alignItems     : 'center',
  },
  textoBotao: {
    color     : '#fff',
    fontSize  : 18,
    fontWeight: 'bold',
  },
});
