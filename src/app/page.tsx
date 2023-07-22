'use client';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { getAuthAccess, setAuthAccess } from './Auth';
import Swal from 'sweetalert2';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (getAuthAccess()) {
      router.push('/sales');
    }
  }, [router])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      setLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      if (!response.ok) {
        Swal.fire({
          title: 'Ops, algo deu errado!',
          text: 'Verifique suas credenciais e tente novamente.',
          icon: 'error'
        })
      } else {
        await response.json().then((access => {
          Swal.fire({
            title: 'Bem vindo!',
            text: 'Login efetuado com sucesso!',
            icon: 'success',
          });
          setAuthAccess(access)
          router.push('/sales')
        }))
      }

      setLoading(false)
    } catch (error) {
      Swal.fire({
        title: 'Ops, algo deu errado!',
        icon: 'warning'
      })
      console.log(error)
      setLoading(false)
    }
  }

  const handleEmail = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  }

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  }

  if (loading) {

  }

  return (
    <div className="flex justify-center items-center h-screen text-white">
      <div className="max-w-md w-full mx-auto p-7">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit} className="flex-col justify-center items-center mr-12">
          <div className="md:flex md:items-center mb-6">
            <div className="md:w-1/4">
              <label
                className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="email">
                Email
              </label>
            </div>
            <div className="md:w-2/3">
              <input
                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                id="email"
                type="email"
                placeholder='janedoe@hotmail.com'
                value={email}
                onChange={handleEmail}
              />
            </div>
          </div>
          <div className="md:flex md:items-center mb-6">
            <div className="md:w-1/4">
              <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="password">
                Password
              </label>
            </div>
            <div className="md:w-2/3">
              <input
                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                id="password"
                type="password"
                placeholder="************"
                value={password}
                onChange={handlePasswordChange}
              />
            </div>
          </div>
          <div className="md:flex md:items-center">
            <div className="md:w-1/2"></div>
            <div className="md:w-2/3 ml-3">
              <button className="align-center shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded duration-300" type="submit">
                Sign In
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
