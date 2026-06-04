import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Dashboard.css'

function Dashboard({ jobs, fetchJobs, API_URL }) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    company_name: '',
    role: '',
    status: 'Applied',
    job_link: '',
    notes: ''
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.company_name || !formData.role) {
      alert("Please fill out both Company Name and Role fields")
      return
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setFormData({ company_name: '', role: '', status: 'Applied', job_link: '', notes: '' })
        fetchJobs()
      }
    } catch (error) {
      console.error("Error creating job:", error)
    }
  }

  const handleDelete = async (e, id) => {
    // Stop event propagation so clicking delete doesn't trigger row navigation
    e.stopPropagation()

    if (!window.confirm("Are you sure you want to delete this application tracker?")) {
      return
    }

    try {
      const response = await fetch(`${API_URL}${id}/`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      })

      if (response.ok) {
        fetchJobs() // Reload tracking list array context dynamically
      } else {
        console.error("Failed to delete application entry")
      }
    } catch (error) {
      console.error("Error deleting job tracker item:", error)
    }
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Job Tracker Dashboard</h1>
        <p>Manage and log your software developer job applications smoothly.</p>
      </header>

      <section className="form-section">
        <form onSubmit={handleSubmit} className="job-form">
          <input type="text" name="company_name" placeholder="Company Name" value={formData.company_name} onChange={handleInputChange} />
          <input type="text" name="role" placeholder="Role (e.g., AI Developer)" value={formData.role} onChange={handleInputChange} />
          <input type="url" name="job_link" placeholder="Job Posting URL (Optional)" value={formData.job_link} onChange={handleInputChange} />
          <select name="status" value={formData.status} onChange={handleInputChange}>
            <option value="Applied">Applied</option>
            <option value="Interviewing">Interviewing</option>
            <option value="Offered">Offered</option>
            <option value="Rejected">Rejected</option>
          </select>
          <button type="submit" className="submit-btn">Add Application</button>
        </form>
      </section>

      <section className="applications-section">
        <h2>Active Trackers ({jobs.length})</h2>
        {jobs.length === 0 ? (
          <p className="no-data">No jobs added yet. Fill out the form above to get started!</p>
        ) : (
          <div className="jobs-list">
            {jobs.map((job) => (
              <div key={job.id} className="job-row clickable-row" onClick={() => navigate(`/applications/${job.id}`)}>

                {/* Left Side Metadata Info Columns */}
                <div className="job-info-main">
                  <h3>{job.role}</h3>
                  <h4>at {job.company_name}</h4>
                  {job.job_link && (
                    <a href={job.job_link} target="_blank" rel="noreferrer" className="job-post-link" onClick={(e) => e.stopPropagation()}>
                      View Listing ↗
                    </a>
                  )}
                </div>

                {/* Right Side Status & Destructive Action Triggers */}
                <div className="job-meta-side">
                  {job.applied_date && <span className="applied-date-label">{job.applied_date}</span>}
                  <span className={`status-badge ${job.status.toLowerCase()}`}>
                    {job.status}
                  </span>
                  <button
                    className="delete-btn"
                    onClick={(e) => handleDelete(e, job.id)}
                    title="Delete Tracker"
                  >
                    ✕
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default Dashboard