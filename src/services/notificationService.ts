import * as Notifications from 'expo-notifications';

export async function agendarNotificacao(titulo: string, corpo: string, data: Date) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: titulo,
      body: corpo,
    },
    trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: data
    }  
  });
}