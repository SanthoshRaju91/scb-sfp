<template>
  <section class="home">
    <!-- <div class="page-header">
          <h3>{{ applicationName }}</h3>
        </div> -->
    <nav class="navbar navbar-inverse">
      <div class="container-fluid">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-2">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
              </button>
          <span class="navbar-brand"> {{ applicationName }} </span>
        </div>

        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-2">
          <form class="navbar-form navbar-right">
            <button class="btn btn-danger">Import</button>
          </form>

          <form class="navbar-form navbar-right">
            <button class="btn btn-danger">Submit</button>
          </form>

          <form class="navbar-form navbar-right">
            <div class="btn-group">
              <a href="#" class="btn btn-warning">{{ selectedValue }}</a>
              <a href="#" class="btn btn-warning dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></a>
              <ul class="dropdown-menu">
                <li v-for="item in translationOptions" @click="selectOptions(item)">
                  <a> {{ item.description }} ( {{ item.lang}} ) </a>
                </li>
              </ul>
            </div>
          </form>
        </div>
      </div>
    </nav>

    <div class="container-fluid">
      <div class="text-center" v-if="isError">
        <div class="row">
          <div class="col-lg-offset-3 col-lg-5">
            <div class="alert alert-danger alert-sm">
              <strong>Invalid JSON, please correct the JSON.</strong>
            </div>
          </div>
        </div>
      </div>

      <div class="headers">
        <h4>You are viewing {{ selectedValue }} translation file</h4>
      </div>
      <br>
      <json-editor
      v-bind:translations="translation"
      v-if="isData"
      @updated="updateTranslation"
      @error="checkError"
      ></json-editor>
    </div>
  </section>
</template>

<script>
import axios from 'axios'

export default {
  name: 'hello',
  data () {
    return {
      config: false,
      applicationName: '',
      selectedValue: 'Select',
      translationOptions: [],
      selectedOption: {},
      translation: {},
      price: '',
      isData: false,
      isError: false
    }
  },
  created () {
    /**
    * Service call to check if the application is configured.
    */
    axios.get('/api/config')
      .then(response => {
        if (response) {
          this.applicationName = response.data.NAME
          this.getLanguages()
        } else {
          this.$router.push({ name: 'Config' })
        }
      })
      .catch(err => {
        console.error(err)
      })
  },
  computed: {

  },
  methods: {
    updateTranslation (value) {
      this.translation = value
    },
    selectOptions (selected) {
      this.selectedOption = selected
      this.selectedValue = `${selected.description} (${selected.lang})`
      this.getTranslation()
    },
    checkError (error) {
      this.isError = error
    },
    getTranslation () {
      let selectedLang = this.selectedOption
      this.isData = false
      axios.get('/api/getTranslation/' + selectedLang.lang)
        .then(response => {
          if (response) {
            this.translation = response.data.data
            this.isData = true
          }
        })
        .catch(err => {
          console.error(err)
        })
    },

    getLanguages () {
      axios.get('/api/language')
        .then(response => {
          if (response) {
            this.translationOptions = response.data
            this.selectedOption = response.data[0]
            this.selectedValue = `${this.selectedOption.description} (${this.selectedOption.lang})`
            this.getTranslation()
          }
        })
        .catch(err => {
          console.error(err)
        })
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.home .navbar {
  border-radius: 0px;
}

.home .navbar-brand {
  margin-left: 30px;
  letter-spacing: 1px;
}

.home .navbar-brand:hover {
  color: #fff;
}

.navbar-form button {
  margin-top: 5px;
  padding: 6px 20px;
  letter-spacing: 1px;
  font-weight: 300;
}

.navbar-form .btn-group {
  margin-top: 5px;
}

.navbar-form .btn-group .btn {
  padding: 6px 20px;
}

.headers h4 {
  letter-spacing: 1px;
  font-weight: 300;
}

.home .center-postition {
  position: absolute;
  top: 50%;
  height: 100px;
  margin-top: 100%;
}
</style>
