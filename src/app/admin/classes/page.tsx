import { getClasses } from "@/lib/actions/tests.actions"
import ClassesDashboard from "@/components/class/ClassesDashboard"

export default async function AdminClassesPage() {
  // Fetch live classes from Supabase
  const classes = await getClasses()

  return (
    <ClassesDashboard initialClasses={classes} />
  )
}
