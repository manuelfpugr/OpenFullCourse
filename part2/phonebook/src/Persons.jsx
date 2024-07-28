import React from 'react'

const Persons = ({ persons, handleDelete }) => (
  <div>
    {persons.map(person => (
      <div key={person.id}>
        {person.name} {person.number}
        {handleDelete && <button onClick={() => handleDelete(person.id)}>delete</button>}
      </div>
    ))}
  </div>
)

export default Persons