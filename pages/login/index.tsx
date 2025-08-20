'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/navbar';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const responseText = await response.text();
        console.log('Non-JSON response:', responseText);
        throw new Error('Server mengembalikan respons bukan JSON');
      }

      const result = await response.json();
      console.log('Parsed result:', result);

      if (response.ok && result.success === true) {
        const userName = result.user.name || 'Pengguna';
        Swal.fire({
          title: 'Login Berhasil!',
          text: `Selamat datang ${userName}!`,
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          router.push('/');
        });

        setFormData({ email: '', password: '' });
      } else {
        Swal.fire({
          title: 'Gagal!',
          text: result.message || 'Email atau password salah.',
          icon: 'error'
        });
      }
    } catch (error) {
      console.error('Error caught:', error);
      Swal.fire({
        title: 'Error!',
        text: error instanceof Error ? error.message : String(error) || 'Terjadi kesalahan saat menghubungi server.',
        icon: 'error'
      });
      console.error('Terjadi error:', error);
    }
  };

  const handleRegisterRedirect = () => {
    router.push('/register');
  };

  return (
    <>
      <Navbar />
      <main style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column'
      }}>
        <div style={{
          width: '80%',
          maxWidth: '600px',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
          backgroundColor: 'white'
        }}>
          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Form Login</h2>

          <form onSubmit={handleSubmit}>
            <table className="table table-borderless">
              <tbody>
                <tr>
                  <td>Email</td>
                  <td>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Masukkan Email"
                      required
                    />
                  </td>
                </tr>
                <tr>
                  <td>Password</td>
                  <td>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Masukkan Password"
                      required
                    />
                  </td>
                </tr>
              </tbody>
            </table>

            <button
              type="submit"
              style={{
                width: '100%',
                marginTop: '20px',
                padding: '10px',
                borderRadius: '20px',
                border: '2px solid black',
                backgroundColor: 'white',
                color: 'black',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'background 2s ease, color 2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(to right, #333 0%, white 100%)';
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.border = '2px solid white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.color = 'black';
                e.currentTarget.style.border = '2px solid black';
              }}
            >
              Login
            </button>

            <button
              type="button"
              onClick={handleRegisterRedirect}
              style={{
                width: '100%',
                marginTop: '10px',
                padding: '10px',
                borderRadius: '20px',
                border: '2px solid black',
                backgroundColor: 'white',
                color: 'black',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'background 2s ease, color 2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(to right, #333 0%, white 100%)';
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.border = '2px solid white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.color = 'black';
                e.currentTarget.style.border = '2px solid black';
              }}
            >
              Register
            </button>
          </form>
        </div>
      </main>
    </>
  );
}