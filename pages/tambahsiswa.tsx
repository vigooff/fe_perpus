import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Layout from '../components/layout';

interface Siswa {
  nama_siswa: string;
  tanggal_lahir: string;
  gender: string;
  alamat: string;
  id_kelas: number;
}

export default function TambahSiswaPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<Siswa>({
    nama_siswa: '',
    tanggal_lahir: '',
    gender: 'Laki-laki',
    alamat: '',
    id_kelas: 0,
  });
  const [message, setMessage] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'id_kelas' ? parseInt(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8000/api/createsiswa', formData);
      if (res.status === 201) {
        setMessage('Data siswa berhasil ditambahkan!');
        setTimeout(() => {
          router.push('/'); // Kembali ke halaman utama setelah berhasil menambahkan data
        }, 1500);
      }
    } catch (error) {
      console.error('Error adding data:', error);
      setMessage('Terjadi kesalahan saat menambahkan data');
    }
  };

  return (
    <Layout>
      <div className="container mt-4">
        <h1>Tambah Siswa Baru</h1>
        {message && <div className="alert alert-info">{message}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nama Siswa</label>
            <input
              type="text"
              className="form-control"
              name="nama_siswa"
              value={formData.nama_siswa}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Tanggal Lahir</label>
            <input
              type="date"
              className="form-control"
              name="tanggal_lahir"
              value={formData.tanggal_lahir}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Gender</label>
            <select
              className="form-control"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Alamat</label>
            <input
              type="text"
              className="form-control"
              name="alamat"
              value={formData.alamat}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">ID Kelas</label>
            <input
              type="number"
              className="form-control"
              name="id_kelas"
              value={formData.id_kelas}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Tambah Siswa Baru
          </button>
        </form>
      </div>
    </Layout>
  );
}