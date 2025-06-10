// src/App.jsx
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import StudentList from './components/StudentList'
import StudentForm from './components/StudentForm'
import EnrollmentList from './components/EnrollmentList'
import EnrollmentForm from './components/EnrollmentForm'
import StudentChart from './components/StudentChart'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function App() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto mt-6">
        <Routes>
          <Route path="/" element={<StudentChart />} />
          <Route path="students" element={<StudentList />} />
          <Route path="students/new" element={<StudentForm />} />
          <Route path="students/edit/:id" element={<StudentForm />} />
          <Route path="enrollments" element={<EnrollmentList />} />
          <Route path="enrollments/new" element={<EnrollmentForm />} />
          <Route path="enrollments/edit/:id" element={<EnrollmentForm />} />
        </Routes>
      </div>
      <ToastContainer position="top-right" autoClose={2000} />
    </>
  )
}
