import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useTranslation } from 'react-i18next';

type Props = {
  visible: boolean;
  onClose: () => void;
  onConfirm: (data: Date) => void;
  dataInical: Date | null;
};

export default function DatahoraModal({ visible, onClose, onConfirm, dataInical }: Props) {

  const { t } = useTranslation();

  const [data, setData] = useState<Date>(dataInical ?? new Date());
  const [mode, setMode] = useState<'date' | 'time'>('date');
  const [showPicker, setShowPicker] = useState(false);
  const [tempoRestante, setTempoRestante] = useState('');

  useEffect(() => {
    if (visible && dataInical) {
      setData(dataInical);
    }
  }, [visible, dataInical]);

  //contador
  useEffect(() => {
    if (showPicker) return;

    const interval = setInterval(() => {
      setTempoRestante(contagemRegressiva());
    }, 1000);

    return () => clearInterval(interval);
  }, [data, showPicker]);

  const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {

    if (event.type === 'dismissed') {
      setShowPicker(false);
      return;
    }

    if (selectedDate) {
      const novaData = new Date(data);

      if (mode === 'date') {
        novaData.setFullYear(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate()
        );
      } else {
        novaData.setHours(
          selectedDate.getHours(),
          selectedDate.getMinutes(),
          0
        );
      }

      setData(novaData);
    }

    setShowPicker(false);
  };

  const confirmar = () => {
    onConfirm(data);
    onClose();
  };

  const contagemRegressiva = () => {
    const agora = new Date().getTime();
    const diff = data.getTime() - agora;

    if (diff <= 0) {
      return t("tempoEsgotado");
    }

    const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutos = Math.floor((diff / (1000 * 60)) % 60);
    const segundos = Math.floor((diff / 1000) % 60);

    return `${dias}d ${horas}h ${minutos}m ${segundos}s`;
  };

  const abrirPicker = (tipo: 'date' | 'time') => {
    setMode(tipo);
    setShowPicker(true);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>

        <View style={styles.modal}>

          <Text style={[styles.text, styles.title]}>
            {t("escolherDataHora")}
          </Text>

          <Text style={styles.text}>
            {data.toLocaleString()}
          </Text>

          <Text style={[styles.text, styles.timer]}>
            ⏳ {tempoRestante}
          </Text>

          {showPicker && (
            <DateTimePicker
              value={data}
              mode={mode}
              display="default"
              onChange={handleChange}
            />
          )}

          <View style={styles.row}>

            <TouchableOpacity onPress={() => abrirPicker('date')}>
              <Text style={styles.text}>📅 {t("data")}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => abrirPicker('time')}>
              <Text style={styles.text}>⏰ {t("hora")}</Text>
            </TouchableOpacity>

          </View>

          <TouchableOpacity style={styles.button} onPress={confirmar}>
            <Text style={[styles.text, styles.buttonText]}>
              {t("confirmar")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} style={styles.cancel}>
            <Text style={styles.text}>{t("cancelar")}</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#000000aa',
  },

  modal: {
    margin: 20,
    borderRadius: 12,
    padding: 20,
    backgroundColor: '#1E1E1E',
    alignItems: 'center',
  },

  text: {
    color: '#fff',
  },

  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  timer: {
    marginTop: 10,
    fontSize: 14,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 15,
  },

  button: {
    marginTop: 20,
    backgroundColor: '#1F6FEB',
    padding: 12,
    borderRadius: 8,
    width: '100%',
  },

  buttonText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },

  cancel: {
    marginTop: 10,
  },
});