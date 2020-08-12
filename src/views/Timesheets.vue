<template>
  <v-row justify="center">
    <v-col>
      <v-card outlined>
        <v-card-title>Timesheets</v-card-title>

        <v-divider />

        <v-card-text>
          <v-menu
            v-model="dateMenu"
            :close-on-content-click="false"
            :nudge-bottom="10"
            :nudge-right="33"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="date"
                dense
                hide-details
                label="Week Start"
                outlined
                placeholder="####-##-##"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              />
            </template>

            <v-date-picker
              v-model="date"
              @input="dateMenu = false"
              :allowed-dates="allowedDates"
              color="primary"
              :first-day-of-week="3"
              no-title
              :show-current="false"
            />
          </v-menu>

          <v-select
            v-if="items.length > 0"
            v-model="selectedItem"
            :items="items"
            class="mt-3"
            dense
            hide-details
            :item-text="item => `${item.firstName} ${item.lastName}`"
            label="Staff Member"
            outlined
            placeholder="#####"
            prepend-icon="mdi-account-multiple"
            return-object
          />

          <v-simple-table
            v-if="selectedItem"
            class="mt-3"
          >
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">Day</th>

                  <th class="text-left">Start</th>

                  <th class="text-left">End</th>

                  <th class="text-left">Break</th>

                  <th class="text-right">Total</th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="(item, i) in selectedItem.times"
                  :key="i"
                >
                  <td>{{ item.day }}</td>

                  <td>{{ minsToClock(item.start) }}</td>

                  <td>{{ minsToClock(item.end) }}</td>

                  <td>{{ minsToClock(item.break) }}</td>

                  <td class="text-right">{{ dayHours(item) }}</td>
                </tr>

                <tr>
                  <td>
                    <strong>Total</strong>
                  </td>

                  <td />

                  <td />

                  <td />

                  <td class="text-right">
                    <strong>{{ totalHours }}</strong>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapMutations } from 'vuex'

const minsToString = (total) => {
  if (total < 0) return '0 Hrs'

  if (total % 60 === 0) {
    const hrs = Math.floor(total / 60)

    return `${hrs} Hrs`
  } else {
    const hrs = Math.floor(total / 60)
    const mins = total % 60

    return `${hrs} Hrs ${mins} Mins`
  }
}

export default {
  name: 'Timesheets',

  data () {
    return {
      date: null,
      dateMenu: false,
      items: [],
      selectedItem: null
    }
  },

  computed: {
    totalHours () {
      if (!this.selectedItem) return null

      let total = 0

      for (const day of this.selectedItem.times) {
        const mins = day.end - day.start - day.break

        total += mins
      }

      return minsToString(total)
    }
  },

  watch: {
    date (val) {
      this.selectedItem = null

      const date = new Date(val)
      const timestamp = date.getTime()

      this.getData(timestamp)
    }
  },

  methods: {
    ...mapMutations([
      'setAlert'
    ]),

    allowedDates (val) {
      const date = new Date(val)

      return date.getDay() === 3
    },

    getData (timestamp) {
      this.items = []

      this.$firebase.firestore().collection('timesheets')
        .where('timestamp', '==', timestamp)
        .get()
        .then((result) => {
          result.forEach((doc) => {
            const _doc = doc.data()

            this.items.push(_doc)
          })
        })
        .catch((err) => {
          this.setAlert({
            msg: err.message,
            type: 'error'
          })
        })
    },

    minsToClock (total) {
      let hrs = Math.floor(total / 60)
      let mins = total % 60

      if (hrs < 10) hrs = `0${hrs}`
      if (mins < 10) mins = `0${mins}`

      return `${hrs}:${mins}`
    },

    dayHours (item) {
      const total = item.end - item.start - item.break

      return minsToString(total)
    }
  }
}
</script>
