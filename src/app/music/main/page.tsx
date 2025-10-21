'use client';

import "./page.css";
import styles from "./page.module.css";
import Bar from "@/components/Bar/Bar";
import MainSidebar from "@/components/MainSidebar/MainSidebar";
import MainNav from "@/components/MainNav/MainNav";
import { ReactNode, useEffect, useState } from "react";
import { getTracks } from "@/services/tracks/tracksApi";
import { TrackType } from "@/components/sharedTypes/types";
import { AxiosError } from "axios";
import { logoutUser } from "@/services/auth/authApi";
import { useRouter } from "next/navigation";
import CenterLayout from "../Center/CenterLayout/CenterLayout";
import CenterBlock from "../Center/CenterBlock/CenterBlock";

export default function Home() {
  const [tracks, setTracks] = useState<TrackType[]>([])
  const [error, setError] = useState('')
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()

  useEffect(() => {
    getTracks()
      .then((res) => {
        setTracks(res)
        alert('Tracks loaded successfully!')
      })
      .catch((error) => {
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
          <CenterLayout>
            {/* Теперь передаем children в CenterLayout */}
            <CenterBlock />
            {/* Можете добавить другие компоненты здесь */}
          </CenterLayout>
          <MainSidebar />
          <Bar />
        </main>
        <footer className="footer"></footer>
      </div>
    </div>
  );
}