import { createAlert, createConfirm, createLoading, createPrompt} from "./modal"
import { AlertConfig, ConfirmConfig, PromptConfig } from "./modal.interface"

export function appAlert(msg: string, config?: AlertConfig) {
  return createAlert(msg, config)
}

export function appConfirm(msg: string, config?: ConfirmConfig) {
  return createConfirm(msg, config)
}

export function appPrompt(msg: string, config?: PromptConfig) {
  return createPrompt(msg, config)
}

export function appLoading(msg?: string) {
  return createLoading(msg)
}

