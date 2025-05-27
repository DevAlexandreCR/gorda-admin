export type FCMNotification = {
  title: string
  body: string
  data?: { [key: string]: string }
}