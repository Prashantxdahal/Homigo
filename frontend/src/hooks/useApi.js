import { useState, useEffect, useCallback } from 'react'

/**
 * Custom hook for API operations
 * Provides reusable API functionality across components
 */
function useApi() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  /**
   * Generic API call function
   * @param {string} url - API endpoint URL
   * @param {object} options - Fetch options
   * @returns {Promise} API response
   */
  const apiCall = useCallback(async (url, options = {}) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.message || 'API call failed')
      }

      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * GET request
   * @param {string} url - API endpoint URL
   * @returns {Promise} API response
   */
  const get = useCallback((url) => {
    return apiCall(url, { method: 'GET' })
  }, [apiCall])

  /**
   * POST request
   * @param {string} url - API endpoint URL
   * @param {object} data - Request body data
   * @returns {Promise} API response
   */
  const post = useCallback((url, data) => {
    return apiCall(url, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }, [apiCall])

  /**
   * PUT request
   * @param {string} url - API endpoint URL
   * @param {object} data - Request body data
   * @returns {Promise} API response
   */
  const put = useCallback((url, data) => {
    return apiCall(url, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }, [apiCall])

  /**
   * DELETE request
   * @param {string} url - API endpoint URL
   * @returns {Promise} API response
   */
  const del = useCallback((url) => {
    return apiCall(url, { method: 'DELETE' })
  }, [apiCall])

  return {
    loading,
    error,
    get,
    post,
    put,
    delete: del,
  }
}

/**
 * Custom hook specifically for user operations
 * Provides user-specific API methods
 */
function useUsers() {
  const api = useApi()
  const [users, setUsers] = useState([])

  /**
   * Fetch all users
   */
  const fetchUsers = useCallback(async () => {
    try {
      const response = await api.get('/api/users')
      setUsers(response.data)
      return response
    } catch (error) {
      console.error('Error fetching users:', error)
      throw error
    }
  }, [api])

  /**
   * Create a new user
   * @param {object} userData - User data
   */
  const createUser = useCallback(async (userData) => {
    try {
      const response = await api.post('/api/users', userData)
      await fetchUsers() // Refresh users list
      return response
    } catch (error) {
      console.error('Error creating user:', error)
      throw error
    }
  }, [api, fetchUsers])

  /**
   * Update a user
   * @param {number} userId - User ID
   * @param {object} userData - Updated user data
   */
  const updateUser = useCallback(async (userId, userData) => {
    try {
      const response = await api.put(`/api/users/${userId}`, userData)
      await fetchUsers() // Refresh users list
      return response
    } catch (error) {
      console.error('Error updating user:', error)
      throw error
    }
  }, [api, fetchUsers])

  /**
   * Delete a user
   * @param {number} userId - User ID
   */
  const deleteUser = useCallback(async (userId) => {
    try {
      const response = await api.delete(`/api/users/${userId}`)
      await fetchUsers() // Refresh users list
      return response
    } catch (error) {
      console.error('Error deleting user:', error)
      throw error
    }
  }, [api, fetchUsers])

  // Fetch users on hook initialization
  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  return {
    users,
    loading: api.loading,
    error: api.error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  }
}

export { useApi, useUsers }
