'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/navbar';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function Pengembalian() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    id_peminjaman_buku: ''
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
      const response = await fetch('http://localhost:8000/api/pengembalian', {
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

      if (response.ok && result.status === true) {
        const { id_peminjaman_buku, tgl_pengembalian, denda } = result.data;

        const formattedDate = format(new Date(tgl_pengembalian), 'dd MMMM yyyy', { locale: id });

        let message = `ID Peminjaman: ${id_peminjaman_buku}\nTanggal Pengembalian: ${formattedDate}`;
        if (denda > 0) {
          message += `\nDenda: Rp ${denda.toLocaleString('id-ID')}`;
        }
        message += `\n${result.message}`;

        await Swal.fire({
          title: 'Pengembalian Berhasil!',
          text: message,
          icon: 'success',
          confirmButtonText: 'OK'
        });

        setFormData({ id_peminjaman_buku: '' });
        router.push('/buku');
      } else {
        Swal.fire({
          title: 'Gagal!',
          text: result.message || 'Terjadi kesalahan saat mengembalikan buku.',
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
          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Form Pengembalian Buku</h2>

          <form onSubmit={handleSubmit}>
            <table className="table table-borderless">
              <tbody>
                <tr>
                  <td>ID Peminjaman Buku</td>
                  <td>
                    <input
                      type="text"
                      name="id_peminjaman_buku"
                      value={formData.id_peminjaman_buku}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Masukkan ID Peminjaman Buku"
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
              Kembalikan Buku
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
