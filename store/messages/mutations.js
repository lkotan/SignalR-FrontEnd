export default {
  addMessages(state, messages) {
    state.messages = messages;
  },
  addMessage(state, message) {
    state.messages.push(message);
  }
}