import axios from 'axios'

const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api/all'

const getList = () => {
  return axios.get(baseUrl)
}

const getListName = (name) => {
    return axios.get(`https://studies.cs.helsinki.fi/restcountries/api/name/${name}`)
    }

export default { getList , getListName }
