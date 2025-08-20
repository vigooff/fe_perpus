import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Layout from '../components/layout';
import { motion, AnimatePresence } from 'framer-motion';

interface Siswa {
  id: number;
  nama_siswa: string;
  tanggal_lahir: string;
  gender: string;
  alamat: string;
  id_kelas: number;
}

export default function SiswaPage() {
  const [siswaList, setSiswaList] = useState<Siswa[]>([]);
  const [message, setMessage] = useState<string>('');
  const [selectedSiswa, setSelectedSiswa] = useState<Siswa | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editData, setEditData] = useState<Siswa | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchSiswa();
  }, []);

  const fetchSiswa = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/getsiswa');
      setSiswaList(res.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setMessage('Gagal mengambil data siswa');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      try {
        await axios.delete(`http://localhost:8000/api/siswa/${id}`);
        setMessage('Data siswa berhasil dihapus!');
        fetchSiswa();
      } catch (error) {
        console.error('Error deleting data:', error);
        setMessage('Terjadi kesalahan saat menghapus data');
      }
    }
  };

  const handleEdit = (siswa: Siswa) => {
    setEditData(siswa);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (editData) {
      try {
        await axios.put(`http://localhost:8000/api/siswa/${editData.id}`, editData);
        setMessage('Data siswa berhasil diperbarui!');
        setIsEditing(false);
        fetchSiswa();
      } catch (error) {
        console.error('Error updating data:', error);
        setMessage('Terjadi kesalahan saat memperbarui data');
      }
    }
  };

  return (
    <Layout>
      <div className={`container mt-4 ${isEditing || selectedSiswa ? 'opacity-50' : ''}`}>
        <h1>Data Siswa</h1>
        {message && <div className="alert alert-info">{message}</div>}
        <button 
          className="btn btn-primary mb-3" 
          onClick={() => router.push('/create')}
        >
          Tambah Siswa
        </button>

        <table className="table table-bordered">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Siswa</th>
              <th>Tanggal Lahir</th>
              <th>Gender</th>
              <th>Alamat</th>
              <th>ID Kelas</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {siswaList.length > 0 ? (
              siswaList.map((siswa, index) => (
                <tr key={siswa.id}>
                  <td>{index + 1}</td>
                  <td>{siswa.nama_siswa}</td>
                  <td>{siswa.tanggal_lahir}</td>
                  <td>{siswa.gender}</td>
                  <td>{siswa.alamat}</td>
                  <td>{siswa.id_kelas}</td>
                  <td>
                    <button 
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleEdit(siswa)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-danger btn-sm me-2"
                      onClick={() => handleDelete(siswa.id)}
                    >
                      Hapus
                    </button>
                    <button 
                      className="btn btn-info btn-sm"
                      onClick={() => setSelectedSiswa(siswa)}
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center">Tidak ada data siswa</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {isEditing && editData && (
          <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50">
            <motion.div 
              initial={{ y: -100, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              exit={{ y: -100, opacity: 0 }} 
              transition={{ duration: 0.5 }} 
              className="bg-white p-4 rounded shadow-lg" 
              style={{ width: '75%', height: '75%' }}
            >
              <h4>Edit Siswa</h4>
              <form>
                <div className="mb-3">
                  <label className="form-label">Nama Siswa</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={editData.nama_siswa} 
                    onChange={(e) => setEditData({ ...editData, nama_siswa: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Tanggal Lahir</label>
                  <input 
                    type="date" 
                    className="form-control" 
                    value={editData.tanggal_lahir} 
                    onChange={(e) => setEditData({ ...editData, tanggal_lahir: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Gender</label>
                  <select 
                    className="form-control" 
                    value={editData.gender} 
                    onChange={(e) => setEditData({ ...editData, gender: e.target.value })}
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
                    value={editData.alamat} 
                    onChange={(e) => setEditData({ ...editData, alamat: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">ID Kelas</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    value={editData.id_kelas} 
                    onChange={(e) => setEditData({ ...editData, id_kelas: parseInt(e.target.value) })}
                  />
                </div>
              </form>
              <button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
              <button className="btn btn-secondary ms-2" onClick={() => setIsEditing(false)}>Cancel</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {selectedSiswa && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50">
          <motion.div 
            initial={{ y: -100, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ duration: 0.5 }} 
            className="bg-white p-4 rounded shadow-lg" 
            style={{ width: '400px' }}
          >
            <h4>Detail Siswa</h4>
            <p><strong>Nama:</strong> {selectedSiswa.nama_siswa}</p>
            <p><strong>Tanggal Lahir:</strong> {selectedSiswa.tanggal_lahir}</p>
            <p><strong>Gender:</strong> {selectedSiswa.gender}</p>
            <p><strong>Alamat:</strong> {selectedSiswa.alamat}</p>
            <p><strong>ID Kelas:</strong> {selectedSiswa.id_kelas}</p>
            <button className="btn btn-secondary" onClick={() => setSelectedSiswa(null)}>Tutup</button>
          </motion.div>
        </div>
      )}
    </Layout>
  );
}