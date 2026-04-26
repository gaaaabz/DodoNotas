import { Text, StyleSheet, View, Alert, KeyboardAvoidingView, Platform, FlatList, TouchableOpacity } from "react-native";
import AsyncStorage                                                                                  from "@react-native-async-storage/async-storage";
import { useRouter }                                                                                 from "expo-router";
import { auth, db }                                                                                  from "../src/services/firebaseConfig";
import { deleteUser, onAuthStateChanged }                                                            from "firebase/auth";
import ItemNota                                                                                      from "./components/NotasLista";
import { SafeAreaView }                                                                              from "react-native-safe-area-context";
import { useState, useEffect }                                                                       from "react";
import { collection, onSnapshot, query, doc, deleteDoc }                                             from "firebase/firestore";
import { useTranslation }                                                                            from "react-i18next";

type Nota = {
  id           : string;
  tituloNota   : string;
  conteudoNota : string;
  endereco    ?: string;
};

export default function Home() {

  const { t }  = useTranslation();
  const router = useRouter();

  const [notas, setnota] = useState<Nota[]>([]);

  useEffect(() => {
    let unsubscribenotas: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (unsubscribenotas) {
        unsubscribenotas();
        unsubscribenotas = undefined;
      }

      if (!user) {
        setnota([]);
        return;
      }

      const notasRef   = collection(db, "usuarios", user.uid, "notas");
      const notasQuery = query(notasRef);

      unsubscribenotas = onSnapshot(
        notasQuery,
        (snapshot) => {
          const dados = snapshot.docs.map((doc) => {
            const data = doc.data();

            return {
              id          : doc.id,
              tituloNota  : data.tituloNota ?? "",
              conteudoNota: data.conteudoNota ?? "",
              endereco    : data.endereco ?? ""
            };
          });

          setnota(dados);
        },
        (error) => {
          console.log("Erro ao buscar notas:", error);
        }
      );
    });

    return () => {
      if (unsubscribenotas) {
        unsubscribenotas();
      }
    };
  }, []);

  const realizarLogoff = async () => {
    await AsyncStorage.removeItem("@user");
    router.replace("/");
  };

  const excluirConta = () => {
    Alert.alert(
      t("confirmarExclusao"),
      t("confirmarExclusaoConta"),
      [
        { text: t("cancelar"), style: "cancel" },
        {
          text   : t("excluir"),
          onPress: async () => {
            try {
              const user = auth.currentUser;

              if (user) {
                await deleteUser(user);
                await AsyncStorage.removeItem("@user");

                Alert.alert(t("sucesso"), t("contaExcluida"));
                router.replace("/");
              } else {
                Alert.alert(t("erro"), t("nenhumUsuario"));
              }
            } catch (error) {
              console.log("Erro ao excluir conta.");
              Alert.alert(t("erro"), t("erroExcluirConta"));
            }
          }
        }
      ]
    );
  };

  const excluirNota = (nota: Nota) => {
    Alert.alert(
      t("excluirNota"),
      t("confirmarExcluirNota"),
      [
        { text: t("cancelar") },
        {
          text   : t("excluir"),
          onPress: async () => {
            const user = auth.currentUser;

            if (!user) {
              Alert.alert(t("erro"), t("nenhumUsuario"));
              return;
            }

            try {
              const notaRef = doc(db, "usuarios", user.uid, "notas", nota.id);
              await deleteDoc(notaRef);
            } catch (error) {
              console.log("Erro ao excluir notas:", error);
              Alert.alert(t("erro"), t("erroExcluirNota"));
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style = {styles.main}>
      <KeyboardAvoidingView
        style                  = {styles.main}
        behavior               = {Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset = {10}
      >

        {/* Ações */}
        <View style = {styles.actionsContainer}>

          <TouchableOpacity style = {styles.btn} onPress = {realizarLogoff}>
          <Text             style = {styles.btnText}>{t("logoff")}</Text>
          </TouchableOpacity>

          <TouchableOpacity style = {styles.btnDanger} onPress = {excluirConta}>
          <Text             style = {styles.btnText}>{t("excluirConta")}</Text>
          </TouchableOpacity>

        </View>

        {/* Lista */}
        <FlatList
          key                   = "grid"
          data                  = {notas}
          numColumns            = {2}
          style                 = {styles.lista}
          contentContainerStyle = {styles.listaConteudo}
          columnWrapperStyle    = {{ justifyContent: "space-between" }}
          renderItem            = {({ item }) => (
            <ItemNota
              id            = {item.id}
              titulo        = {item.tituloNota}
              conteudo      = {item.conteudoNota}
              endereco      = {item.endereco}
              onDeletePress = {() => excluirNota(item)}
            />
          )}
        />

        {/* Botão adicionar */}
        <TouchableOpacity
          style   = {styles.fab}
          onPress = {() => router.push("/nota/new")}
        >
          <Text style = {styles.fabText}>+</Text>
        </TouchableOpacity>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
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

  lista: {
    width    : "100%",
    marginTop: 16,
    flex     : 1,
  },

  listaConteudo: {
    paddingHorizontal: 8,
    paddingBottom    : 20,
  },
});