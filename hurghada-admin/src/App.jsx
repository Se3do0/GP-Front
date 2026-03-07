import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import AdminLayout from './components/AdminLayout'
import Login from './pages/Login/Login'
import Users from './pages/Users/Users'
import Departments from './pages/Departments/Departments'
import Colleges from './pages/Colleges/Colleges'
import UserForm from './pages/UserForm/UserForm'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/" element={<Users />} />
            <Route path="/departments" element={<Departments />} />
            <Route path="/colleges" element={<Colleges />} />
            <Route path="/user-form" element={<UserForm />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  )
}

export default App
