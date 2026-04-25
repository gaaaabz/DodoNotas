import { StyleSheet, View, Text,Pressable } from "react-native";
import {AntDesign,MaterialIcons}            from "@expo/vector-icons"
import { useRouter }                        from "expo-router";

export default function notas({id, titulo, conteudo, endereco, onDeletePress}) {

    const router = useRouter();
  
    return (
     <Pressable
      style   = {styles.container}
      onPress = {() => router.push(`/nota/${id}`)} 
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

      {endereco ? (
  <View style={styles.enderecoContainer}>
    <MaterialIcons name="location-on" size={14} color="#1F6FEB" />
    
    <Text
      style={styles.enderecoText}
      numberOfLines={2}
      ellipsizeMode="tail"
    >
      {endereco}
    </Text>
  </View>
) : (
  <Text style={styles.enderecoVazio}>
    Sem localização
  </Text>
)}

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
  fontSize  : 18,       
  fontWeight: "bold",
  marginTop : 8
},

text: {
  color    : "#aaa",   
  fontSize : 14,
  marginTop: 6
},

enderecoContainer: {
  flexDirection: "row",
  alignItems: "center",
  marginTop: 6,
},

enderecoText: {
  color: "#8FA3BF", 
  fontSize: 12,
  marginLeft: 4,
  flex: 1,
},

enderecoVazio: {
  color: "#555",
  fontSize: 12,
  marginTop: 6,
},
})
