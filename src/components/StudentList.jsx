// src/components/StudentList.jsx
import React, { useEffect, useState, useMemo, useCallback } from 'react'
import api from '../services/api'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Edit2, Trash2 } from 'lucide-react'
import { toast } from 'react-toastify'

export default function StudentList() {
  const [students, setStudents] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')
  const navigate = useNavigate()

  // Carga inicial
  useEffect(() => {
    api.get('/estudiantes/')
      .then(res => setStudents(Array.isArray(res.data) ? res.data : []))
      .catch(() => {
        toast.error('Error al cargar estudiantes')
        setStudents([])
      })
  }, [])

  // Eliminar estudiante
  const deleteOne = useCallback(async (id) => {
    if (!window.confirm('¿Eliminar este estudiante?')) return
    await api.delete(`/estudiantes/${id}/`)
    toast.success('Estudiante eliminado')
    const res = await api.get('/estudiantes/')
    setStudents(Array.isArray(res.data) ? res.data : [])
  }, [])

  // Filtrado por nombre, carrera o email
  const filtered = useMemo(() => {
    const term = globalFilter.toLowerCase()
    return students.filter(s =>
      s.nombre.toLowerCase().includes(term) ||
      s.carrera.toLowerCase().includes(term) ||
      s.email.toLowerCase().includes(term)
    )
  }, [students, globalFilter])

  return (
    <motion.div
      className="p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Estudiantes</h2>
        <button
          onClick={() => navigate('/students/new')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Nuevo
        </button>
      </div>

      <input
        type="text"
        placeholder="Buscar..."
        value={globalFilter}
        onChange={e => setGlobalFilter(e.target.value)}
        className="mb-6 p-2 border rounded w-full"
      />

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filtered.map(student => (
          <motion.div
            key={student.id}
            className="bg-white rounded-lg shadow p-4 flex flex-col"
            whileHover={{ scale: 1.02 }}
          >
            <img
              src={student.foto}
              alt={student.nombre}
              className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
            />
            <h3 className="text-lg font-semibold text-center">{student.nombre}</h3>
            <p className="text-sm text-gray-600 text-center">{student.carrera}</p>
            <p className="text-sm text-gray-600 text-center mb-4">{student.email}</p>
            <div className="mt-auto flex justify-center space-x-4">
              <button
                onClick={() => navigate(`/students/edit/${student.id}`)}
                className="text-yellow-500 hover:text-yellow-600"
              >
                <Edit2 size={20} />
              </button>
              <button
                onClick={() => deleteOne(student.id)}
                className="text-red-500 hover:text-red-600"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full text-center text-gray-500">
            No se encontraron estudiantes.
          </p>
        )}
      </div>
    </motion.div>
  )
}
