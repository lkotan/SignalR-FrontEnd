<template>
  <div class="header">
    <v-app-bar class="shadow-none" app color="#9FA8DA">
      <v-toolbar-title class="d-flex align-items-center">
        <v-icon left>mdi mdi-message-text-outline</v-icon>
        LOGO  <span class="ml-5">State=>{{ state }}</span></v-toolbar-title
      >
      <v-spacer></v-spacer>
      <v-app-bar-nav-icon
        v-if="isDrawer"
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>
    </v-app-bar>
    <v-navigation-drawer
      v-if="isDrawer"
      class="navigation"
      app
      floating
      :permanent="drawer"
      v-model="drawer"
      absolute
      fixed-top
      right
    >
      <template v-slot:prepend>
        <v-list-item two-line>
          <v-list-item-avatar>
            <img src="/profile.png" />
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title style="color:#fff;">{{
              $nuxt.$auth.user.userName
            }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
      <v-divider></v-divider>
      <div>
        <h6 class="text-center">
          Aktif Kullanıcılar <span>({{ countAccounts }})</span>
        </h6>
      </div>
      <v-divider></v-divider>
      <div>
        <h4 class="text-center">Odalar</h4>
        <v-list dense>
          <v-list-item v-for="item in rooms" :key="item.id" class="list-rooms">
            <v-list-item-content>
              <v-list-item-title
                class="text-center"
                @click="getRoomMessage(item)"
                >{{ item.name }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </div>
      <template v-slot:append>
        <div class="pa-2">
          <v-btn block :loading="loading" @click="logout">
            Çıkış
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <div class="content" v-if="isRoom">
      <v-card class="container">
        <v-card-title>
          {{ activeRoom }} Odası ({{ roomAccountCount }})
          <v-btn class="ml-auto" @click="leaveRoom">Odadan Çık</v-btn>
        </v-card-title>
        <v-card-text>
          <div
            class="d-flex flex-column"
            v-for="account in activeRoomAccounts"
            :key="account.accountId"
          >
            <p class="ml-auto" :class="$nuxt.$auth.user.accountId==account.accountId ? 'myUser' :''">{{ account.userName }}</p>
          </div>
          <div v-for="message in messages" :key="message.id">
            <p
              class="m-0 p-0 my-1"
              v-if="$nuxt.$auth.user.accountId != message.accountId"
            >
              <strong>{{ message.userName }} : </strong>
              <span>{{ message.text }} <strong>{{ formatDate(message.createdAt) }}</strong> </span>
            </p>
            <p class="m-0 p-0 my-1 text-right" v-else>
              <strong
                :class="
                  $nuxt.$auth.user.accountId == message.accountId
                    ? 'myUser'
                    : ''
                "
              >
                {{ message.userName }} :</strong
              >
              <span>{{ message.text }} <strong>{{ formatDate(message.createdAt) }}</strong> </span>
            </p>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-text-field
            v-model="message"
            label="Mesaj"
            placeholder="Mesaj"
            dense
            outlined
            @keyup.enter="sendMessage"
            class="shadow-none mt-5"
          ></v-text-field>
          <v-icon @click="sendMessage" class="mb-2 ml-3 send-icon">
            mdi mdi-send
          </v-icon>
        </v-card-actions>
      </v-card>
    </div>
  </div>
</template>

<script>
import * as signalr from "@microsoft/signalr";
import { confirmOption } from "@/helpers/plugin-options";
import { mapGetters } from "vuex";
import moment from "moment";

export default {
  middleware: "auth-user",
  async asyncData(state) {
    await state.store.dispatch("rooms/getAll");
  },
  data() {
    return {
      loading: false,
      drawer: true,
      items: [
        { title: "Kullanıcılar", icon: "mdi-account-group-outline" },
        { title: "Odalar", icon: "mdi mdi-wechat" }
      ],
      countAccounts: 0,
      connection: "",
      activeRoom: "",
      isRoom: false,
      roomId: 0,
      message: "",
      state: "",
      roomAccountCount: 0,
      isDrawer: true,
      activeRoomAccounts: []
    };
  },
  computed: {
    ...mapGetters({
      messages: "messages/getAll",
      rooms: "rooms/getAll"
    })
  },
  methods: {
    formatDate(date) {
      return moment(date).locale("tr").format("DD.MM.YYYY");
    },
    startSignalR() {
      this.connection.invoke("GetCountAccounts");
    },
    startConnection() {
      this.connection = signalr.HubConnection;
      this.connection = new signalr.HubConnectionBuilder()
        .withUrl("http://localhost:54099/ChatHub")
        .build();

      this.connection
        .start()
        .then(() => {
          this.startSignalR();
        })
        .catch(err => {
          console.log(err);
        });
      this.state = this.connection.connectionState;
    },
    async getRoomMessage(item) {
      this.isDrawer = false;
      this.roomId = item.id;
      this.activeRoom = item.name;

      await this.$store.dispatch("messages/getAll", item.id);

      await this.$AccountService.RoomJoin(item.id);

      this.connection.invoke("AddToGroup", this.activeRoom);
      this.connection.invoke("GetRoomAccount", this.roomId, this.activeRoom);
      this.isRoom = true;
    },
    async sendMessage() {
      if (this.message == "") {
        this.$confirm(
          confirmOption.info("Lütfen mesaj alanını doldurunuz", "Uyarı")
        );
        return;
      }
      let entity = {
        id: 0,
        text: this.message,
        createdAt: new Date().toISOString().substr(0, 10),
        accountId: this.$auth.user.accountId,
        roomId: this.roomId
      };
      const res = await this.$MessageService.Insert(entity);
      this.connection.invoke("SendMessage", res.data, this.activeRoom);
      this.message = "";
    },
    async leaveRoom() {
      this.isRoom = false;
      await this.$AccountService.RoomLeft();

      this.connection.invoke("RemoveToGroup", this.activeRoom);
      this.connection.invoke("GetRoomAccount", this.roomId, this.activeRoom);
      this.isDrawer = true;
    },
    async logout() {
      this.loading = true;
      try {
        await this.$auth.logout("local");
        this.connection.invoke("GetCountAccounts");
        this.$router.push("/auth/login");
      } catch (error) {
        this.$confirm(confirmOption.info(error, "Bir Hata Oluştu"));
      }
      this.loading = false;
    },

    onMethods() {
      this.connection.on("AddGroup", addGroupmessage => {
        console.log(addGroupmessage);
      });
      this.connection.on("RemoveGroup", removeGroupmessage => {
        console.log(removeGroupmessage);
      });
      this.connection.on("ReceiveRoomAccount", (accounts, count) => {
        this.activeRoomAccounts = [];
        this.activeRoomAccounts = accounts;
        this.roomAccountCount = count;
      });
      this.connection.on("CountAccounts", count => {
        this.countAccounts = count;
      });
      this.connection.on("ReceiveMessage", message => {
        console.log(message);

        this.$store.commit("messages/addMessage", message);
      });
    },
  },
  mounted() {
    this.startConnection();
    this.onMethods();
  }
};
</script>

<style>
.myUser {
  text-transform: uppercase;
  color: #f16e6ec4;
}
.send-icon {
  cursor: pointer;
}
.header h4,
h6 {
  color: #fff !important;
}
.navigation {
  background: #989cc3 !important;
}
.list-rooms {
  cursor: pointer;
}
.list-rooms:hover {
  background: #7e83bb;
}
.list-rooms .theme--light.v-icon {
  color: #fff !important;
}
.list-rooms .v-list-item__title {
  font-size: 16px;
  color: #42393d;
}
.content {
  margin-top: 100px;
  max-width: 800px;
}
</style>
