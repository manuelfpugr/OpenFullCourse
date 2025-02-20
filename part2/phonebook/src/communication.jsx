import axios from 'axios'

const baseUrl = 'api/persons'

const getList = () => {
  return axios.get(baseUrl)
}

const create = (newPerson) => {
  return axios.post(baseUrl, newPerson)
}

const update = (id, updatedPerson) => {
  return axios.put(`${baseUrl}/${id}`, updatedPerson)
}

const remove = (id) => {
  return axios.delete(`${baseUrl}/${id}`)
}

export default { getList, create, update, remove }