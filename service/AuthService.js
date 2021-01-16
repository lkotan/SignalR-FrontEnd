export default class AuthService {
  constructor(context) {
    this.context = context;
  }
  async Register(model) {
    return (await this.context.$axios.post("/Auth/Register",model)).data;
  }
}