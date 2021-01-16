import RoomService from "../service/RoomService";
import MessageService from "../service/MessageService";
import AccountService from "../service/AccountService";
import AuthService from "../service/AuthService";


export default(context,inject) =>{
  inject("RoomService", new RoomService(context));
  inject("MessageService", new MessageService(context));
  inject("AccountService", new AccountService(context));
  inject("AuthService", new AuthService(context));
}