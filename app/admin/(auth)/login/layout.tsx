import { ChildrenProp } from '@/libs/definations'
import styles from './login.module.css'

export default async function Layout({ children }: ChildrenProp) {
  return (
    <main className={styles.login}>
        { children }
    </main>
  )
}