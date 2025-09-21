import axios from "axios"
import { BASE_URL } from "../constants"

type AuthUserProps = {
    email: string,
    password: string,
}

type AuthUserReturn = {
    email: string;
    username: string;
    _id: string;
    token?: string;
}

export const authUser = async (data: AuthUserProps): Promise<AuthUserReturn> => {
    try {
        const response = await axios.post(BASE_URL + 'user/login/', data, {
            headers: {
                "Content-Type": "application/json",
            },
        })

        // Сохраняем токен и данные пользователя
        if (response.data.token) {
            localStorage.setItem('authToken', response.data.token)
        }
        if (response.data.user) {
            localStorage.setItem('userData', JSON.stringify(response.data.user))
        }

        return response.data

    } catch (error: any) {
        let errorMessage = "Произошла неизвестная ошибка"

        if (axios.isAxiosError(error)) {
            if (error.response) {
                const status = error.response.status
                
                switch (status) {
                    case 400:
                        errorMessage = "Неверные данные для входа"
                        break
                    case 401:
                        errorMessage = "Неверный email или пароль"
                        break
                    case 404:
                        errorMessage = "Пользователь не найден"
                        break
                    case 500:
                        errorMessage = "Ошибка сервера. Попробуйте позже"
                        break
                    default:
                        errorMessage = error.response.data?.message || `Ошибка: ${status}`
                }
            } else if (error.request) {
                errorMessage = "Нет ответа от сервера. Проверьте подключение к интернету"
            } else {
                errorMessage = "Ошибка при отправке запроса"
            }
        } else {
            errorMessage = error.message || "Неизвестная ошибка"
        }

        throw new Error(errorMessage)
    }
}

// Дополнительные функции API
export const registerUser = async (data: AuthUserProps & { username: string }): Promise<AuthUserReturn> => {
    try {
        const response = await axios.post(BASE_URL + 'user/signup/', data, {
            headers: {
                "Content-Type": "application/json",
            },
        })

        // Сохраняем токен и данные пользователя
        if (response.data.token) {
            localStorage.setItem('authToken', response.data.token)
        }
        if (response.data.user) {
            localStorage.setItem('userData', JSON.stringify(response.data.user))
        }

        return response.data

    } catch (error: any) {
        let errorMessage = "Произошла неизвестная ошибка при регистрации"

        if (axios.isAxiosError(error)) {
            if (error.response) {
                const status = error.response.status
                
                switch (status) {
                    case 400:
                        if (error.response.data?.message?.includes('уже существует')) {
                            errorMessage = "Пользователь с таким email уже существует"
                        } else {
                            errorMessage = "Неверные данные для регистрации"
                        }
                        break
                    case 409:
                        errorMessage = "Пользователь с таким email уже существует"
                        break
                    case 422:
                        errorMessage = "Неверные данные для регистрации"
                        break
                    case 500:
                        errorMessage = "Ошибка сервера. Попробуйте позже"
                        break
                    default:
                        errorMessage = error.response.data?.message || `Ошибка регистрации: ${status}`
                }
            } else if (error.request) {
                errorMessage = "Нет ответа от сервера. Проверьте подключение к интернету"
            } else {
                errorMessage = "Ошибка при отправке запроса"
            }
        } else {
            errorMessage = error.message || "Неизвестная ошибка"
        }

        throw new Error(errorMessage)
    }
}

// authApi.ts
export const logoutUser = async (): Promise<void> => {
    try {
        // Если нужно отправлять запрос на сервер для выхода
        // await axios.post(BASE_URL + 'user/logout/', {}, {
        //     headers: {
        //         "Authorization": `Bearer ${localStorage.getItem('authToken')}`,
        //         "Content-Type": "application/json",
        //     },
        // })
        
        // Очищаем localStorage
        localStorage.removeItem('authToken')
        localStorage.removeItem('userData')
        localStorage.removeItem('userSettings') // если есть другие данные
        
        // Очищаем sessionStorage на всякий случай
        sessionStorage.clear()
        
        // Очищаем cookies (если используете)
        document.cookie.split(";").forEach((cookie) => {
            const eqPos = cookie.indexOf("=")
            const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/"
        })

    } catch (error: any) {
        console.error('Ошибка при выходе:', error)
        // Даже если ошибка, все равно очищаем локальные данные
        localStorage.removeItem('authToken')
        localStorage.removeItem('userData')
        throw new Error('Ошибка при выходе из системы')
    }
}

// Функция для проверки авторизации
export const isAuthenticated = (): boolean => {
    if (typeof window === 'undefined') return false
    return !!localStorage.getItem('authToken')
}

// Функция для получения данных пользователя
export const getUserData = (): AuthUserReturn | null => {
    if (typeof window === 'undefined') return null
    const userData = localStorage.getItem('userData')
    return userData ? JSON.parse(userData) : null
}

// Функция для получения токена
export const getAuthToken = (): string | null => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('authToken')
}