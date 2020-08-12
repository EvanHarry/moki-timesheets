<template>
  <v-row justify="center">
    <v-col v-if="!loading">
      <v-card outlined>
        <v-card-title>Home</v-card-title>

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

          <div v-if="date">
            <v-divider class="mt-3" />

            <v-select
              v-model="selectedDay"
              :items="days"
              class="mt-3"
              dense
              hide-details
              label="Day"
              outlined
              placeholder="#####"
            />

            <div v-if="selectedDay">
              <v-slider
                v-model="startTime"
                class="mt-5"
                color="primary"
                hint="Start Time"
                :label="parseTime(startTime)"
                min="0"
                max="1440"
                persistent-hint
                step="5"
              />

              <v-slider
                v-model="endTime"
                class="mt-3"
                color="primary"
                hint="End Time"
                :label="parseTime(endTime)"
                min="0"
                max="1440"
                persistent-hint
                step="5"
              />

              <v-slider
                v-model="breakTime"
                class="mt-3"
                color="primary"
                hint="Break"
                :label="parseTime(breakTime)"
                min="0"
                max="60"
                persistent-hint
                step="5"
              />
            </div>
          </div>
        </v-card-text>

        <div v-if="date">
          <v-divider />

          <v-card-text>
            <span class="body-1">Summary</span>

            <ul>
              <li
                v-for="(item, i) in times"
                :key="i"
              >
                {{ dayHours(item) }}
              </li>

              <li>
                <strong>{{ totalHours }}</strong>
              </li>
            </ul>
          </v-card-text>
        </div>

        <v-divider />

        <v-card-actions>
          <v-btn
            @click="reset"
            color="error"
            text
          >
            Reset
          </v-btn>

          <v-spacer />

          <v-btn
            @click="save"
            color="success"
            :disabled="errors.length > 0 || times.length === 0"
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

    <v-col v-else>
      <v-card outlined>
        <v-card-title>Saving...</v-card-title>

        <v-divider />

        <v-card-text>
          <v-progress-linear
            color="primary"
            indeterminate
          />
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapMutations, mapState } from 'vuex'

const minsToString = (total, prefix) => {
  if (total < 0) return `${prefix}: 0 Hrs`

  if (total % 60 === 0) {
    const hrs = Math.floor(total / 60)

    return `${prefix}: ${hrs} Hrs`
  } else {
    const hrs = Math.floor(total / 60)
    const mins = total % 60

    return `${prefix}: ${hrs} Hrs ${mins} Mins`
  }
}

export default {
  name: 'Home',

  data () {
    return {
      date: null,
      dateMenu: false,
      days: ['Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday'],
      errors: [],
      loading: false,
      times: [],
      selectedDay: null,
      startTime: null,
      endTime: null,
      breakTime: null
    }
  },

  computed: {
    ...mapState([
      'user'
    ]),

    totalHours () {
      if (!this.date) return null

      let total = 0

      for (const day of this.times) {
        const mins = day.end - day.start - day.break

        total += mins
      }

      return minsToString(total, 'Total')
    }
  },

  watch: {
    date (val) {
      if (val) {
        this.times = [
          { day: 'Wednesday', start: 540, end: 1020, break: 20 },
          { day: 'Thursday', start: 540, end: 1020, break: 20 },
          { day: 'Friday', start: 540, end: 1020, break: 20 },
          { day: 'Saturday', start: 0, end: 0, break: 0 },
          { day: 'Sunday', start: 0, end: 0, break: 0 },
          { day: 'Monday', start: 540, end: 1020, break: 20 },
          { day: 'Tuesday', start: 540, end: 1020, break: 20 }
        ]

        this.selectedDay = this.days[0]
      }
    },

    selectedDay (val) {
      const day = this.times.find(m => m.day === val)

      if (!val) return

      this.startTime = day.start
      this.endTime = day.end
      this.breakTime = day.break
    },

    startTime (val) {
      this.updateTime(val, 'start')
    },

    endTime (val) {
      this.updateTime(val, 'end')
    },

    breakTime (val) {
      this.updateTime(val, 'break')
    },

    times: {
      deep: true,
      handler (val) {
        if (val) {
          this.validateTimes()
        }
      }
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

    dayHours (item) {
      let total = item.end - item.start - item.break

      return minsToString(total, item.day)
    },

    parseTime (val) {
      let hours = Math.floor(val / 60)
      let mins = val % 60

      if (hours < 10) hours = `0${hours}`
      if (mins < 10) mins = `0${mins}`

      return `${hours}:${mins}`
    },

    reset () {
      this.date = null
      this.times = []
      this.selectedDay = null
    },

    async save () {
      this.loading = true

      const date = new Date(this.date)
      const dateTimestamp = date.getTime()

      const entry = {
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        times: this.times,
        timestamp: dateTimestamp
      }

      await this.$firebase.firestore().collection('timesheets')
        .where('timestamp', '==', dateTimestamp)
        .where('firstName', '==', this.user.firstName)
        .where('lastName', '==', this.user.lastName)
        .get()
        .then((result) => {
          result.forEach((doc) => {
            // Already exists for chosen date
            // Delete
            this.$firebase.firestore().collection('timesheets').doc(doc.id).delete()
              .catch((err) => {
                this.setAlert({
                  msg: err.message,
                  type: 'error'
                })

                return
              })
          })
        })
        .catch((err) => {
          this.setAlert({
            msg: err.message,
            type: 'error'
          })

          return
        })

      await this.$firebase.firestore().collection('timesheets').add(entry)
        .then(() => {
          this.setAlert({
            msg: 'Timesheet saved successfully.',
            type: 'success'
          })
        })
        .catch((err) => {
          this.setAlert({
            msg: err.message,
            type: 'error'
          })
        })
        .finally(() => this.loading = false)
    },

    updateTime (val, type) {
      const i = this.times.findIndex(m => m.day === this.selectedDay)

      if (i < 0) return

      this.times[i][type] = val
    },

    validateTimes () {
      this.errors = []

      for (const item of this.times) {
        const mins = item.end - item.start - item.break

        if (mins < 0) {
          this.errors.push(`${item.day} has an invalid value.`)
        }
      }
    }
  }
}
</script>
