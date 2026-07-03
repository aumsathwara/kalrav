import { getClasses } from "@/lib/actions/tests.actions"
import LanguageAndClassList from "@/components/landing/LanguageAndClassList"

export default async function LandingPage() {
  // Query live classes from database
  const classes = await getClasses()

  return (
    <LanguageAndClassList initialClasses={classes} />
  )
}
