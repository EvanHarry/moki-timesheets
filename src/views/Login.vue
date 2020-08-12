<template>
  <v-row justify="center">
    <v-col
      lg="4"
      md="6"
    >
      <v-card outlined>
        <v-card-title>Login</v-card-title>

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
            @click="login"
            block
            color="primary"
            text
          >
            Submit
          </v-btn>
        </v-card-actions>
      </v-card>

      <v-alert
        v-if="response"
        class="mt-2"
        :type="response.type"
      >
        {{ response.msg }}
      </v-alert>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'Login',

  data () {
    return {
      email: '',
      password: '',
      response: null
    }
  },

  methods: {
    login () {
      this.response = null

      this.$firebase.auth().signInWithEmailAndPassword(this.email, this.password)
        .then(() => {
          // this.$router.push('/')

          // this.$firebase.firestore().collection('users').doc(uuid).get()
          //   .then((doc) => {
          //     if (doc.exists) {
          //       const user = doc.data()

          //       this.response = {
          //         msg: `Welcome, ${user.firstName} ${user.lastName}!`,
          //         type: 'success'
          //       }
          //     } else {
          //       this.response = {
          //         msg: 'Error retrieving user details.',
          //         type: 'error'
          //       }
          //     }
          //   })
        })
        .catch((err) => {
          const errorMessage = err.message

          this.response = {
            msg: errorMessage,
            type: 'error'
          }
        })
    }
  }
}
</script>
