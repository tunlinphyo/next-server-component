import { ChildrenProp } from '@/libs/definations'
import '../admin.css'
import styles from './auth.module.css'

export default async function Layout({ children }: ChildrenProp) {
  return (
    <main className={styles.login}>
        { children }
    </main>
  )
}