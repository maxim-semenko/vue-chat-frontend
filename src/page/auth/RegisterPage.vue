<template>
  <v-app>
    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="12" md="6">
            <v-form validate-on="submit lazy" @submit.prevent="register">
              <v-card>
                <v-card-title class="text-center">Registration</v-card-title>
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
                  <v-text-field
                      v-model="firstname"
                      label="Firstname"
                      type="text"
                      variant="underlined"
                      required
                      :error-messages="errors.firstname!"
                  ></v-text-field>
                  <v-text-field
                      v-model="lastname"
                      label="Lastname"
                      type="text"
                      variant="underlined"
                      required
                      :error-messages="errors.lastname!"
                  ></v-text-field>
                  <v-btn
                      type="submit"
                      block
                      class="mt-2"
                      :disabled="isGeneratingKeys"
                      v-text="isGeneratingKeys ? 'Loading...' : 'Sign Up'"
                  ></v-btn>
                </v-card-text>
                <v-card-actions>
                  <span class="link-label">Already have account? <router-link to="/login">Sign In</router-link></span>
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
import { LocalStorageUtil } from "@/util/localStorageUtil";
import { User } from "@/entity/user";

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
    firstname:
        string()
            .max(25)
            .label('Firstname') as StringSchema<string>,
    lastname:
        string()
            .max(25)
            .label('Lastname') as StringSchema<string>,
  }),
  initialValues: {
    username: '',
    password: '',
    firstname: '',
    lastname: '',
  }
});

const register = handleSubmit(async values => {
  isGeneratingKeys.value = true
  await new Promise((resolve) => setTimeout(resolve, 0));

  const {privateKeyPem, publicKeyPem} = await AuthorizationUtil.generateKeyPair(2048);
  const serverPublicKey = await UtilApi.getServerPublicKey();
  const keyAES = CryptUtil.generateKeyAES(16);
  const resultEncodedRsaKey = CryptUtil.encryptMessageByAES(privateKeyPem, keyAES)
  const resultEncodedEncryptionSecurityKey = CryptUtil.encryptMessageByRSA(keyAES, serverPublicKey, privateKeyPem)

  const request = {
    username: values.username,
    password: values.password,
    firstname: values.firstname,
    lastname: values.lastname,
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

  AuthApi.register(request)
      .then(response => {
        router.push('/messenger');
        const user: User = {
          id: response.id,
          username: response.username,
          firstname: response.firstname,
          lastname: response.lastname,
          publicKeyPem: publicKeyPem,
          privateKeyPem: privateKeyPem,
        }
        LocalStorageUtil.saveAuthorizedUserToStorage(user);
      })
      .catch(() => console.log("FAILED"))
      .finally(() => isGeneratingKeys.value = false)
});


const {value: username} = useField<string>('username');
const {value: password} = useField<string>('password');
const {value: firstname} = useField<string>('firstname');
const {value: lastname} = useField<string>('lastname');

</script>

<style scoped>
  .link-label {
    margin-left: 10px;
  }
  a {
    text-decoration: none;
  }
</style>

