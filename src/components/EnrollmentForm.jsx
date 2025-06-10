import { useEffect, useState } from 'react'
import api from '../services/api'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'

export default function EnrollmentForm() {
  const [estudiantes, setEstudiantes] = useState([])
  const [form, setForm] = useState({ estudiante: '', curso: '', semestre: '', fecha: '', comprobante: null })
  const navigate = useNavigate()
  const { id } = useParams()

  useEffect(() => {
    api.get('/estudiantes/').then(r => setEstudiantes(r.data))
    if (id) {
      api.get(`/matriculas/${id}/`).then(r => {
        setForm({ ...r.data, comprobante: null })
      })
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
    Object.entries(form).forEach(([k, v]) => {
      if (v !== null) data.append(k, v)
    })
    try {
      if (id) {
        await api.patch(`/matriculas/${id}/`, data)
        toast.success('Matrícula actualizada')
      } else {
        await api.post('/matriculas/', data)
        toast.success('Matrícula creada')
      }
      navigate('/enrollments')
    } catch (err) {
      toast.error('Error al guardar')
    }
  }

  return (
    <motion.form 
      onSubmit={handleSubmit}
      className="p-4 bg-white rounded-lg shadow max-w-md mx-auto space-y-4"
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
    >
      <h2 className="text-xl font-semibold">{ id ? 'Editar' : 'Nueva' } Matrícula</h2>
      <select name="estudiante" value={form.estudiante} onChange={handleChange} required className="w-full p-2 border rounded">
        <option value="">Selecciona Estudiante</option>
        {estudiantes.map(s => (
          <option key={s.id} value={s.id}>{s.nombre}</option>
        ))}
      </select>
      <input name="curso" type="text" placeholder="Curso" value={form.curso} onChange={handleChange} required className="w-full p-2 border rounded" />
      <input name="semestre" type="text" placeholder="Semestre" value={form.semestre} onChange={handleChange} required className="w-full p-2 border rounded" />
      <input name="fecha" type="date" value={form.fecha} onChange={handleChange} required className="w-full p-2 border rounded" />
      <input name="comprobante" type="file" onChange={handleChange} className="w-full p-2" accept="image/*" />
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
        {id ? 'Actualizar' : 'Crear'}
      </button>
    </motion.form>
  )
}
