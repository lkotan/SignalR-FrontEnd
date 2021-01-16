<template>
  <div class="d-flex justify-content-center my-auto">
    <div class="d-flex flex-column p-5 login">
      <div>
        <h4 style="letter-spacing:1.3px;">Lütfen Aşağıdaki Alanları Doldurunuz</h4>
      </div>
      <v-form ref="form" v-model="valid" lazy-validation>
        <div class="mb-3 mt-5">
          <v-text-field
            v-model="entity.userName"
            label="UserName"
            placeholder="UserName"
            :rules="inputValidation.required"
            outlined
            dense
          ></v-text-field>
          <v-text-field
            v-model="entity.email"
            label="E-mail"
            placeholder="E-mail"
            :rules="inputValidation.email"
            outlined
            dense
          ></v-text-field>

          <v-text-field
            outlined
            dense
            v-model="entity.password"
            label="Password"
            placeholder="Password"
            :rules="inputValidation.required"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPassword = !showPassword"
            :type="showPassword ? 'text' : 'password'"
          ></v-text-field>
        </div>

        <v-btn
          color="primary"
          :loading="loading"
          @click="register"
          class="text-capitalize"
        >
          Kayıt Ol
        </v-btn>
      </v-form>
    </div>
  </div>
</template>

<script>
import { inputValidation } from "@/helpers/vuetify";
import { confirmOption } from "@/helpers/plugin-options";
export default {
  layout: "login",
   //middleware: "guest",
  data() {
    return {
      showPassword: false,
      valid: true,
      entity: {
        userName:"",
        email: "",
        password: ""
      },
      inputValidation,
      loading: false
    };
  },
  methods: {
    async register() {
      if (this.loading) return;
      if (!this.$refs.form.validate()) return;
      this.loading = true;
      const res=await this.$AuthService.Register(this.entity);
      if(res.success){
        this.$router.push("/auth/login");
         this.$confirm(confirmOption.info(res.message, "Bilgilendirme"));
         return;
      }
      this.$confirm(confirmOption.info(res.message, "Uyarı"));
    }
  }
};
</script>

<style scoped>
.login {
  background: #bbdefb;
  border-radius: 8px;
}
</style>
