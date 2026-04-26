import React   ,                                                          { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { createUserWithEmailAndPassword }                             from 'firebase/auth';
import { auth }                                                       from "../src/services/firebaseConfig";
import { useRouter }                                                  from 'expo-router';
import AsyncStorage                                                   from '@react-native-async-storage/async-storage';
import { criarPerfilUsuario }                                         from '../src/services/userDataService';
import { Ionicons }                                                   from "@expo/vector-icons";
import { useTranslation }                                             from 'react-i18next';

export default function CadastroScreen() {

  const [nome, setNome]   = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const { t }  = useTranslation();
  const router = useRouter();

  const handleVoltar = () => {
    router.back();
  };

  const handleCadastro = () => {
    if (!nome || !email || !senha) {
      Alert.alert(t("atencao"), t("preenchaCampos"));
      return;
    }

    createUserWithEmailAndPassword(auth, email, senha)
      .then(async (userCredential) => {

        const user = userCredential.user;

          // cria perfil
        await criarPerfilUsuario({
          uid  : user.uid,
          email: user.email,
          nome
        });

          // salva local
        await AsyncStorage.setItem("@user", JSON.stringify(user));

        Alert.alert(t("sucesso"), t("contaCriada"));

        router.replace("/Home");
      })
      .catch((error) => {
        console.log(error.code, error.message);

        Alert.alert(
          t("erro"),
          t("erroCadastro")
        );
      });
  };

  return (
    <View style = {styles.container}>

      <TouchableOpacity onPress = {handleVoltar}>
      <Ionicons         name    = "arrow-back" size = {26} color = "#fff" />
      </TouchableOpacity>

      <Text style = {styles.titulo}>{t("criarConta")}</Text>

      {/* Nome */}
      <TextInput
        style                = {styles.input}
        placeholder          = {t("nomeCompleto")}
        placeholderTextColor = "#aaa"
        value                = {nome}
        onChangeText         = {setNome}
      />

      {/* Email */}
      <TextInput
        style                = {styles.input}
        placeholder          = {t("email")}
        placeholderTextColor = "#aaa"
        keyboardType         = "email-address"
        autoCapitalize       = "none"
        value                = {email}
        onChangeText         = {setEmail}
      />

      {/* Senha */}
      <TextInput
        style                = {styles.input}
        placeholder          = {t("senha")}
        placeholderTextColor = "#aaa"
        secureTextEntry
        value        = {senha}
        onChangeText = {setSenha}
      />

      {/* Botão */}
      <TouchableOpacity style = {styles.botao} onPress = {handleCadastro}>
      <Text             style = {styles.textoBotao}>{t("cadastrar")}</Text>
      </TouchableOpacity>

    </View>
  );
}

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