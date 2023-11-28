'use server'

import styles from './form.module.css'
import { formatDate } from "@/libs/utils";
import { timeAgo } from "@/libs/relative-time";


export async function FormDates({ createDate, updateDate }: { createDate: Date, updateDate?: Date | null }) {
    return (
        <div className={styles.dates}>
            <div className={styles.date}>Create at: { formatDate(createDate) }</div>
            {/* { updateDate && <div className={styles.date}>Last update at: { formatDate(updateDate) }</div> } */}
            { updateDate && <div className={styles.date}>
                    Last update at: { timeAgo(updateDate) }
                </div>
            }
        </div>
    )
}
