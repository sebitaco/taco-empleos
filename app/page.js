import HeroSearch from '@/components/HeroSearch'
import JobList from '@/components/JobList'
import SkillsCloud from '@/components/SkillsCloud'
import JobPostingForm from '@/components/JobPostingForm'

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSearch />
      <JobList />
      <SkillsCloud />
      <JobPostingForm />
    </main>
  )
}