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
            <button class="btn btn-danger" data-toggle="modal" data-target="#importConfirmation" v-bind:disabled="inProgress">Import</button>
          </form>

          <form class="navbar-form navbar-right">
            <button class="btn btn-danger" data-toggle="modal" data-target="#submitConfirmation" v-bind:disabled="inProgress">Submit</button>
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
        <div class="row">
          <div class="col-lg-6">
            <h5>You are viewing {{ selectedValue }} translation file</h5>
          </div>
          <div class="col-lg-6" v-if="showSubmit">
            <div class="alert alert-sm alert-warning">
              <p> {{ submitMsg }}</p>
            </div>
          </div>
        </div>
      </div>
      <br>
      <json-editor
      v-bind:translations="translation"
      v-if="isData"
      @updated="updateTranslation"
      @error="checkError"
      ></json-editor>
    </div>

    <!-- Modal for import confirmation  -->
    <div class="modal fade bs-example-modal-sm" id="importConfirmation" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">Warning</h4>
          </div>

          <div class="modal-body">
            <p>Your current changes will be lost, do you want to continue ?</p>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-default btn-sm" data-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary btn-sm" data-dismiss="modal" @click="refreshTranslations">Proceed</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal for submit confirmation -->
    <div class="modal fade bs-example-modal-sm" id="submitConfirmation" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">Merging your changes</h4>
          </div>

          <div class="modal-body">
            <div class="alert alert-sm alert-danger" v-if="showModalError">
              <strong>Git credentials are required.</strong>
            </div>

            <p>Please provide your git credentials for merging the translations ?</p>
            <br/>
            <div class="form-horizontal">
              <div class="form-group">
                <label for="inputEmail" class="col-lg-4 control-label">Github email Address</label>
                <div class="col-lg-6">
                  <input type="email" class="form-control" id="inputEmail" placeholder="Email address" v-model="gitEmailAddress">
                </div>
              </div>

              <div class="form-group">
                <label for="inputEmail" class="col-lg-4 control-label">Github password</label>
                <div class="col-lg-6">
                  <input type="password" class="form-control" id="inputEmail" placeholder="Password" v-model="gitPassword">
                </div>
              </div>

              <div class="form-group">
                <div class="col-lg-6 col-lg-offset-4">
                  <button type="submit" class="btn btn-default btn-sm btn-cancel" data-dismiss="modal">Cancel</button>
                  <button type="submit" class="btn btn-success btn-sm" @click="submitTranslation">Submit</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import ajax from '@/services/ajax'

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
      isError: false,
      gitPassword: '',
      gitEmailAddress: '',
      inProgress: true,
      showModalError: false,
      showSubmit: false,
      sumbitMsg: ''
    }
  },
  /**
  * Component hook, calls the config service to check if the application is configured
  * @method created
  */
  created () {
    /** Service call to check if the application is configured. */
    ajax.get('/api/config')
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
  methods: {
    /**
    * Function handler for updating the translations
    * @method updateTranslation
    * @param value
    */
    updateTranslation (value) {
      this.translation = value
    },

    /**
    * Function handler for selected options
    * @method selectedOptions
    * @param selected
    */
    selectOptions (selected) {
      this.selectedOption = selected
      this.selectedValue = `${selected.description} (${selected.lang})`
      this.getTranslation()
    },

    /**
    * Function handler for error check
    * @method checkError
    * @param error
    */
    checkError (error) {
      this.isError = error
    },

    /**
    * Function for getting the translations.json for the selected language
    * @method getTranslation
    */
    getTranslation () {
      let selectedLang = this.selectedOption
      this.isData = false
      this.inProgress = true
      ajax.get(`/api/getTranslation/${selectedLang.lang}`)
        .then(response => {
          if (response) {
            this.translation = response.data.data
            this.isData = true
            this.inProgress = false
          }
        })
        .catch(err => {
          this.inProgress = false
          console.error(err)
        })
    },

    /**
    * Function to get the available languages
    * @method getLanguages
    */
    getLanguages () {
      ajax.get('/api/language')
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
    },

    /**
    * Function handler for importing new translations
    * @method refreshTranslations
    */
    refreshTranslations () {
      setTimeout(() => {
        this.getTranslation()
      }, 1000)
    },

    /**
    * Function handler for submitting the translation file for merging
    * @method submitTranslation
    */
    submitTranslation () {
      /* eslint-disable */
      if(this.gitEmailAddress && this.gitPassword) {
        let selectedLang = this.selectedOption.lang
        let selectedValue = this.selectedValue
        ajax.post('/api/submit', { land: selectedLang})
          .then(response => {
            if(response.data.transactionSuccess) {
              this.showSubmit = true
              this.submitMsg = `New translation written & imported for ${selectedValue}`
              this.getTranslation()
            } else {
              this.showSubmit = true
              this.submitMsg = `Something went wrong, while saving translation for ${selectedValue}`
            }
            $('#submitConfirmation').modal('hide')
          })
          .catch(err => {
            console.error(err);
            $('#submitConfirmation').modal('hide')

          })
      } else {
        this.showModalError = true
      }
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

.headers h5 {
  letter-spacing: 1px;
  font-weight: 300;
}

.home .center-postition {
  position: absolute;
  top: 50%;
  height: 100px;
  margin-top: 100%;
}

.modal-title {
  letter-spacing: 1px;
  font-weight: 800;
}

.form-group label {
  font-weight: 300;
  letter-spacing: .5px;
  font-size: 14px;
}
.form-group .btn-cancel {
  margin-right: 10px;
}

.modal-body p {
  letter-spacing: 1px;
  font-weight: 300;
}
</style>
