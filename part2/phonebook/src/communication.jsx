import axios from 'axios'

const baseUrl = '/api/persons'

const getList = () => {
  return axios.get(baseUrl)
}

const create = (newPerson) => {
  console.log('Creating', newPerson)
  return axios.post(`baseUrl`, newPerson)
}

const update = (id, updatedPerson) => {
  return axios.put(`${baseUrl}/${id}`, updatedPerson)
}

const remove = (id) => {
  console.log('Removing', id)
  return axios.delete(`${baseUrl}/${id}`)
}

export default { getList, create, update, remove }