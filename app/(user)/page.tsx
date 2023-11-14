import Image from 'next/image'
import styles from './user.module.css'
import Link from 'next/link'

export default async function Home() {
    return (
        <main className={styles.main}>
            <h1>
                User pages <br/>
                are <br/>
                under developemnt
            </h1>
            <Image
                src="/icons/undraw_programming.svg"
                width={200}
                height={200}
                alt='Programming'
            />
            <Link href="/admin/login">Check admin page</Link>
        </main>
    )
}
