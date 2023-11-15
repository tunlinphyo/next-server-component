'use client'

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import styles from './search.module.css'
import { ChildrenProp } from '@/libs/definations';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce'

type SearchProps = {
    placehiolder: string;
}

export function SearchContainer({ children }: ChildrenProp) {
    return (
        <div className={styles.searchContainer}>
            { children }
        </div>
    )
}

export function SearchBar({ placehiolder }: SearchProps) {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const { replace } = useRouter()

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams)
        if (term) {
            params.set('query', term)
        } else {
            params.delete('query')
        }
        params.set('page', '1')
        replace(`${pathname}?${params.toString()}`)
    }, 300)

    return (
        <div className={styles.searchBar}>
            <input
                type='search'
                placeholder={placehiolder}
                onChange={(e) => handleSearch(e.target.value)}
                defaultValue={searchParams.get('query')?.toString()}
            />
            <MagnifyingGlassIcon className={styles.searchIcon} />
        </div>
    )
}