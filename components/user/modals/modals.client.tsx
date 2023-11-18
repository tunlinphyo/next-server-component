'use client'

import './modals.css'
import styles from './modals.module.css'
import { ChildrenProp } from "@/libs/definations"
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { hideModal } from './modals.utils'

type ModalProps = ChildrenProp & {
    open: boolean;
}
type BottomSheetContainerProps = ChildrenProp & {
    onClose: () => void;
}
type BottomSheetButtonProps = ChildrenProp & {
    onClick: () => void;
    disabled?: boolean;
    theme?: string;
}

export function Modal({ children, open }: ModalProps) {
    const [ toggle, setToggle ] = useState(false)

    useEffect(() => {
        if (open) setToggle(true)
        else {
            hideModal().then(() => {
                setToggle(false)
            })
        }
    }, [ open ])

    return (
        toggle ? createPortal(children, document.getElementById('user') as HTMLElement) : null
    )
}

export function ModalContainer({ children }: ChildrenProp) {
    return (
        <section id="custom-modal" className="custom-modal-container">
            <div className="custom-modal-view">
                { children }
            </div>
        </section>
    )
}

export function BottomSheetContainer({ children, onClose }: BottomSheetContainerProps) {
    return (
        <section id="custom-modal" className="custom-modal-container bottom-sheet-container">
            <div className="bottom-sheet-view">
                <div className={styles.buttonGroup}>
                    { children }
                </div>
                <button
                    type="button"
                    onClick={onClose}
                    className={styles.closeButton}>
                    close
                </button>
            </div>
        </section>
    )
}

export function BottomSheetButton({ children, disabled, onClick }: BottomSheetButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={styles.bottomSheetButton}>
            { children }
        </button>
    )
}