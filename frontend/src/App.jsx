import { useState, useEffect } from 'react'
import UserList from './components/UserList'
import UserForm from './components/UserForm'
import './App.css'

/**
 * Main App component
 * Demonstrates connection between React frontend and Express backend
 */
function App() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  /**
   * Fetch users from backend API
   */
  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/users')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.success) {
        setUsers(data.data)
        setError(null)
      } else {
        throw new Error(data.message || 'Failed to fetch users')
      }
    } catch (err) {
      console.error('Error fetching users:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Add new user
   * @param {object} userData - User data to add
   */
  const addUser = async (userData) => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.success) {
        // Refresh users list
        fetchUsers()
        return { success: true, message: data.message }
      } else {
        throw new Error(data.message || 'Failed to add user')
      }
    } catch (err) {
      console.error('Error adding user:', err)
      return { success: false, message: err.message }
    }
  }

  /**
   * Delete user
   * @param {number} userId - ID of user to delete
   */
  const deleteUser = async (userId) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.success) {
        // Refresh users list
        fetchUsers()
        return { success: true, message: data.message }
      } else {
        throw new Error(data.message || 'Failed to delete user')
      }
    } catch (err) {
      console.error('Error deleting user:', err)
      return { success: false, message: err.message }
    }
  }

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <h1>🏠 Homigo</h1>
        <p>Full-Stack Application with React + Express + PostgreSQL</p>
      </header>

      <main className="App-main">
        <div className="container">
          <section className="section">
            <h2>Add New User</h2>
            <UserForm onSubmit={addUser} />
          </section>

          <section className="section">
            <h2>Users List</h2>
            {loading && <div className="loading">Loading users...</div>}
            {error && <div className="error">Error: {error}</div>}
            {!loading && !error && (
              <UserList 
                users={users} 
                onDelete={deleteUser}
                onRefresh={fetchUsers}
              />
            )}
          </section>
        </div>
      </main>

      <footer className="App-footer">
        <p>Built with ❤️ using React, Express.js, and PostgreSQL</p>
      </footer>
    </div>
  )
}

export default App
