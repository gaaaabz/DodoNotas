import * as Location from 'expo-location';

export const obterEndereco = async (
  latitude: number,
  longitude: number
): Promise<string> => {
  try {
    const resultado = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });

    if (resultado.length === 0) return "Endereço não encontrado";

    const lugar = resultado[0];

    const partes = [
      lugar.street,
      lugar.name,
      lugar.district,
      lugar.city,
      lugar.region,
    ].filter(Boolean); // 👈 remove undefined/null

    return partes.join(", ");
  } catch (error) {
    console.log("Erro no geocoding:", error);
    return "Erro ao buscar endereço";
  }
};