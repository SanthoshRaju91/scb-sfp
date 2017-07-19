import axios from 'axios'
import config from '../config'

export default {

  constructURL (url) {
    let env = process.env.NODE_ENV
    return (env === 'production') ? `${config.production.URL}${url}` : `${config.dev.URL}${url}`
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
