import * as Notifications from 'expo-notifications';

// Pedir permissão para notificações
export async function registrarPermissao() {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

// Notificação imediata para login ou criação de nota
export async function notificarAgora(titulo: string, corpo: string) {
  await Notifications.scheduleNotificationAsync({
    content: { title: titulo, body: corpo },
    trigger: null, // 👈 dispara imediatamente
  });
}

// Notificação para as datas agendadas
export async function agendarNotificacao(
  titulo: string,
  corpo: string,
  data: Date
) {
  return Notifications.scheduleNotificationAsync({
    content: { title: titulo, body: corpo },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: data,
    },
  });
}

// cancelar notificação de data agendada caso haja alteração ou exclusão da nota
export async function cancelarNotificacao(id: string) {
  await Notifications.cancelScheduledNotificationAsync(id);
}