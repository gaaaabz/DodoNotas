import { View, TextInput, StyleSheet, Alert, TouchableOpacity, Text } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../../src/services/firebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import * as Location from 'expo-location';
import { salvarNotaUsuario } from "../../src/services/userDataService";
import MapaModal from "../components/mapaModal";
import DataHoraModal from "../components/dataHoraModal";
import { agendarNotificacao, cancelarNotificacao, notificarAgora } from "../../src/services/notificationService";
import { obterEndereco } from "../../src/services/geocodingService";
import { useTranslation } from "react-i18next";

export default function NotaDetalhe() {

  const { t } = useTranslation();
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [data, setData] = useState<Date | null>(null);
  const [local, setLocal] = useState<{ latitude: number; longitude: number } | null>(null);
  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [original, setOriginal] = useState({ titulo: "", conteudo: "" });
  const [modalMapa, setModalMapa] = useState(false);
  const [modalDataHora, setModalDataHora] = useState(false);
  const [notificationId, setNotificationId] = useState<string | null>(null);

  useEffect(() => {


    pegarLocalizacao();

    const carregarNota = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const ref = doc(db, "usuarios", user.uid, "notas", id as string);
      const snapshot = await getDoc(ref);

      if (snapshot.exists()) {
        const data = snapshot.data();

        const d = data.dataAgendada ? data.dataAgendada.toDate() : null;
        const t = data.tituloNota ?? "";
        const c = data.conteudoNota ?? "";
        const n = data.notificationId ?? null;

        setTitulo(t);
        setConteudo(c);
        setOriginal({ titulo: t, conteudo: c });
        setData(d);
        setNotificationId(n);
      }
    };

    carregarNota();
  }, []);

  const handleVoltar = () => {
    if (titulo !== original.titulo || conteudo !== original.conteudo) {
      Alert.alert(
        t("descartarAlteracoes"),
        t("perderAlteracoes"),
        [
          { text: t("cancelar"), style: "cancel" },
          { text: t("sair"), style: "destructive", onPress: () => router.back() }
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
      Alert.alert(t("atencao"), t("digiteTitulo"));
      return;
    }

    try {
      await pegarLocalizacao();

      let endereco: string | null = null;

      if (local?.latitude && local?.longitude) {
        endereco = await obterEndereco(local.latitude, local.longitude);
      }

      // cancelar antiga
      if (id !== "new" && notificationId) {
        await cancelarNotificacao(notificationId);
      }

      // nova notificação
      let novaNotificationId: string | null = null;

      if (data instanceof Date) {
        novaNotificationId = await agendarNotificacao(
          t("lembrete"),
          titulo,
          data
        );
      }

      // nova nota
      if (id === "new") {
        await salvarNotaUsuario(
          user.uid,
          titulo.trim(),
          conteudo.trim(),
          local,
          data,
          novaNotificationId,
          endereco
        );

        await notificarAgora(
          t("notaCriada"),
          t("notaCriadaSucesso")
        );

        Alert.alert(t("sucesso"), t("notaCriada"));
        router.back();
        return;
      }

      // atualização
      const ref = doc(db, "usuarios", user.uid, "notas", id as string);

      await updateDoc(ref, {
        tituloNota: titulo.trim(),
        conteudoNota: conteudo.trim(),
        latitude: local?.latitude || null,
        longitude: local?.longitude || null,
        endereco: endereco || null,
        dataAgendada: data || null,
        notificationId: novaNotificationId,
      });

      setOriginal({ titulo, conteudo });

      await notificarAgora(
        t("notaAtualizada"),
        t("notaAtualizadaSucesso")
      );

      Alert.alert(t("sucesso"), t("notaAtualizada"));

    } catch (error) {
      console.log(error);
      Alert.alert(t("erro"), t("erroSalvar"));
    }
  };

  const pegarLocalizacao = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(t("erro"), t("permissaoNegada"));
      return;
    }

    const loc = await Location.getCurrentPositionAsync({});

    setLocal({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    });
  };

  if (!local) {
    return <Text style={{ color: "#fff" }}>{t("carregandoLocalizacao")}</Text>;
  }

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>

        <TouchableOpacity onPress={handleVoltar}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          {id === "new" ? t("criarNota") : t("editarNota")}
        </Text>

        <TouchableOpacity onPress={() => setModalMapa(true)}>
          <Ionicons name="map" size={20} color="#4DA6FF" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setModalDataHora(true)}>
          <Ionicons name="calendar" size={20} color="#4DA6FF" />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSalvar}>
          <Ionicons name="save-outline" size={26} color="#4DA6FF" />
        </TouchableOpacity>

      </View>

      {/* INPUTS */}
      <TextInput
        value={titulo}
        onChangeText={setTitulo}
        placeholder={t("titulo")}
        placeholderTextColor="#888"
        style={styles.titulo}
      />

      <TextInput
        value={conteudo}
        onChangeText={setConteudo}
        placeholder={t("digiteNota")}
        placeholderTextColor="#888"
        multiline
        style={styles.conteudo}
      />

      <MapaModal
        visible={modalMapa}
        onClose={() => setModalMapa(false)}
        coords={local}
      />

      <DataHoraModal
        visible={modalDataHora}
        onClose={() => setModalDataHora(false)}
        onConfirm={(date) => setData(date)}
        dataInical={data}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D1117",
    paddingTop: 50,
    paddingHorizontal: 16,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },

  titulo: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },

  conteudo: {
    color: "#ccc",
    fontSize: 16,
    textAlignVertical: "top",
  },
});