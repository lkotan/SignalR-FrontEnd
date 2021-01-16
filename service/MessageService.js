export default class MessageService {
  constructor(context) {
    this.context = context;
  }
  async GetRoomMessages(roomId) {
    return (await this.context.$axios.get(`/Messages/RoomMessages?roomId=${roomId}`)).data
  }
  async Insert(entity) {
    return (await this.context.$axios.post("/Messages/Insert", entity)).data;
  }
}