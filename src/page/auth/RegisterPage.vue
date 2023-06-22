<template>
  <v-app>
    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="12" md="6">
            <v-card>
              <v-card-title class="text-center">Registration</v-card-title>
              <v-card-text>
                <v-form>
                  <v-text-field
                      v-model="formData.username"
                      label="Username"
                      type="text"
                      variant="underlined"
                      required
                      :error-messages="v$?.username?.$error ? v$?.username?.$errors[0].$message : ''"
                  ></v-text-field>
                  <v-text-field
                      v-model="formData.password"
                      label="Password"
                      type="password"
                      variant="underlined"
                      required
                      :error-messages="v$?.password?.$error ? v$?.password?.$errors[0].$message : ''"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn color="primary" @click="submitForm" :disabled="isGeneratingKeys">Sign up</v-btn>
                <router-link to="/login">
                  <v-btn color="primary">Authorization</v-btn>
                </router-link>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import useVuelidate from "@vuelidate/core";
import {minLength, required} from "@vuelidate/validators";
import {defineComponent, reactive, ref} from "vue";
import {CryptService} from "@/service/cryptService";
import {AuthorizationService} from "@/service/authorizationService";

export default defineComponent({
  name: 'RegisterPage',
  components: {},
  setup() {
    let isGeneratingKeys = ref(false);

    const formData = reactive({
      username: '',
      password: '',
    });

    const formRules = {
      username: {required, minLength: minLength(2)},
      password: {required, minLength: minLength(8)},
    }


    const v$ = useVuelidate(formRules, formData);

    const submitForm = async () => {
      const valid = await v$.value.$validate();
      if (valid) {
        isGeneratingKeys.value = true
        await new Promise((resolve) => setTimeout(resolve, 0)); // Небольшая задержка
        const {privateKeyPem, publicKeyPem} = await AuthorizationService.generateKeyPair();

        console.log(privateKeyPem, publicKeyPem)
        isGeneratingKeys.value = false
      }
    }

    return {
      isGeneratingKeys,
      formData,
      submitForm,
      v$
    }
  }
})
</script>

