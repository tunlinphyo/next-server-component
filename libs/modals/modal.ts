'use client'

import { AlertConfig, ConfirmConfig, PromptConfig } from "./modal.interface"

const init = () => {
    const modaler = document.querySelector('.app-modal-group')
    if (modaler) return modaler

    const node = document.createElement('section')
    node.classList.add('app-modal-group')

    document.firstElementChild?.insertBefore(node, document.body)
    return node
}

const disableEscapeKey = (event:KeyboardEvent) => {
    if (event.key === "Escape") {
        event.preventDefault();
    }
}

const removeModal = (modal:HTMLDialogElement) => {
    const Modaler = init()
    modal.classList.add('app-modal-closing')

    return new Promise(async (resolve, reject) => {
        await Promise.allSettled(
            modal.getAnimations().map(animation =>
                animation.finished
            )
        )
        modal.close()
        Modaler.removeChild(modal)
        resolve(true)
    })
}

const addModal = (modal:HTMLDialogElement) => {
    const Modaler = init()
    Modaler.appendChild(modal)
}

const createAlert = (text:string, config:AlertConfig = {}) => {
    const defaultOptions = {
        buttonText: 'ok',
        theme: 'device',
        waitAnimation: true
    }
    const options = { ...defaultOptions, ...config }

    const node = document.createElement('dialog')
    node.classList.add(options.theme)
    node.classList.add('app-module')
    node.classList.add('app-module-alert')

    const p = document.createElement('p')
    p.textContent = text

    const form = document.createElement('form')
    form.setAttribute('method', 'alert')

    const button = document.createElement('button')
    button.textContent = options.buttonText

    form.appendChild(button)
    node.appendChild(p)
    node.appendChild(form)

    addModal(node)
    node.showModal()

    document.addEventListener("keydown", disableEscapeKey)
    return new Promise((resolve) => {
        button.addEventListener('click', async (event:MouseEvent) => {
            event.preventDefault()
            document.removeEventListener("keydown", disableEscapeKey)
            if (options.waitAnimation) {
                await removeModal(node)
            } else {
                removeModal(node)
            }
            resolve(true)
        })
    })
}

const createConfirm = (text: string, config:ConfirmConfig = {}) => {
    const defaultOptions = {
        cancelText: 'cancel',
        confirmText: 'confirm',
        theme: 'device',
        waitAnimation: true
    }
    const options = { ...defaultOptions, ...config }

    const node = document.createElement('dialog')
    node.classList.add(options.theme)
    node.classList.add('app-module')
    node.classList.add('app-module-confirm')

    const p = document.createElement('p')
    p.textContent = text

    const form = document.createElement('form')
    form.setAttribute('method', 'confirm')

    const cancelButton = document.createElement('button')
    cancelButton.textContent = options.cancelText

    const confirmButton = document.createElement('button')
    confirmButton.textContent = options.confirmText

    form.appendChild(cancelButton)
    form.appendChild(confirmButton)
    node.appendChild(p)
    node.appendChild(form)

    addModal(node)
    node.showModal()

    document.addEventListener("keydown", disableEscapeKey)
    return new Promise((resolve) => {
        cancelButton.addEventListener('click', async (event:MouseEvent) => {
            event.preventDefault()
            document.removeEventListener("keydown", disableEscapeKey)
            if (options.waitAnimation) {
                await removeModal(node)
            } else {
                removeModal(node)
            }
            resolve(false)
        })
        confirmButton.addEventListener('click', async (event:MouseEvent) => {
            event.preventDefault()
            document.removeEventListener("keydown", disableEscapeKey)
            if (options.waitAnimation) {
                await removeModal(node)
            } else {
                removeModal(node)
            }
            resolve(true)
        })
    })
}

const createPrompt = (question:string, config:PromptConfig = {}) => {
    const defaultOptions = {
        name: String(Date.now()),
        placeholder: '',
        regx: null,
        error: 'Invalid input!',
        required: false,
        cancelText: 'cancel',
        confirmText: 'confirm',
        theme: 'device',
        waitAnimation: true
    }
    const options = { ...defaultOptions, ...config }

    const node = document.createElement('dialog')
    node.classList.add(options.theme)
    node.classList.add('app-module')
    node.classList.add('app-module-prompt')
    node.id = 'prompt'

    const p = document.createElement('p')
    p.textContent = question

    const form = document.createElement('form')
    form.setAttribute('method', 'prompt')

    const input = document.createElement('input')
    input.classList.add('app-module-input')
    input.setAttribute('name', options.name)
    input.setAttribute('placeholder', options.placeholder)

    const errorDisplay = document.createElement('span')
    errorDisplay.classList.add('app-module-error')

    let error = false
    const setErrorText = (text:string) => {
        if (!text) {
            error = false
            input.classList.remove('app-module-input--error')
        }else {
            error = true
            input.classList.add('app-module-input--error')
        }
        errorDisplay.innerText = text
    }

    if (options.regx) {
        input.addEventListener('keyup', (event:KeyboardEvent) => {
            const elem = event.target as HTMLInputElement
            if (options.required && !elem.value) return setErrorText('Value is required!')
            if (!options.regx?.test(elem.value)) setErrorText(options.error)
            else setErrorText('')
        })
    }

    const inputContainer = document.createElement('div')
    inputContainer.classList.add('app-module-input_container')

    const footer = document.createElement('footer')

    const cancelButton = document.createElement('button')
    cancelButton.textContent = options.cancelText

    const confirmButton = document.createElement('button')
    confirmButton.textContent = options.confirmText
    confirmButton.setAttribute('type', 'submit')

    inputContainer.appendChild(input)
    inputContainer.appendChild(errorDisplay)
    footer.appendChild(cancelButton)
    footer.appendChild(confirmButton)
    form.appendChild(inputContainer)
    form.appendChild(footer)
    node.appendChild(p)
    node.appendChild(form)

    addModal(node)
    node.showModal()

    const handleClose = async () => {
        document.removeEventListener("keydown", disableEscapeKey)
        if (options.waitAnimation && node) {
            await removeModal(node)
        } else {
            removeModal(node)
        }
        return
    }

    document.addEventListener("keydown", disableEscapeKey)
    return new Promise((resolve) => {
        cancelButton.addEventListener('click', async (event:MouseEvent) => {
            event.preventDefault()
            await handleClose()
            resolve(null)
        })
        input.addEventListener('keydown', async (event:KeyboardEvent) => {
            if (event.key === 'Enter') {
                event.preventDefault()
                if (options.required && !input.value) setErrorText('Value is required')
                if (error) {
                    input.focus()
                    return
                }
                await handleClose()
                resolve(input.value)
            }
        })
        form.addEventListener('submit', async (event:SubmitEvent) => {
            event.preventDefault()
            if (options.required && !input.value) setErrorText('Value is required')
            if (error) {
                input.focus()
                return
            }
            await handleClose()
            resolve(input.value)
        })
    })
}

const createLoading = (text?:string) => {
    const node = document.createElement('dialog')
    node.classList.add('app-loading')

    if (text) {
        node.classList.add('app-loading-with-text')

        const p = document.createElement('p')
        p.textContent = text
        node.appendChild(p)
    }
    const loading = document.createElement('div')
    loading.classList.add('app-loading-icon')
    node.appendChild(loading)

    addModal(node)
    node.showModal()

    document.addEventListener("keydown", disableEscapeKey)
    return () => {
        document.removeEventListener("keydown", disableEscapeKey)
        return removeModal(node)
    }
}

export { createAlert, createConfirm, createPrompt, createLoading }
