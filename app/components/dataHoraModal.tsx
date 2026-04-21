import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { StyleSheet } from 'react-native';

type Props = {
  visible: boolean;
  onClose: () => void;
  onConfirm: (data: Date) => void;
};

export default function DatahoraModal({ visible, onClose, onConfirm }: Props) {


  const [data, setData] = useState(new Date());
  const [tempData, setTempData] = useState(new Date());
  const [mode, setMode] = useState<'date' | 'time'>('date');
  const [showPicker, setShowPicker] = useState(false);
  const [tempoRestante, setTempoRestante] = useState('');

  useEffect(() => {
    if (showPicker) return;
    const interval = setInterval(() => {
    const tempo = contagemRegressiva();
    setTempoRestante(tempo);
  }, 1000);

  return () => clearInterval(interval);
}, [data, showPicker]);

const handleChange = (event: any, selectedDate?: Date) => {

  if (event.type === 'set' && selectedDate) {
    const novaData = new Date(tempData); 

    if (mode === 'date') {
      // altera só a data
      novaData.setFullYear(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate()
      );
    } else {
      // altera só a hora
      novaData.setHours(
        selectedDate.getHours(),
        selectedDate.getMinutes(),
        0
      );
    }

    setTempData(novaData);
  }
  setShowPicker(false);
};
 const confirmar = () => {
  setData(tempData);
  onConfirm(tempData);
  onClose();
};

  const contagemRegressiva = () => {
    const agora = new Date().getTime();
    const diff = data.getTime() - agora;
    //console.log(diff, agora, data.getTime(), data)

    if (diff <= 0) {
      return("Essa data já passou!");
    }
    const dias = Math.floor(diff/ (1000 * 60 * 60 * 24));
    const horas = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutos = Math.floor((diff / (1000 * 60)) % 60);
    const segundos = Math.floor((diff / 1000) % 60);

    return(`${dias}d ${horas}h ${minutos}m ${segundos}s`);
  }

  const abrirPicker = (tipo: 'date' | 'time') => {
  setMode(tipo);
  setTempData(data); 
  setShowPicker(true);
};

  return (
   <Modal visible={visible} transparent animationType="slide">
  <View style={styles.overlay}>
    
    <View style={styles.modal}>

      <Text style={[styles.text, styles.title]}>
        Escolher data e hora
      </Text>

      <Text style={styles.text}>
        {data.toLocaleString()}
      </Text>

      <Text style={[styles.text, styles.timer]}>
        ⏳ {tempoRestante}
      </Text>

      {showPicker && (
        <DateTimePicker
          value={tempData}
          mode={mode}
          display="default"
          onChange={handleChange}
        />
      )}

      <View style={styles.row}>
        
<TouchableOpacity onPress={() => abrirPicker('date')}>
  <Text style={styles.text}>📅 Data</Text>
</TouchableOpacity>

<TouchableOpacity onPress={() => abrirPicker('time')}>
  <Text style={styles.text}>⏰ Hora</Text>
</TouchableOpacity>

      </View>

      <TouchableOpacity style={styles.button} onPress={confirmar}>
        <Text style={[styles.text, styles.buttonText]}>
          Confirmar
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onClose} style={styles.cancel}>
        <Text style={styles.text}>Cancelar</Text>
      </TouchableOpacity>

    </View>
  </View>
</Modal>
)};
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