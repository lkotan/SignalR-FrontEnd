export default class RoomService{
  constructor(context) {
    this.context = context;
  }
  async GetAll() {
    return (await this.context.$axios.get("/Rooms")).data;
  }
}