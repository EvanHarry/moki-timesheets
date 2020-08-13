<template>
  <v-row justify="center">
    <v-col
      lg="4"
      md="6"
    >
      <v-card outlined>
        <v-card-title>Please Login</v-card-title>

        <v-divider />

        <v-card-text>
          <v-text-field
            v-model="email"
            dense
            hide-details
            label="Email Address"
            outlined
            placeholder="user@example.org"
            type="email"
          />

          <v-text-field
            v-model="password"
            class="mt-3"
            dense
            hide-details
            label="Password"
            outlined
            placeholder="#####"
            type="password"
          />
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-btn
            @click="register"
            color="success"
            text
          >
            Register
          </v-btn>

          <v-spacer />

          <v-btn
            @click="login"
            color="primary"
            text
          >
            Submit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'Login',

  data () {
    return {
      email: '',
      password: ''
    }
  },

  methods: {
    ...mapMutations([
      'setAlert'
    ]),

    login () {
      this.$firebase.auth().signInWithEmailAndPassword(this.email, this.password)
        .catch((err) => {
          this.setAlert({
            msg: err.message,
            type: 'error'
          })
        })
    },

    register () {
      this.$router.push('/register')
    }
  }
}
</script>
