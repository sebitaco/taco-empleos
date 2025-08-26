'use client'

import JobDetailView from '@/components/JobDetailView'

export default function JobDetailClientWrapper({ job, jobId }) {
  // Now that tracking is handled in DisclaimerModal, 
  // this component just renders the job detail directly
  return <JobDetailView job={job} />
}