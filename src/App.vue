<template>
  <v-app>
    <v-app-bar
      app
      clipped-left
      color="primary"
      dark
      dense
      flat
    >
      <v-app-bar-nav-icon
        v-if="user && $vuetify.breakpoint.mdAndDown"
        @click="drawer = !drawer"
      />

      <v-toolbar-title>MOKI</v-toolbar-title>

      <v-spacer />

      <v-btn
        v-if="user"
        @click="logout"
        text
      >
        Logout
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer
      v-if="user"
      v-model="drawer"
      app
      clipped
    >
      <template v-slot:prepend>
        <v-list-item two-line>
          <v-list-item-avatar>
            <v-icon x-large>mdi-account-circle</v-icon>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>{{ user.firstName }} {{ user.lastName }}</v-list-item-title>

            <v-list-item-subtitle>App Version 2020.2.1</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>

      <v-divider />

      <v-list
        dense
        nav
      >
        <v-list-item to="/">
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item to="/timesheets">
          <v-list-item-icon>
            <v-icon>mdi-calendar</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Timesheets</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container
        class="pt-0"
        fluid
      >
        <router-view />
      </v-container>
    </v-main>

    <v-footer
      app
      padless
    >
      <v-col
        class="text-center"
        cols="12"
      >
        {{ new Date().getFullYear() }} - <strong>Evan Harry</strong>
      </v-col>
    </v-footer>

    <v-snackbar
      v-if="alert"
      v-model="alert"
      bottom
      :color="alert.type"
      :timeout="5000"
    >
      {{ alert.msg }}

      <template v-slot:action="{ attrs }">
        <v-btn
          @click="setAlert(null)"
          dark
          icon
          v-bind="attrs"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
import { mapMutations, mapState } from 'vuex'

export default {
  name: 'App',

  data () {
    return {
      drawer: null
    }
  },

  computed: {
    ...mapState([
      'user'
    ]),

    alert: {
      get () {
        return this.$store.state.alert
      },

      set () {
        this.setAlert(null)
      }
    }
  },

  methods: {
    ...mapMutations([
      'setAlert',
      'setUser'
    ]),

    logout () {
      this.$firebase.auth().signOut()
        .then(() => this.$router.push('/login'))
    }
  },

  created () {
    this.$firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const uuid = user.uid

        this.$firebase.firestore().collection('users').doc(uuid).get()
          .then((doc) => {
            if (doc.exists) {
              const _user = {
                ...doc.data(),
                email: user.email
              }

              this.setUser(_user)
            } else {
              console.log('Error retrieving user info.')
            }
          })
      } else {
        this.setUser(null)
      }
    })
  }
}
</script>
