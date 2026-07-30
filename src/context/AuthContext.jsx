import { createContext, useState, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, signOutUser } from '../firebase/auth'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState(null)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        if (!firebaseUser.email?.endsWith('@flagshipgrowth.com')) {
          await signOutUser()
          setAuthError('Access restricted to @flagshipgrowth.com accounts.')
          setUser(null)
        } else {
          setAuthError(null)
          setUser(firebaseUser)
        }
      } else {
        setUser(null)
      }
      setLoading(false)
    })
    return unsub
  }, [])

  const logout = () => signOutUser()

  return (
    <AuthContext.Provider value={{ user, logout, loading, authError, setAuthError }}>
      {children}
    </AuthContext.Provider>
  )
}
