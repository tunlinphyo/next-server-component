'use client'

export async function hideModal() {
    const modalEl = document.getElementById('custom-modal') as HTMLElement
    if (!modalEl) return true
    modalEl.classList.add('custom-modal-closing')

    await Promise.allSettled(
        modalEl.getAnimations().map(animation =>
            animation.finished
        )
    )
    return true
}