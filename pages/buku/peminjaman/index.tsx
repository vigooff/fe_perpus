'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../../components/navbar';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Peminjaman() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    id_siswa: '',
    id_buku: '',
    keterangan: 'belum kembali', // ✅ ubah dari 'belum_kembali'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/api/peminjaman', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // pastikan ini kirim `keterangan`
      });

      const result = await response.json();

      if (response.ok && result.status === true) {
        const idPeminjaman = result.data?.id;

        Swal.fire({
          title: 'Peminjaman Berhasil!',
          text: `ID Peminjaman Anda: ${idPeminjaman}`,
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          router.push('/buku');
        });

        // ✅ reset dengan nilai valid
        setFormData({ id_siswa: '', id_buku: '', keterangan: 'belum kembali' });
      } else {
        Swal.fire({
          title: 'Gagal!',
          text: result.message || 'Terjadi kesalahan saat meminjam.',
          icon: 'error'
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'Terjadi kesalahan saat menghubungi server.',
        icon: 'error'
      });
      console.error('Terjadi error saat menyimpan:', error);
    }
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
          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Form Peminjaman Buku</h2>

          <form onSubmit={handleSubmit}>
            <table className="table table-borderless">
              <tbody>
                <tr>
                  <td>ID Siswa</td>
                  <td>
                    <input
                      type="text"
                      name="id_siswa"
                      value={formData.id_siswa}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Masukkan ID Siswa"
                      required
                    />
                  </td>
                </tr>
                <tr>
                  <td>ID Buku</td>
                  <td>
                    <input
                      type="text"
                      name="id_buku"
                      value={formData.id_buku}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Masukkan ID Buku"
                      required
                    />
                  </td>
                </tr>
                {/* Input hidden untuk keterangan */}
                <tr style={{ display: 'none' }}>
                  <td colSpan={2}>
                    <input
                      type="hidden"
                      name="keterangan"
                      value={formData.keterangan}
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
              Pinjam Buku
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
