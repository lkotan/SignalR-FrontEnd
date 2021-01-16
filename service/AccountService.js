export default class AccountService {
  constructor(context) {
    this.context = context;
  }
  async RoomJoin(roomId) {
    return (await this.context.$axios.post(`/Accounts/RoomJoin?roomId=${roomId}`)).data;
  }
  async RoomLeft() {
    return (await this.context.$axios.post(`/Accounts/RoomLeft`)).data;
  }
}