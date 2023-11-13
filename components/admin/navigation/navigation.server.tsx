'use server'

import { Logout, Nav } from "./navigation.client"
import { Navigation } from "./navigation.types"
import { NAVIGATIONS } from "./navigation.utils"
import styles from './navigation.module.css'

export async function Navigation() {
    return (
        <nav className={styles.navigation}>
            <h2 className={styles.navHeader}>Dashboard</h2>
            <Navs navs={NAVIGATIONS} />
        </nav>
    )
}

export async function Navs({ navs }: { navs: Navigation[] }) {
    return (
        <ul className={styles.navs}>
            {
                navs.map(nav => (
                    <Nav nav={nav} />
                ))
            }
            <li className={styles.flexSpace}></li>
            <Logout />
        </ul>
    )
}
