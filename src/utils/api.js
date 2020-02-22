import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:8080'

axios.interceptors.response.use(function (response) {
  return response.data
}, function (error) {
  return Promise.reject(error)
})
export default ({method,url,data,params}) => {
  return axios({
    method,
    url,
    data,
    params
  })
}