import { Text, StyleSheet, View, Button, Alert, TextInput, KeyboardAvoidingView, Platform, FlatList, Modal, TouchableOpacity } from "react-native";
import AsyncStorage                                                                                                            from "@react-native-async-storage/async-storage";
import { useRouter }                                                                                                           from "expo-router";
import { auth, db }                                                                                                            from "../src/services/firebaseConfig"
import { deleteUser, onAuthStateChanged }                                                                                      from "firebase/auth";
import ItemLoja                                                                                                                from "./components/NotasLista";
import { SafeAreaView }                                                                                                        from "react-native-safe-area-context";
import { useState, useEffect }                                                                                                 from "react";
import { salvarNotaUsuario }                                                                                                   from "../src/services/userDataService";
import { collection, onSnapshot, orderBy, query, doc, deleteDoc, updateDoc }                                                   from "firebase/firestore"

type Nota = {
    id          : string,
    tituloNota  : string,
    conteudoNota: string
}

export default function Home() {
    const [conteudoNota, setConteudoNota] = useState("")
    const [tituloNota, setTituloNota]     = useState("")

    const [notas, setnota] = useState<Nota[]>([])

    const [modalEditarVisivel, setModalEditarVisivel] = useState(false)
    const [notaselecionadoId, setnotaselecionadoId]   = useState("")
    const [novoConteudoNota, setNovoConteudoNota]     = useState("")

    const router = useRouter()  //Hook de navegação

    useEffect(() => {
        let unsubscribenotas: (() => void) | undefined

        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (unsubscribenotas) {
                unsubscribenotas()
                unsubscribenotas = undefined
            }

            if (!user) {
                setnota([])
                return
            }

            const notasRef   = collection(db, "usuarios", user.uid, "notas")
            const notasQuery = query(notasRef)

           unsubscribenotas = onSnapshot(
  notasQuery,
  (snapshot) => {
    const dados = snapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        id          : doc.id,
        tituloNota  : data.tituloNota ?? "",
        conteudoNota: data.conteudoNota ?? "",
      };
    });

    setnota(dados);
  },
  (error) => {
    console.log("Erro ao buscar notas:", error);
  }
);
        })

        return () => {
            if (unsubscribenotas) {
                unsubscribenotas()
            }
        }
    }, [])

    const realizarLogoff = async () => {
        await AsyncStorage.removeItem("@user")
        router.replace("/")
    }

    const excluirConta = () => {
        Alert.alert(
            "Confirmar Exclusão",
            "Tem certeza que deseja excluir sua conta?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text   : "Excluir",
                    onPress: async () => {
                        try {
                            const user = auth.currentUser
                            if (user) {
                                await deleteUser(user)
                                await AsyncStorage.removeItem("@user")
                                Alert.alert("Sucesso", "Conta Excluída!")
                                router.replace("/")
                            } else {
                                Alert.alert("Erro", "Nenhum usuário logado.")
                            }
                        } catch (error) {
                            console.log("Erro ao Excluir conta.")
                            Alert.alert("Error", "Não foi possível excluir a conta.")
                        }
                    }
                }
            ]
        )
    }

    const salvarNota = async () => {
        console.log("USER:", auth.currentUser);
        console.log("UID:", auth.currentUser?.uid);
        if (!tituloNota.trim()) {
            Alert.alert("Atenção", "Digite um titulo para nota.")
            return
        }
        const user = auth.currentUser
        if (!user) {
            Alert.alert("Erro", "Nenhum usuário autenticado.")
            return
        }

        try {
            await salvarNotaUsuario(user.uid, tituloNota.trim(),conteudoNota.trim())
            Alert.alert("Sucesso", "Produto salvo com sucesso!")
            setConteudoNota("")
            console.log("Nota Salvo com Sucesso!")
        } catch (error) {
            console.log("Error ao salvar nota:" + error)
        }
    }

    const excluirNota = (nota: Nota) => {
        Alert.alert("Exluir nota", "Deseja excluir o nota?", [
            { text: "Cancelar" },
            {
                text   : "Excluir",
                onPress: async () => {
                    const user = auth.currentUser
                    if (!user) {
                        Alert.alert("Error", "Nenhum usuário autenticado")
                        return
                    }
                    try {
                        const notaRef = doc(db, "usuarios", user.uid, "notas", nota.id)
                        await deleteDoc(notaRef)
                    } catch (error) {
                        console.log("Erro ao excluir notas:", error)
                        Alert.alert("Erro", "Não foi possível excluir o produto.")
                    }
                }
            }
        ])
    }

    return (
        <SafeAreaView style = {styles.main}>
            <KeyboardAvoidingView 
                style                  = {styles.main}
                behavior               = {Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset = {10}
            >
                <View style = {styles.actionsContainer}>
  
  <TouchableOpacity style = {styles.btn} onPress = {realizarLogoff}>
  <Text             style = {styles.btnText}>Realizar Logoff</Text>
  </TouchableOpacity>

  <TouchableOpacity style = {styles.btnDanger} onPress = {excluirConta}>
  <Text             style = {styles.btnText}>Excluir Conta</Text>
  </TouchableOpacity>

</View>
            <FlatList
  key                   = "grid"
  data                  = {notas}
  numColumns            = {2}
  style                 = {styles.lista}
  contentContainerStyle = {styles.listaConteudo}
  columnWrapperStyle    = {{ justifyContent: "space-between" }}
  renderItem            = {({ item }) => (
    <ItemLoja
      id            = {item.id}
      titulo        = {item.tituloNota}
      conteudo      = {item.conteudoNota}
      onDeletePress = {() => excluirNota(item)}
    />
  )}
/>

<TouchableOpacity
  style   = {styles.fab}
  onPress = {() => router.push("/nota/new")}
>
  <Text style = {styles.fabText}>+</Text>
</TouchableOpacity>
            </KeyboardAvoidingView>
        </SafeAreaView>

    )
}
const styles = StyleSheet.create({
    main: {
        flex           : 1,
        alignItems     : "center",
        justifyContent : "flex-start",
        backgroundColor: "#0D1117"
    },
    fab: {
  position       : "absolute",
  bottom         : 20,
  right          : 20,
  backgroundColor: "#1F6FEB",
  width          : 60,
  height         : 60,
  borderRadius   : 30,
  justifyContent : "center",
  alignItems     : "center",
  elevation      : 5,
},

fabText: {
  color     : "#fff",
  fontSize  : 30,
  fontWeight: "bold",
},

actionsContainer: {
  flexDirection    : "row",
  justifyContent   : "space-between",
  width            : "100%",
  paddingHorizontal: 10,
  marginTop        : 10,
  marginBottom     : 10,
},

btn: {
  flex            : 1,
  backgroundColor : "#1F6FEB",
  paddingVertical : 10,
  marginHorizontal: 4,
  borderRadius    : 8,
  alignItems      : "center",
},

btnDanger: {
  flex            : 1,
  backgroundColor : "#8B1E1E",
  paddingVertical : 10,
  marginHorizontal: 4,
  borderRadius    : 8,
  alignItems      : "center",
},

btnText: {
  color     : "#fff",
  fontWeight: "600",
  fontSize  : 14,
},
    input: {
        backgroundColor: "lightgrey",
        padding        : 10,
        fontSize       : 15,
        width          : "90%",
        alignSelf      : "center",
        borderRadius   : 10,
        marginTop      : "auto"
    },
    lista: {
        width    : "100%",
        marginTop: 16,
        flex     : 1,
    },
   listaConteudo: {
  paddingHorizontal: 8,
  paddingBottom    : 20,
},
    emptyText: {
        textAlign: "center",
        fontSize : 22,
        marginTop: 20
    },
  

})