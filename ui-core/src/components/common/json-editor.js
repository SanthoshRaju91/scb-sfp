module.exports = {
  template: `
  <div class="row">
    <div class="col-lg-6">
      <div v-bind:id="jsonID" style="height: 400px;"></div>
    </div>
    <div class="col-lg-1">
      <div class="text-center center-postition">
        <button class="btn btn-primary btn-sm" @click="convertToObject">
          Validate
          <span class="glyphicon glyphicon-chevron-right"></span>
        </button>
      </div>
    </div>
    <div class="col-lg-5">
      <div v-bind:id="objectID" style="height: 400px;"></div>
    </div>
  </div>`,
  props: ['translations'],
  data () {
    return {
      jsonID: '',
      objectID: '',
      ObjectEditor: null,
      JsonEditor: null
    }
  },
  methods: {
    updateValue (value) {
      // Emit the number value through the input event
      this.$emit('input', value)
    },
    onChange () {
      try {
        /* eslint-disable */
        if($('.ace_error').length > 0) {
          this.$emit('error', true)
        } else {
          this.$emit('updated', this.JsonEditor.get())
          this.$emit('error', false)
        }
      } catch (e) {
        this.$emit('error', true, e)
      }
    },
    convertToObject () {
      let translations = this.translations
      this.ObjectEditor.set(translations)
    }
  },
  created () {
    this.jsonID = `element-${Math.random()}`
    this.objectID = `element-${Math.random()}`
  },
  mounted () {
    /* eslint-disable */
    let JSONcontainer = document.getElementById(this.jsonID)
    let options = {
      'mode': 'code',
      'search': true,
      onChange: this.onChange
    }
    /* eslint-disable */
    let JsonEditor = new JSONEditor(JSONcontainer, options)
    this.JsonEditor = JsonEditor
    JsonEditor.set(this.translations)

    let ObjectContainer = document.getElementById(this.objectID);
    let OBJOptions = {
      "mode": "tree",
      "search": true
    }

    let ObjectEditor = new JSONEditor(ObjectContainer, OBJOptions);
    this.ObjectEditor = ObjectEditor
  }
}
