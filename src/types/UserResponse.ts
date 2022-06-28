export type UserResponse = {
  status: string,
  data: string|Array<{param: string, msg: string}>
}