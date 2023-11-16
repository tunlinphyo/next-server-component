
import { PageContainer, PageTitle } from '@/components/user/utils/utils.client'
import styles from './home.module.css'
import Link from 'next/link'

export default async function Home() {
    return (
        <PageContainer>
            <PageTitle title='Start Shopping' />
            <div  className={styles.linkContainer}>
                <div className={styles.card}>
                    <Link className={styles.link} href="/products">Go to products</Link>
                </div>
            </div>
        </PageContainer>
    )
}
