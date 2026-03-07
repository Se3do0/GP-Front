import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import AdminLayout from './components/AdminLayout'
import Login from './pages/Login/Login'
import Users from './pages/Users/Users'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/" element={<Users />} />
            {/* 
              Future routes:
              <Route path="/departments" element={<Departments />} />
              <Route path="/colleges" element={<Colleges />} />
              <Route path="/users/:id" element={<UserForm />} />
            */}
          </Route>
        </Route>
      </Routes>
    </Router>
  )
}

export default App
