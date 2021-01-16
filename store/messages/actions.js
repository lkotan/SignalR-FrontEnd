export default {
  async getAll(state, roomId) {
    const res = await this.$MessageService.GetRoomMessages(roomId);
    state.commit('addMessages', res);
    return res;
  },
}