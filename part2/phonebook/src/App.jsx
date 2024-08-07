import React, { useState, useEffect } from 'react'
import communication from './communication'
import Filter from './Filter'
import PersonForm from './PersonForm'
import Persons from './Persons'
import Notification from './Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState({ message: null, type: null })

  useEffect(() => {
    communication
      .getList()
      .then(response => setPersons(response.data))
      .catch(error => console.error('Error fetching data:', error))
  }, [])

  const handleInputChange = (event) => setNewName(event.target.value)

  const handleNumberChange = (event) => setNewNumber(event.target.value)

  const handleFilterChange = (event) => {
    const value = event.target.value
    setFilter(value)
    if (value === '') setPersons([])
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this person?')) {
      communication
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
          setNotification({ message: 'Person deleted successfully', type: 'success' })
          setTimeout(() => setNotification({ message: null, type: null }), 5000)
        })
        .catch(error => {
          setNotification({ message: 'Error deleting person', type: 'error' })
          setTimeout(() => setNotification({ message: null, type: null }), 5000)
          console.error('Error deleting person:', error)
        })
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if(newName === '' || newNumber === '') {
      alert('Name or number cannot be empty')
      return
    }
    const existingPerson = persons.find(person => person.name === newName && person.number === newNumber)
    if (existingPerson) {
      alert(`${newName} with number ${newNumber} is already added to phonebook`)
      return
    }
    if (existingPerson) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const updatedPerson = { ...existingPerson, number: newNumber }
        communication
          .update(existingPerson.id, updatedPerson)
          .then(response => {
            setPersons(persons.map(person => person.id !== existingPerson.id ? person : response.data))
            setNewName('')
            setNewNumber('')
            setNotification({ message: `Updated ${newName}'s number`, type: 'success' })
            setTimeout(() => setNotification({ message: null, type: null }), 5000)
          })
          .catch(error => {
            if (error.response && error.response.status === 404) {
              setNotification({ message: `Information of ${newName} has already been removed from server`, type: 'error' })
              setPersons(persons.filter(person => person.id !== existingPerson.id))
            } else {
              setNotification({ message: `Error updating ${newName}`, type: 'error' })
            }
            setTimeout(() => setNotification({ message: null, type: null }), 5000)
            console.error('Error updating person:', error)
          })
      }
      return
    }

    const newPerson = { name: newName, number: newNumber }

    communication
      .create(newPerson)
      .then(response => {
        setPersons(persons.concat(response.data))
        setNewName('')
        setNewNumber('')
        setNotification({ message: `Added ${newName}`, type: 'success' })
        setTimeout(() => setNotification({ message: null, type: null }), 5000)
      })
      .catch(error => {
        setNotification({ message: 'Error adding person', type: 'error' })
        setTimeout(() => setNotification({ message: null, type: null }), 5000)
        console.error('Error adding person:', error)
      })
  }

  const personsToShow = filter === ''
    ? persons
    : persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification.message} type={notification.type} />
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h2>add a new</h2>
      <PersonForm 
        onSubmit={handleSubmit}
        newName={newName}
        handleInputChange={handleInputChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons persons={persons} handleDelete={handleDelete}/>
      
      <h2>Filtered Names</h2>
      <Persons persons={personsToShow} />
    </div>
  )
}

export default App