'use client'

import "./page.css";
import styles from "./page.module.css";
import Bar from "@/components/Bar/Bar";
import MainSidebar from "@/components/MainSidebar/MainSidebar";
import CenterBlock from "@/components/CenterBlock/CenterBlock";
import MainNav from "@/components/MainNav/MainNav";
import { useEffect, useState } from "react";
import { getTracks } from "@/services/tracks/tracksApi";
import { TrackType } from "@/components/sharedTypes/types";
import { error } from "console";
import { AxiosError } from "axios";
import { logoutUser } from "@/services/auth/authApi";
import { useRouter } from "next/navigation";

export default function Home() {
  const [tracks, setTracks] = useState<TrackType[]>([])
  const[error, setError] = useState('')
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()

  useEffect(() => {
    getTracks()
      .then((res) => {
        setTracks(res)
        alert('Tracks loaded successfully!')
      })
      .catch((error) => { // Исправлено здесь - добавлены скобки вокруг error
        if (error instanceof AxiosError) {
          if (error.response) {
            setError(error.response.data)
          } else if (error.request) {
            console.log(error.request)
            setError('Что то с интернетом')
          } else {
            console.log('Error', error.message)
            setError('Неизвестная ошибка')
          }
        }
      })
  }, [])

  // Функция для выхода
  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logoutUser()
      router.push('/auth/signin')
    } catch (error) {
      console.error('Ошибка при выходе:', error)
      localStorage.removeItem('authToken')
      localStorage.removeItem('userData')
      router.push('/auth/signin')
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={"container"}>
        <main className={"main"}>

          <MainNav />
          <CenterBlock />
          <MainSidebar />
          <Bar />
        </main>
        <footer className="footer"></footer>
      </div>
    </div>
  );
}