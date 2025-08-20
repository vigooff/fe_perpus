import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
import Navbar from '../../../components/navbar'; // Sesuaikan dengan struktur folder kamu
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Pengembalian() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    id_peminjaman_buku: '',
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
      const response = await fetch('/api/pengembalian', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        Swal.fire({
          icon: 'success',
          title: 'Pengembalian Berhasil!',
          text: `Denda: Rp ${data.data.denda.toLocaleString()}`,
        });
        setFormData({ id_peminjaman_buku: '' });
      } else {
        const error = await response.json();
        Swal.fire({
          icon: 'error',
          title: 'Gagal!',
          text: error.message || 'Terjadi kesalahan.',
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: 'Terjadi kesalahan saat menghubungi server.',
      });
    }
  };

  return (
    <>
      <Navbar />
      <main style={{
        display: 'flex', justifyContent: 'center',
        alignItems: 'center', height: '100vh', flexDirection: 'column'
      }}>
        <div style={{
          width: '80%', maxWidth: '500px',
          padding: '20px', borderRadius: '10px',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)'
        }}>
          <h2 className="text-center mb-4">Form Pengembalian Buku</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">ID Peminjaman Buku</label>
              <input
                type="text"
                name="id_peminjaman_buku"
                value={formData.id_peminjaman_buku}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-dark w-100"
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#555';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'black';
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
