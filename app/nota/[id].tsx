import { View, TextInput, StyleSheet, Alert, TouchableOpacity, Text } from "react-native";
import { useLocalSearchParams, useRouter }                            from "expo-router";
import { useEffect, useState }                                        from "react";
import { doc, getDoc, updateDoc }                                     from "firebase/firestore";
import { db, auth }                                                   from "../../src/services/firebaseConfig";
import { Ionicons }                                                   from "@expo/vector-icons";
import { addDoc, collection, serverTimestamp }                        from "firebase/firestore";

export default function NotaDetalhe() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [titulo, setTitulo]     = useState("");
  const [conteudo, setConteudo] = useState("");
  const [original, setOriginal] = useState({ titulo: "", conteudo: "" });

useEffect(() => {
  if (id === "new") return;

  const carregarNota = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const ref      = doc(db, "usuarios", user.uid, "notas", id as string);
    const snapshot = await getDoc(ref);

    if (snapshot.exists()) {
      const data = snapshot.data();
      const t    = data.tituloNota ?? "";
      const c    = data.conteudoNota ?? "";

      setTitulo(t);
      setConteudo(c);
      setOriginal({ titulo: t, conteudo: c });
    }
  };

  carregarNota();
}, []);

    const handleVoltar = () => {
    if (titulo !== original.titulo || conteudo !== original.conteudo) {
      Alert.alert(
        "Descartar alterações?",
        "Você perderá as alterações não salvas.",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Sair", style: "destructive", onPress: () => router.back() }
        ]
      );
    } else {
      router.back();
    }
  };

   const handleSalvar = async () => {
  const user = auth.currentUser;
  if (!user) return;

  if (!titulo.trim()) {
    Alert.alert("Atenção", "Digite um título");
    return;
  }

  try {
      //Nota nova
    if (id === "new") {
      await addDoc(collection(db, "usuarios", user.uid, "notas"), {
        tituloNota  : titulo.trim(),
        conteudoNota: conteudo.trim(),
        criadoEm    : serverTimestamp(),
      });

      Alert.alert("Sucesso", "Nota criada!");
      router.back();
      return;
    }

      //edição
    const ref = doc(db, "usuarios", user.uid, "notas", id as string);

    await updateDoc(ref, {
      tituloNota  : titulo.trim(),
      conteudoNota: conteudo.trim(),
    });

    setOriginal({ titulo, conteudo });

    Alert.alert("Sucesso", "Nota atualizada!");
  } catch (error) {
    console.log(error);
    Alert.alert("Erro", "Não foi possível salvar.");
  }
};


  return (
<View style = {styles.container}>
      
      {/* HEADER */}
      <View             style   = {styles.header}>
      <TouchableOpacity onPress = {handleVoltar}>
      <Ionicons         name    = "arrow-back" size = {26} color = "#fff" />
        </TouchableOpacity>
        

        <Text style = {styles.headerTitle}>
  {id === "new" ? "Criar Nota" : "Editar Nota"}
</Text>

        <TouchableOpacity onPress = {handleSalvar}>
        <Ionicons         name    = "save-outline" size = {26} color = "#4DA6FF" />
        </TouchableOpacity>
      </View>

      {/* ✍️ CONTEÚDO */}
      <TextInput
        value                = {titulo}
        onChangeText         = {setTitulo}
        placeholder          = "Título"
        placeholderTextColor = "#888"
        style                = {styles.titulo}
      />

      <TextInput
        value                = {conteudo}
        onChangeText         = {setConteudo}
        placeholder          = "Digite sua nota..."
        placeholderTextColor = "#888"
        multiline
        style = {styles.conteudo}
      />
    </View>
  )}

    const styles = StyleSheet.create({
  container: {
    flex             : 1,
    backgroundColor  : "#0D1117",   // preto azulado
    paddingTop       : 50,
    paddingHorizontal: 16,
  },

  header: {
    flexDirection : "row",
    justifyContent: "space-between",
    alignItems    : "center",
    marginBottom  : 20,
  },

  headerTitle: {
    color     : "#fff",
    fontSize  : 18,
    fontWeight: "600",
  },

  titulo: {
    color       : "#fff",
    fontSize    : 22,
    fontWeight  : "bold",
    marginBottom: 10,
  },

  conteudo: {
    color            : "#ccc",
    fontSize         : 16,
    textAlignVertical: "top",
  },
});