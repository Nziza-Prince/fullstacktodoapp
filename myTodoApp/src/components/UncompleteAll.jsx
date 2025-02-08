import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import { useState } from 'react'
import { toast } from "react-toastify";// Add this package for notifications

const UncompleteAll = ({ refreshTodos }) => { // Add refreshTodos prop
    const [isLoading, setIsLoading] = useState(false)
    const token = localStorage.getItem('token')
    const decodedToken = token ? jwtDecode(token) : null
    const userId = decodedToken?.userId

    // Handle case where there's no token or userId
    if (!token || !userId) {
        return null // Or redirect to login
    }

    const backendUrl = `${import.meta.env.VITE_UBASE_URL}/${userId}/todos`

    const handleUncompleteAll = async () => {
        try {
            setIsLoading(true)
            const response = await axios.patch(`${backendUrl}/status/un-complete-all`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (response.status === 200) {
                toast.success('All completed todos have been cleared!')
                refreshTodos() // Refresh the todo list
            }
        } catch (error) {
            console.error('Failed to uncomplete todos:', error)
            toast.error(error.response?.data?.message || 'Failed to clear completed todos')
        } finally {
            setIsLoading(false)
        }
    }

    // const confirmAndUncomplete = () => {
    //     if (window.confirm('Are you sure you want to clear all completed todos?')) {
    //         handleUncompleteAll()
    //     }
    // }

    return (
        <div>
            <button
                className="bg-red-500 hover:bg-red-600 px-5 py-2 text-white text-xl font-bold rounded-md ml-20 disabled:opacity-50 transition-colors"
                onClick={handleUncompleteAll}
                disabled={isLoading}
            >
                {isLoading ? 'Processing...' : 'UnCompleteAll'}
            </button>
        </div>
    )
}

export default UncompleteAll