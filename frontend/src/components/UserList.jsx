import { useState } from 'react'

/**
 * UserList component
 * Displays a list of users with delete functionality
 */
function UserList({ users, onDelete, onRefresh }) {
  const [deletingId, setDeletingId] = useState(null)

  /**
   * Handle user deletion
   * @param {number} userId - ID of user to delete
   */
  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setDeletingId(userId)
      const result = await onDelete(userId)
      setDeletingId(null)
      
      if (result.success) {
        alert('User deleted successfully!')
      } else {
        alert(`Error: ${result.message}`)
      }
    }
  }

  /**
   * Format date for display
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date
   */
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (users.length === 0) {
    return (
      <div className="no-users">
        <p>No users found.</p>
        <button onClick={onRefresh} className="btn btn-secondary">
          Refresh
        </button>
      </div>
    )
  }

  return (
    <div className="user-list">
      <div className="user-list-header">
        <h3>Total Users: {users.length}</h3>
        <button onClick={onRefresh} className="btn btn-secondary">
          Refresh List
        </button>
      </div>
      
      <div className="users-grid">
        {users.map((user) => (
          <div key={user.id} className="user-card">
            <div className="user-info">
              <h4>{user.name}</h4>
              <p className="user-email">{user.email}</p>
              <p className="user-date">
                Created: {formatDate(user.created_at)}
              </p>
              {user.updated_at && (
                <p className="user-date">
                  Updated: {formatDate(user.updated_at)}
                </p>
              )}
            </div>
            
            <div className="user-actions">
              <button
                onClick={() => handleDelete(user.id)}
                disabled={deletingId === user.id}
                className="btn btn-danger"
              >
                {deletingId === user.id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default UserList
