import { getStudentDashboardData } from "@/lib/actions/student.actions"
import { DashboardContent } from "@/components/student/DashboardContent"

export default async function StudentDashboardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = await getStudentDashboardData(id)

  return (
    <DashboardContent
      student={data.student}
      latestTestName={data.latestTestName}
      currentScore={data.currentScore}
      improvement={data.improvement}
      history={data.history}
      subjectPerformance={data.subjectPerformance}
      insights={data.insights}
    />
  )
}
