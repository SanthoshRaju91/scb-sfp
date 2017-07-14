import axios from 'axios'
import config from '../config'

export default {

  constructURL (url) {
    return `${config.URL}${url}`
  },

  get (url, data) {
    let serviceEndpoint = this.constructURL(url)

    return new Promise((resolve, reject) => {
      axios.get(serviceEndpoint, data)
        .then(response => {
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  post (url, data) {
    let serviceEndpoint = this.constructURL(url)
    return new Promise((resolve, reject) => {
      axios({
        method: 'post',
        url: serviceEndpoint,
        data
      })
        .then(response => {
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
    })
  }
}
