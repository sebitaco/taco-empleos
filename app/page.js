import HeroSearch from '@/components/HeroSearch'
import JobList from '@/components/JobList'
import SkillsCloud from '@/components/SkillsCloud'
import Articles from '@/components/Articles'
import JobPostingForm from '@/components/JobPostingForm'

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSearch />
      <JobList />
      <SkillsCloud />
      <Articles />
      <JobPostingForm />
    </main>
  )
}