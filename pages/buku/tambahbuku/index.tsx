// pages/tambahbuku.tsx
import React, { useState } from 'react';
import Layout from '../../../components/layout';
import { useRouter } from 'next/router';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

enum Kategori {
  Politik = 'Politik',
  Sosial = 'Sosial',
  Pemrograman = 'Pemrograman',
}

export default function TambahBuku() {
  const router = useRouter();
  const [judul, setJudul] = useState('');
  const [penerbit, setPenerbit] = useState('');
  const [penulis, setPenulis] = useState('');
  const [kategori, setKategori] = useState<Kategori>(Kategori.Politik);
  const [foto, setFoto] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append('judul_buku', judul);
    formData.append('penerbit', penerbit);
    formData.append('penulis', penulis);
    formData.append('kategori', kategori);
    if (foto) formData.append('foto_buku', foto); // ✅ Ubah nama field sesuai backend
  
    try {
      await axios.post('http://localhost:8000/api/buku', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      alert('Buku berhasil ditambahkan!');
      router.push('/buku'); // Redirect ke halaman buku setelah berhasil menyimpan
    } catch (error: any) {
      console.error('Gagal menambahkan buku:', error.response?.data || error.message);
      alert(`Gagal menambahkan buku: ${error.response?.data?.message || 'Coba lagi.'}`);
    }
  };

  return (
    <Layout>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow rounded-3">
              <div className="card-header bg-primary text-white text-center rounded-top-3">
                <h4>Tambah Buku Baru</h4>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                  <div className="mb-3">
                    <label htmlFor="judul" className="form-label">Judul Buku</label>
                    <input
                      type="text"
                      className="form-control"
                      id="judul"
                      value={judul}
                      onChange={(e) => setJudul(e.target.value)}
                      placeholder="Masukkan judul buku"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="penerbit" className="form-label">Penerbit</label>
                    <input
                      type="text"
                      className="form-control"
                      id="penerbit"
                      value={penerbit}
                      onChange={(e) => setPenerbit(e.target.value)}
                      placeholder="Masukkan nama penerbit"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="penulis" className="form-label">Penulis</label>
                    <input
                      type="text"
                      className="form-control"
                      id="penulis"
                      value={penulis}
                      onChange={(e) => setPenulis(e.target.value)}
                      placeholder="Masukkan nama penulis"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="kategori" className="form-label">Kategori</label>
                    <select
                      className="form-select"
                      id="kategori"
                      value={kategori}
                      onChange={(e) => setKategori(e.target.value as Kategori)}
                      required
                    >
                      {Object.values(Kategori).map((kat) => (
                        <option key={kat} value={kat}>{kat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="foto" className="form-label">Foto Buku</label>
                    <input
                      type="file"
                      className="form-control"
                      id="foto"
                      accept="image/*"
                      onChange={(e) => setFoto(e.target.files?.[0] || null)}
                    />
                  </div>

                  <div className="d-flex justify-content-between">
                    <button type="submit" className="btn btn-success w-50 me-2">Tambah Buku</button>
                    <button
                      type="button"
                      className="btn btn-secondary w-50"
                      onClick={() => router.push('/buku')}
                    >
                      Kembali ke Buku
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
