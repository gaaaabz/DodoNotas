import React from 'react';
import { Modal, View, TouchableOpacity, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

type Props = {
  visible: boolean;
  onClose: () => void;
  coords: {
    latitude: number;
    longitude: number;
  } | null;
};

export default function MapModal({ visible, onClose, coords }: Props) {
  return (
    <Modal visible={visible} animationType="slide">
      <View style={{ flex: 1 }}>

        {coords && (
          <MapView
            style={{ flex: 1 }}
            initialRegion={{
              latitude: coords.latitude,
              longitude: coords.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker coordinate={coords} />
          </MapView>
        )}

        <TouchableOpacity
          onPress={onClose}
          style={{
            position: 'absolute',
            top: 40,
            right: 20,
            backgroundColor: 'red',
            padding: 10,
            borderRadius: 10
          }}
        >
          <Text style={{ color: '#fff' }}>Fechar</Text>
        </TouchableOpacity>

      </View>
    </Modal>
  );
}