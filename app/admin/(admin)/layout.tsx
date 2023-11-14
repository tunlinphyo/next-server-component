import { Navigation } from '@/components/admin/navigation/navigation.server'
import { ChildrenProp } from '@/libs/definations'
import '../admin.css'
import styles from './dashboard.module.css'

export default async function Layout({ children }: ChildrenProp) {
  return (
    <main className={styles.main}>
        <Navigation />
        { children }
    </main>
  )
}