import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './EditApplication.css'

function EditApplication({ API_URL, fetchJobs }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    company_name: '',
    role: '',
    status: '',
    job_link: '',
    notes: ''
  })

  useEffect(() => {
    const fetchSingleJob = async () => {
      try {
        const response = await fetch(`${API_URL}${id}/`)
        if (response.ok) {
          const data = await response.json()
          setFormData({
            company_name: data.company_name || '',
            role: data.role || '',
            status: data.status || 'Applied',
            job_link: data.job_link || '',
            notes: data.notes || ''
          })
        }
      } catch (error) {
        console.error("Error fetching job details:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchSingleJob()
  }, [id, API_URL])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${API_URL}${id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        fetchJobs() // Update primary array context
        navigate('/') // Go back to dashboard view
      }
    } catch (error) {
      console.error("Error updating application layout:", error)
    }
  }

  if (loading) return <div className="dashboard-container"><p className="no-data">Loading application details...</p></div>

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back to Dashboard</button>
        <h1>Update Application</h1>
        <p>Modify tracker metrics or append notes for your log down the pipeline.</p>
      </header>

      <section className="form-section">
        <form onSubmit={handleUpdate} className="job-form">
          <label className="form-field-label">Company Name</label>
          <input type="text" name="company_name" value={formData.company_name} onChange={handleInputChange} />

          <label className="form-field-label">Role Title</label>
          <input type="text" name="role" value={formData.role} onChange={handleInputChange} />

          <label className="form-field-label">Job Posting URL</label>
          <input type="url" name="job_link" value={formData.job_link} onChange={handleInputChange} />

          <label className="form-field-label">Application Pipeline Status</label>
          <select name="status" value={formData.status} onChange={handleInputChange}>
            <option value="Applied">Applied</option>
            <option value="Interview">Interviewing</option>
            <option value="Offer">Offered</option>
            <option value="Rejected">Rejected</option>
          </select>

          <label className="form-field-label">Application Notes</label>
          <textarea
            name="notes"
            placeholder="Add log notes (e.g. follow-up dates, interviewer names, tech stack requirements)..."
            value={formData.notes}
            onChange={handleInputChange}
            rows="5"
          />

          <button type="submit" className="submit-btn">Save Status Updates</button>
        </form>
      </section>
    </div>
  )
}

export default EditApplication