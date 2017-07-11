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
              <li v-for="item in translationOptions" v-on:click="selectOptions(item)">
                <a> {{ item.value }} ( {{ item.key}} ) </a>
              </li>
            </ul>
          </div>
        </form>
      </div>
    </div>
    </div>
  </nav>
</section>
</template>

<script>
export default {
  name: 'hello',
  data () {
    return {
      config: false,
      applicationName: '',
      selectedValue: 'Select',
      translationOptions: [],
      selectedOption: {}
    }
  },
  created () {
    /** TODO: need to have initial call, to check for configuration */
    // this.$router.push({ name: 'Config' })
    this.applicationName = 'SCB - SFP'

    let options = [{
      key: 'en',
      value: 'English'
    }, {
      key: 'zh',
      value: 'Chinese'
    }, {
      key: 'zh_CN',
      value: 'Traditional Chinese'
    }]

    this.translationOptions = options
  },
  methods: {
    selectOptions (selected) {
      this.selectedOption = selected
      this.selectedValue = `${selected.value} (${selected.key})`
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
</style>
