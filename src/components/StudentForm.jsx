import { useEffect, useState } from 'react'
import api from '../services/api'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'

export default function StudentForm() {
  const [form, setForm] = useState({
    nombre: '',
    carrera: '',
    email: '',
    foto: null
  })
  const navigate = useNavigate()
  const { id } = useParams()

  // Carga datos si editamos
  useEffect(() => {
    if (id) {
      api.get(`/estudiantes/${id}/`)
        .then(res => {
          setForm({
            nombre: res.data.nombre,
            carrera: res.data.carrera,
            email: res.data.email,
            foto: null      // foto existente no la reenvía
          })
        })
        .catch(() => toast.error('Error al cargar estudiante'))
    }
  }, [id])

  const handleChange = e => {
    const { name, value, files } = e.target
    setForm(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }))
  }

    const handleSubmit = async e => {
        e.preventDefault()
        const data = new FormData()
        Object.entries(form).forEach(([key, val]) => {
        if (val !== null) data.append(key, val)
        })

        try {
        // Configuración para que el browser ponga el Content-Type correcto
        const config = {
            headers: { 'Content-Type': 'multipart/form-data' }
        }

        if (id) {
            await api.patch(`/estudiantes/${id}/`, data, config)
            toast.success('Estudiante actualizado')
        } else {
            await api.post('/estudiantes/', data, config)
            toast.success('Estudiante creado')
        }
        navigate('/students')
        } catch (err) {
        // Para ver el detalle del error Django:
        console.error(err.response?.data)
        toast.error('Error al guardar estudiante')
        }
    }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="p-6 bg-white rounded-lg shadow-md max-w-lg mx-auto space-y-4"
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
    >
      <h2 className="text-2xl font-semibold">
        {id ? 'Editar Estudiante' : 'Nuevo Estudiante'}
      </h2>

      <input
        type="text"
        name="nombre"
        placeholder="Nombre completo"
        value={form.nombre}
        onChange={handleChange}
        required
        className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <input
        type="text"
        name="carrera"
        placeholder="Carrera"
        value={form.carrera}
        onChange={handleChange}
        required
        className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <input
        type="email"
        name="email"
        placeholder="Correo electrónico"
        value={form.email}
        onChange={handleChange}
        required
        className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <div>
        <label className="block mb-1 font-medium">Foto de perfil</label>
        <input
          type="file"
          name="foto"
          accept="image/*"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
      >
        {id ? 'Actualizar Estudiante' : 'Crear Estudiante'}
      </button>
    </motion.form>
  )
}
