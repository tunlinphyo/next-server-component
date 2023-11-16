import { Navigation } from '@/components/admin/navigation/navigation.server'
import { ChildrenProp } from '@/libs/definations'
import '../admin.css'
import styles from './admin.module.css'
import Link from 'next/link'
import { ArrowLongRightIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'

export default async function Layout({ children }: ChildrenProp) {
  return (
    <>
      <main className={clsx(styles.main, 'admin')}>
          <Navigation />
          { children }
      </main>
      <Link href="/" className='site-change-link'>
        go to user <ArrowLongRightIcon />
      </Link>
    </>
  )
}