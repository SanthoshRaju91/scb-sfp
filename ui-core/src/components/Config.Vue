<template lang="html">
  <div>
    <div class="page-header">
      <h3 class="text-center">Configuration</h3>
    </div>

    <div class="row">
      <div class="col-lg-11">
        <div class="row" v-if="errorMode">
          <div class="col-lg-6 col-lg-offset-2">
            <div class="alert alert-dismissible alert-danger animated bounce">
              <strong>All fields are required.</strong>
            </div>
          </div>
        </div>

        <div class="form-horizontal">
          <div class="form-group">
            <label for="inputEmail" class="col-lg-2 control-label">Name</label>
            <div class="col-lg-7">
              <input type="text" class="form-control" id="inputEmail" placeholder="Application Name" v-model="applicationName">
            </div>
            <div class="col-lg-2">
              <p class="">Should be more than 5 characters.</p>
            </div>
          </div>

          <br>

          <div class="form-group">
            <div class="row">
              <div class="col-lg-8 col-md-8 col-md-offset-2 col-lg-offset-3">
                <div class="row">
                  <div class="col-lg-6 col-md-6">
                    <div class="panel option" v-bind:class="[isFile ? 'panel-success' : 'panel-default']" v-on:click="selectOption('file')">
                      <div class="panel-body">
                        <h4 class="text-center option-header">File</h4>
                        <p>This will be stored on the specified location on the remote server</p>
                      </div>
                    </div>
                  </div>
                  <div class="col-lg-6 col-md-6">
                    <div class="panel option" v-bind:class="[isDB ? 'panel-success' : 'panel-default']" v-on:click="selectOption('db')">
                      <div class="panel-body">
                        <h4 class="text-center option-header">Database</h4>
                        <p>All the translation's & configurations will be stored in the specified Database URL.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="animated slideInUp" v-if="isFile">
            <div class="form-group">
              <label for="inputEmail" class="col-lg-2 control-label">Remote location</label>
              <div class="col-lg-10">
                <input
                  type="text"
                  class="form-control"
                  id="inputEmail"
                  placeholder="Remote Location"
                  v-model="remoteLocation">
              </div>
            </div>
            <div class="form-group">
              <label for="inputEmail" class="col-lg-2 control-label">Git Repo</label>
              <div class="col-lg-6">
                <input
                  type="text"
                  class="form-control"
                  id="inputEmail"
                  placeholder="Git Repo"
                  v-model="gitRepo">
              </div>
              <div class="col-lg-2">
                <p class="info-message">This is used for creating a back up of your file.</p>
              </div>
            </div>

            <div class="form-group">
              <div class="col-lg-10 col-lg-offset-2">
                <button type="submit" class="btn btn-success btn-lg save-btn" v-on:click="saveConfig()">Save Configuration</button>
              </div>
            </div>
          </div>

          <div class="animated slideInUp" v-if="isDB">
            <div class="form-group">
              <label for="inputEmail" class="col-lg-2 control-label">Mongo DB URL</label>
              <div class="col-lg-10">
                <input
                  type="text"
                  class="form-control"
                  id="inputEmail"
                  placeholder="Mongo DB URL"
                  v-model="mongoURL">
              </div>
            </div>

            <br>
            <div class="form-group">
              <div class="col-lg-10 col-lg-offset-2">
                <button type="submit" class="btn btn-success btn-lg save-btn" v-on:click="saveConfig()">Save Configuration</button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isFile: false,
      isDB: false,
      applicationName: '',
      mode: '',
      remoteLocation: '',
      gitRepo: '',
      mongoURL: '',
      errorMode: false
    }
  },
  methods: {
    selectOption (selected) {
      this.isFile = this.isDB = this.errorMode = false
      if (selected === 'file') {
        this.isFile = true
        this.mode = selected
      } else if (selected === 'db') {
        this.isDB = true
        this.mode = selected
      }
    },

    saveConfig () {
      let mode = this.mode
      if (mode === 'file') {
        if (this.applicationName.length > 5 && this.remoteLocation && this.gitRepo) {
          this.errorMode = false
        } else {
          this.errorMode = true
        }
      } else if (mode === 'db') {
        if (this.applicationName.length > 5 && this.mongoURL) {
          this.errorMode = false
        } else {
          this.errorMode = true
        }
      }
    }
  }
}
</script>

<style lang="css" scoped>

  .page-header {
      margin-left: 35px;
      margin-right: 35px;
      border-bottom: 1px solid rgba(103, 128, 159, 0.5);
  }

  .page-header h3 {
    text-transform: uppercase;
    letter-spacing: 2px;
    font-weight: 400;
    font-weight: bolder;
  }

  .option-header {
    text-transform: uppercase;
    font-weight: 300;
    letter-spacing: 2px;
  }

  .option p {
    cursor: pointer;
    font-weight: 300;
    letter-spacing: 1px;
  }

  .form-group .info-message {
    letter-spacing: .5px;
    font-weight: 300;
  }

  .form-group label {
    letter-spacing: .5px;
  }
  .save-btn {
    font-size: 16px;
    letter-spacing: 1.5px;
    padding: 12px 25px;
  }
</style>
