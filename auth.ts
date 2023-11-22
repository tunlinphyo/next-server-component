import * as CryptoJS from 'crypto-js'
import { UserType } from "./libs/prisma/definations"

export function isAdmin(cookie: string | undefined) {
    if (!cookie) return false
    const decrypted = decryptCookieValue(cookie)
    if (!decrypted) return false
    const adminUser = JSON.parse(decrypted) as UserType
    console.log('ADMIN_USER', new Date(adminUser.expiredAt), new Date())
    return (
        adminUser
        && adminUser.isAdmin
        && !adminUser.isDelete
        && new Date(adminUser.expiredAt) > new Date()
    )
}

export function encryptCookieValue(originalValue: string): string {
    const key = String(process.env.AUTH_SECRET)
    const iv = CryptoJS.enc.Utf8.parse(String(process.env.AUTH_VECTOR))

    const encryptedValue = CryptoJS.AES.encrypt(originalValue, key, {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    })

    return encryptedValue.toString()
}

export function decryptCookieValue(encryptedValue: string): string {
    try {
        const key = String(process.env.AUTH_SECRET)
        const iv = CryptoJS.enc.Utf8.parse(String(process.env.AUTH_VECTOR))

        const decryptedValue = CryptoJS.AES.decrypt(encryptedValue, key, {
            iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        })

        return decryptedValue.toString(CryptoJS.enc.Utf8)
    } catch (error) {
        console.error('Error decrypting cookie:', error)
        return ''
    }
}
