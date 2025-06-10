// src/components/StudentChart.jsx
import React, { useEffect, useState } from 'react'
import api from '../services/api'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Label,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'

const PIE_COLORS = ['#4F46E5', '#3B82F6', '#10B981', '#F59E0B', '#EF4444']

export default function StudentChart() {
  const [barData, setBarData] = useState([])
  const [pieData, setPieData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [resEst, resMat] = await Promise.all([
          api.get('/estudiantes/'),
          api.get('/matriculas/')
        ])
        const counts = resEst.data.map(s => ({
          nombre: s.nombre,
          matriculas: resMat.data.filter(m => m.estudiante === s.id).length
        }))

        setBarData(counts)

        const total = counts.reduce((sum, cur) => sum + cur.matriculas, 0) || 1
        setPieData(
          counts.map((s, idx) => ({
            name: s.nombre,
            value: s.matriculas,
            percent: ((s.matriculas / total) * 100).toFixed(1),
            color: PIE_COLORS[idx % PIE_COLORS.length]
          }))
        )
      } catch (err) {
        console.error(err)
        toast.error('Error cargando datos para la gráfica')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <motion.div 
        className="p-6 bg-white rounded-lg shadow text-center text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Cargando datos de la gráfica…
      </motion.div>
    )
  }

  if (barData.length === 0) {
    return (
      <motion.div 
        className="p-6 bg-white rounded-lg shadow text-center text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        No hay datos disponibles para mostrar.
      </motion.div>
    )
  }

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2 className="text-3xl font-bold text-center">Dashboard de Matrículas</h2>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Bar Chart */}
        <motion.div
          className="p-6 bg-white rounded-lg shadow"
          whileHover={{ scale: 1.02 }}
        >
          <h3 className="text-xl font-semibold mb-4 text-center">
            Número de Matrículas por Estudiante
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={barData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="nombre"
                interval={0}
                angle={-45}
                textAnchor="end"
                height={60}
              >
                <Label
                  value="Estudiantes"
                  position="insideBottom"
                  offset={-50}
                />
              </XAxis>
              <YAxis>
                <Label
                  value="Matrículas"
                  angle={-90}
                  position="insideLeft"
                  offset={-10}
                />
              </YAxis>
              <Tooltip formatter={(value) => [value, 'Matrículas']} />
              <Bar
                dataKey="matriculas"
                fill="#3B82F6"
                barSize={40}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie Chart */}
        <motion.div
          className="p-6 bg-white rounded-lg shadow flex flex-col items-center"
          whileHover={{ scale: 1.02 }}
        >
          <h3 className="text-xl font-semibold mb-4 text-center">
            Distribución Porcentual de Matrículas
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={100}
                labelLine={false}
                label={({ name, percent }) => `${name}: ${percent}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name, props) => [`${value}`, name]} />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </motion.div>
  )
}
