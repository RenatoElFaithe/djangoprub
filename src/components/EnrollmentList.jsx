// src/components/EnrollmentList.jsx
import React, { useEffect, useState, useMemo, useCallback } from 'react'
import api from '../services/api'
import { useNavigate } from 'react-router-dom'
import { useTable, useGlobalFilter, useSortBy } from 'react-table'
import { motion } from 'framer-motion'
import { Edit2, Trash2 } from 'lucide-react'
import { toast } from 'react-toastify'

export default function EnrollmentList() {
  const [enrolls, setEnrolls] = useState([])
  const [studentsMap, setStudentsMap] = useState({})
  const [globalFilter, setGlobalFilter] = useState('')
  const navigate = useNavigate()

  // Carga inicial de estudiantes y matrículas
  useEffect(() => {
    // 1) cargar estudiantes y construir mapa
    api.get('/estudiantes/')
      .then(res => {
        if (Array.isArray(res.data)) {
          const m = {}
          res.data.forEach(s => {
            m[s.id] = { nombre: s.nombre, foto: s.foto }
          })
          setStudentsMap(m)
        }
      })
      .catch(() => toast.error('Error al cargar estudiantes'))

    // 2) cargar matrículas
    api.get('/matriculas/')
      .then(res => setEnrolls(Array.isArray(res.data) ? res.data : []))
      .catch(() => {
        toast.error('Error al cargar matrículas')
        setEnrolls([])
      })
  }, [])

  // Eliminar matrícula
  const deleteOne = useCallback(async (id) => {
    if (!window.confirm('¿Eliminar esta matrícula?')) return
    await api.delete(`/matriculas/${id}/`)
    toast.success('Matrícula eliminada')
    const res = await api.get('/matriculas/')
    setEnrolls(Array.isArray(res.data) ? res.data : [])
  }, [])

  // Asegurarnos de que data sea array
  const data = useMemo(() => Array.isArray(enrolls) ? enrolls : [], [enrolls])

  // Columnas: mostramos nombre+foto de estudiante, curso, etc., miniatura comprobante
  const columns = useMemo(() => [
    {
      Header: 'Estudiante',
      id: 'estudiante',
      Cell: ({ row }) => {
        const sid = row.original.estudiante
        const stu = studentsMap[sid] || {}
        return (
          <div className="flex items-center space-x-2">
            <img
              src={stu.foto}
              alt={stu.nombre}
              className="w-8 h-8 rounded-full object-cover"
            />
            <span>{stu.nombre || sid}</span>
          </div>
        )
      }
    },
    { Header: 'Curso', accessor: 'curso' },
    { Header: 'Semestre', accessor: 'semestre' },
    { Header: 'Fecha', accessor: 'fecha' },
    {
      Header: 'Comprobante',
      accessor: 'comprobante',
      Cell: ({ cell: { value } }) => (
        <a href={value} target="_blank" rel="noopener noreferrer">
          <img
            src={value}
            alt="comprobante"
            className="w-12 h-12 object-cover rounded"
          />
        </a>
      )
    },
    {
      Header: 'Acciones',
      id: 'acciones',
      Cell: ({ row }) => (
        <div className="flex space-x-2">
          <button
            onClick={() => navigate(`/enrollments/edit/${row.original.id}`)}
            className="hover:text-yellow-600"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={() => deleteOne(row.original.id)}
            className="hover:text-red-600"
          >
            <Trash2 size={18} />
          </button>
        </div>
      )
    }
  ], [studentsMap, navigate, deleteOne])

  // Instanciamos la tabla
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setGlobalFilter: setFilter
  } = useTable(
    { columns, data, initialState: { globalFilter } },
    useGlobalFilter,
    useSortBy
  )

  // Sincroniza filtro global
  useEffect(() => {
    setFilter(globalFilter || undefined)
  }, [globalFilter, setFilter])

  // Props para table y tbody
  const tableProps = getTableProps()
  const tableBodyProps = getTableBodyProps()

  return (
    <motion.div
      className="p-4 bg-white rounded-lg shadow"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Matrículas</h2>
        <button
          onClick={() => navigate('/enrollments/new')}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Nuevo
        </button>
      </div>

      <input
        type="text"
        placeholder="Buscar..."
        value={globalFilter}
        onChange={e => setGlobalFilter(e.target.value)}
        className="mb-4 p-2 border rounded w-full"
      />

      <table {...tableProps} className="w-full table-auto">
        <thead className="bg-gray-100">
          {headerGroups.map(headerGroup => {
            const { key, ...restHeaderGroupProps } = headerGroup.getHeaderGroupProps()
            return (
              <tr key={key} {...restHeaderGroupProps}>
                {headerGroup.headers.map(column => {
                  const { key: hKey, ...restHeaderProps } =
                    column.getHeaderProps(column.getSortByToggleProps())
                  return (
                    <th key={hKey} {...restHeaderProps} className="p-2 text-left cursor-pointer">
                      {column.render('Header')}
                      {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                    </th>
                  )
                })}
              </tr>
            )
          })}
        </thead>
        <tbody {...tableBodyProps}>
          {rows.map(row => {
            prepareRow(row)
            const { key, ...restRowProps } = row.getRowProps()
            return (
              <tr key={key} {...restRowProps} className="hover:bg-gray-50">
                {row.cells.map(cell => {
                  const { key: cKey, ...restCellProps } = cell.getCellProps()
                  return (
                    <td key={cKey} {...restCellProps} className="p-2">
                      {cell.render('Cell')}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </motion.div>
  )
}
