export default {
  async getAll(state) {
    const res = await this.$RoomService.GetAll();
    state.commit('addRooms', res);
    return res;
  },
}