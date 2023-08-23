<template>
  <v-app>
    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="12" md="6">
            <v-form validate-on="submit lazy" @submit.prevent="login">
              <v-card>
                <v-card-title class="text-center">Login</v-card-title>
                <v-card-text>
                  <v-text-field
                      v-model="username"
                      label="Username"
                      type="text"
                      variant="underlined"
                      required
                      :error-messages="errors.username!"
                  ></v-text-field>
                  <v-text-field
                      v-model="password"
                      label="Password"
                      type="password"
                      variant="underlined"
                      required
                      :error-messages="errors.password!"
                  ></v-text-field>
                  <v-btn
                      type="submit"
                      block
                      class="mt-2"
                      :disabled="isGeneratingKeys"
                      v-text="isGeneratingKeys ? 'Loading...' : 'Sign In'"
                  ></v-btn>
                </v-card-text>
                <v-card-actions>
                  <span class="link-label">Don't have account? <router-link to="/register">Sign Up</router-link></span>
                </v-card-actions>
              </v-card>
            </v-form>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { CryptUtil } from "@/util/cryptUtil";
import { AuthorizationUtil } from "@/util/authorizationUtil";
import { AuthApi } from "@/api/AuthApi";
import { AuthDto } from "@/api/dto/authDto";
import { UtilApi } from "@/api/UtilApi";
import { useField, useForm } from "vee-validate";
import { object, string, StringSchema } from "yup";
import { useRouter } from "vue-router";
import { User } from "@/entity/user";
import { LocalStorageUtil } from "@/util/localStorageUtil";

const isGeneratingKeys = ref(false);
const router = useRouter();

const {handleSubmit, errors} = useForm({
  validationSchema: object({
    username:
        string()
            .required()
            .max(25)
            .label('Username') as StringSchema<string>,
    password:
        string()
            .required()
            .max(50)
            .label('Password') as StringSchema<string>,
  }),
  initialValues: {
    username: '',
    password: '',
  }
});

const login = handleSubmit(async values => {
  isGeneratingKeys.value = true
  await new Promise((resolve) => setTimeout(resolve, 0));

  const {privateKeyPem, publicKeyPem} = await AuthorizationUtil.generateKeyPair(2048);
  const serverPublicKey = await UtilApi.getServerPublicKey();
  const keyAES = CryptUtil.generateKeyAES(16);
  const resultEncodedRsaKey = CryptUtil.encryptMessageByAES(privateKeyPem, keyAES)
  const resultEncodedEncryptionSecurityKey = CryptUtil.encryptMessageByRSA(keyAES, serverPublicKey, privateKeyPem)

  console.log(keyAES)
  console.log("=================")

  const request = {
    username: values.username,
    password: values.password,
    publicKey: publicKeyPem,
    keyRsa: {
      value: CryptUtil.textToBase64(resultEncodedRsaKey.data),
      digest: CryptUtil.textToBase64(resultEncodedRsaKey.digest),
    },
    keyAes: {
      value: CryptUtil.textToBase64(resultEncodedEncryptionSecurityKey.data),
      digest: CryptUtil.textToBase64(resultEncodedEncryptionSecurityKey.digest),
      signature: CryptUtil.textToBase64(resultEncodedEncryptionSecurityKey.signature),
    },
  } as AuthDto


  AuthApi.login(request)
      .then(response => {
        const decodedPrivateKey = CryptUtil.decryptMessageByAES(
            CryptUtil.base64ToText(response.encodedPrivateKey.value),
            keyAES,
            CryptUtil.base64ToText(response.encodedPrivateKey.digest)
        )
        const user: User = {
          id: response.id,
          username: response.username,
          firstname: response.firstname,
          lastname: response.lastname,
          publicKeyPem: response.publicKey,
          privateKeyPem: decodedPrivateKey,
        }
        console.log(user);
        LocalStorageUtil.saveAuthorizedUserToStorage(user);
        router.push('/messenger');
      })
      .catch(() => console.log("FAILED"))
      .finally(() => isGeneratingKeys.value = false)
});


const {value: username} = useField<string>('username');
const {value: password} = useField<string>('password');

</script>

<style scoped>
.link-label {
  margin-left: 10px;
}

a {
  text-decoration: none;
}
</style>

