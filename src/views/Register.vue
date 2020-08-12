<template>
  <v-row justify="center">
    <v-col
      lg="4"
      md="6"
    >
      <v-card outlined>
        <v-card-title>Register</v-card-title>

        <v-divider />

        <v-card-text>
          <v-text-field
            v-model="form.firstName"
            dense
            hide-details
            label="First Name"
            outlined
            placeholder="#####"
          />

          <v-text-field
            v-model="form.lastName"
            class="mt-3"
            dense
            hide-details
            label="Last Name"
            outlined
            placeholder="#####"
          />

          <v-text-field
            v-model="form.email"
            class="mt-3"
            dense
            hide-details
            label="Email Address"
            outlined
            placeholder="user@example.org"
            type="email"
          />

          <v-text-field
            v-model="form.password"
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
            @click="submit"
            :disabled="errors.length > 0"
            block
            color="primary"
            text
          >
            Submit
          </v-btn>
        </v-card-actions>
      </v-card>

      <v-card
        v-if="errors.length > 0"
        class="mt-2"
        color="error"
        dark
        outlined
      >
        <v-card-text>
          <ul>
            <li
              v-for="(item, i) in errors"
              :key="i"
              class="white--text"
            >
              {{ item }}
            </li>
          </ul>
        </v-card-text>
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
      errors: [],
      form: {
        email: '',
        firstName: '',
        lastName: '',
        password: ''
      }
    }
  },

  watch: {
    form: {
      deep: true,
      handler () {
        this.validate()
      },
      immediate: true
    }
  },

  methods: {
    ...mapMutations([
      'setAlert'
    ]),

    submit () {
      this.$firebase.auth().createUserWithEmailAndPassword(this.form.email, this.form.password)
        .then((result) => {
          const uuid = result.user.uid
          const userInfo = {
            firstName: this.form.firstName,
            lastName: this.form.lastName
          }

          this.$firebase.firestore().collection('users').doc(uuid).set(userInfo)
            .catch((err) => {
              this.setAlert({
                msg: err.message,
                type: 'error'
              })
            })
        })
        .catch((err) => {
          this.setAlert({
            msg: err.message,
            type: 'error'
          })
        })
    },

    validate () {
      this.errors = []

      const formKeys = [
        { key: 'email', text: 'Email Address' },
        { key: 'firstName', text: 'First Name' },
        { key: 'lastName', text: 'Last Name' },
        { key: 'password', text: 'password' }
      ]

      for (let i = 0; i < formKeys.length; i++) {
        if (!this.form[formKeys[i].key]) {
          this.errors.push(`${formKeys[i].text} is empty.`)
        }
      }
    }
  }
}
</script>
