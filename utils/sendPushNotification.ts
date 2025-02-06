export async function sendPushNotification(
  expoPushToken: string | string[],
  title: string,
  body: string,
  chatId: string,
): Promise<void> {
  const message = {
    to: expoPushToken,
    sound: "default",
    title,
    body,
    data: { chatId },
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}
