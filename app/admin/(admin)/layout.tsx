import { Navigation } from '@/components/admin/navigation/navigation.server'
import { ChildrenProp } from '@/libs/definations'
import styles from './admin.module.css'

export default async function Layout({ children }: ChildrenProp) {
  return (
    <main className={styles.main}>
        <Navigation />
        { children }
    </main>
  )
}