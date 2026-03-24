import { StyleSheet, View, Text,Pressable } from "react-native";
import {AntDesign,MaterialIcons}            from "@expo/vector-icons"
import { useRouter }                        from "expo-router";

export default function notas({id, titulo, conteudo, onDeletePress}) {

    const router = useRouter();
  
    return (
     <Pressable
      style   = {styles.container}
      onPress = {() => router.push(`/nota/${id}`)}  // 🔥 navegação
    >
    <View style = {styles.container}>
      
      {/* Ações */}
      <View style = {styles.actions}>

        <Pressable     onPress = {onDeletePress}>
        <MaterialIcons name    = "delete" size = {20} color = "#771010" />
        </Pressable>
      </View>

      {/* Título */}
      <Text
        style         = {styles.title}
        numberOfLines = {2}
        ellipsizeMode = "tail"
      >
        {titulo}
      </Text>

      {/* Conteúdo */}
      <Text
        style         = {styles.text}
        numberOfLines = {4}
        ellipsizeMode = "tail"
      >
        {conteudo}
      </Text>

    </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
container: {
  width          : "48%",
  aspectRatio    : 1,
  backgroundColor: "#1E1E1E",
  borderRadius   : 12,
  padding        : 12,
  marginBottom   : 10,
  justifyContent : "space-between"
},

actions: {
  flexDirection : "row",
  justifyContent: "space-between"
},

title: {
  color     : "#fff",
  fontSize  : 18,       // 🔥 maior destaque
  fontWeight: "bold",
  marginTop : 8
},

text: {
  color    : "#aaa",   // 🔥 mais opaco
  fontSize : 14,
  marginTop: 6
}
})
