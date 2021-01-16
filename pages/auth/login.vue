<template>
  <div class="d-flex justify-content-center my-auto">
    <div class="d-flex flex-column p-5 login" style="">
      <div>
        <h4 style="letter-spacing:1.3px;">Lütfen Giriş Yapın</h4>
      </div>
      <v-form ref="form" v-model="valid" lazy-validation>
        <div class="mb-3 mt-5">
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

        <div class="d-flex">
        <v-btn
          color="primary"
          :loading="loading"
          @click="login"
          class="text-capitalize"
        >
          Giriş
        </v-btn>
        <v-btn
          color="success"
          @click="$router.push('/auth/register')"
          class="text-capitalize ml-auto"
        >
          Kayıt Ol
        </v-btn>
        </div>
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
        email: "",
        password: ""
      },
      inputValidation,
      loading: false
    };
  },
  methods: {
    async login() {
      if (this.loading) return;
      if (!this.$refs.form.validate()) return;
      this.loading = true;
      try {
        const res = await this.$auth.loginWith("local", {
          data: this.entity
        });
        this.$router.push("/");
      } catch (error) {
        this.$confirm(confirmOption.info(error, "Hatalı Giriş"));
      }
      this.loading = false;
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
