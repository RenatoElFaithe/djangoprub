import { NavLink } from 'react-router-dom'
import { Home, Users, FileText } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Navbar() {
  return (
    <motion.nav 
      className="bg-white shadow-md p-4 flex space-x-6"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <NavLink to="/" className="flex items-center space-x-1 hover:text-blue-600">
        <Home size={20} /> <span>Home</span>
      </NavLink>
      <NavLink to="/students" className="flex items-center space-x-1 hover:text-blue-600">
        <Users size={20} /> <span>Estudiantes</span>
      </NavLink>
      <NavLink to="/enrollments" className="flex items-center space-x-1 hover:text-blue-600">
        <FileText size={20} /> <span>Matrículas</span>
      </NavLink>
    </motion.nav>
  )
}
