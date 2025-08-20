import React, { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { GetServerSideProps } from 'next';

// Impor Layout dengan path dan penamaan yang benar
import Layout from '../../../components/layout';

interface Book {
  id_buku: number;
  judul_buku: string;
  foto_buku: string | null;
  foto_buku_url?: string;
  penerbit?: string;
  penulis?: string;
  kategori?: string;
}

interface ListBukuProps {
  books: Book[];
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const res = await axios.get('http://127.0.0.1:8000/api/buku');
    const books: Book[] = res.data.data.map((book: Book) => ({
      ...book,
      foto_buku_url: book.foto_buku
        ? `http://127.0.0.1:8000/storage/book_photos/${book.foto_buku.split('/').pop()}`
        : null,
    }));
    return { props: { books } };
  } catch (error) {
    console.error('Error fetching books:', error);
    return { props: { books: [] } };
  }
};

const ListBuku: React.FC<ListBukuProps> = ({ books: initialBooks }) => {
  const [showModal, setShowModal] = useState(false);
  const [showBookPopup, setShowBookPopup] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [formData, setFormData] = useState({
    judul_buku: '',
    penerbit: '',
    penulis: '',
    kategori: '',
    foto_buku: null as File | null,
  });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchBooks = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/buku');
      const updatedBooks: Book[] = res.data.data.map((book: Book) => ({
        ...book,
        foto_buku_url: book.foto_buku
          ? `http://127.0.0.1:8000/storage/book_photos/${book.foto_buku.split('/').pop()}`
          : null,
      }));
      setBooks(updatedBooks);
      setError(null);
    } catch (error) {
      console.error('Error fetching books:', error);
      setError('Gagal memuat daftar buku. Silakan coba lagi.');
    }
  };

  const handleEditClick = (book: Book) => {
    setSelectedBook(book);
    setFormData({
      judul_buku: book.judul_buku || '',
      penerbit: book.penerbit || '',
      penulis: book.penulis || '',
      kategori: book.kategori || '',
      foto_buku: null,
    });
    setShowModal(true);
  };

  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
    setShowBookPopup(true);
  };

  const handleDeleteClick = async (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus buku ini?')) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/buku/${id}`);
        alert('Buku berhasil dihapus!');
        fetchBooks();
      } catch (error) {
        console.error('Error deleting book:', error);
        alert('Gagal menghapus buku.');
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedBook(null);
    setFormData({
      judul_buku: '',
      penerbit: '',
      penulis: '',
      kategori: '',
      foto_buku: null,
    });
  };

  const handleCloseBookPopup = () => {
    setShowBookPopup(false);
    setSelectedBook(null);
  };

  const handleBorrowClick = () => {
    if (selectedBook) {
      router.push(`/peminjaman?id_buku=${selectedBook.id_buku}`);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, foto_buku: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBook) return;
  
    try {
      const data = new FormData();
      const fields = ['judul_buku', 'penerbit', 'penulis', 'kategori'] as const;
  
      // Tambah hanya field yang diubah
      fields.forEach((field) => {
        if (formData[field] && formData[field] !== selectedBook[field]) {
          data.append(field, formData[field]);
        }
      });
  
      if (formData.foto_buku) {
        data.append('foto_buku', formData.foto_buku);
      }
  
      // Cek apakah ada field yang dikirim
      if ([...data.keys()].length === 0) {
        alert('Tidak ada perubahan yang dibuat.');
        return;
      }
  
      await axios.post(
        `http://127.0.0.1:8000/api/buku/${selectedBook.id_buku}?_method=PUT`,
        data,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
  
      alert('Data buku berhasil diperbarui!');
      fetchBooks();
      handleCloseModal();
    } catch (error: any) {
      console.error('Error updating book:', error);
      alert(
        error.response
          ? `Gagal memperbarui data buku: ${JSON.stringify(error.response.data)}`
          : 'Gagal memperbarui data buku.'
      );
    }
  };
  

  const kategoriOptions = ['Politik', 'Sosial', 'Pemrograman'];

  return (
    <Layout>
      <style jsx>{`
        .book-card {
          transition: transform 0.2s, box-shadow 0.2s;
          position: relative;
          border: none;
          cursor: pointer;
        }
        .book-card:hover {
          transform: scale(1.05);
          box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.3);
        }
        .book-image-wrapper {
          position: relative;
          width: 100%;
          padding-top: 133.33%;
          overflow: hidden;
          background-color: #f8f9fa;
        }
        .book-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }
        .card-body {
          padding: 0.5rem;
        }
        .card-title {
          font-size: 0.9rem;
          margin-bottom: 0.25rem;
        }
        .action-buttons {
          display: flex;
          gap: 0.5rem;
        }
        .blur-background {
          filter: blur(4px);
          transition: filter 0.3s ease;
        }
        .modal-custom {
          animation: slideDownFade 0.3s ease-out forwards;
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          max-width: 500px;
          width: 90%;
          max-height: 80vh;
          overflow-y: auto;
          border-radius: 20px;
          padding: 1.5rem;
          z-index: 1050;
        }
        .book-popup {
          animation: popUp 0.3s ease-out forwards;
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) scale(1);
          max-width: 400px;
          width: 90%;
          background: white;
          border-radius: 15px;
          padding: 1.5rem;
          z-index: 1050;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
          text-align: center;
        }
        .book-popup img {
          max-width: 200px;
          max-height: 300px;
          object-fit: cover;
          border-radius: 10px;
          margin-bottom: 1rem;
        }
        .book-popup h3 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
        }
        .modal-backdrop-custom {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          z-index: 1040;
        }
        @keyframes slideDownFade {
          0% {
            opacity: 0;
            transform: translate(-50%, -60%);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, -50%);
          }
        }
        @keyframes popUp {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.7);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
      `}</style>

      <div className={`container mt-5 ${showModal || showBookPopup ? 'blur-background' : ''}`}>
        <h1
          className="mb-4 text-center"
          style={{ fontFamily: "'Cielo Sulfur Point', sans-serif" }}
        >
          List Buku
        </h1>
        {error && <div className="alert alert-danger">{error}</div>}
        {books.length === 0 ? (
          <p>Tidak ada buku yang tersedia.</p>
        ) : (
          <div className="row row-cols-2 row-cols-md-5 g-3">
            {books.map((book) => (
              <div key={book.id_buku} className="col">
                <div
                  className="card book-card h-100"
                  onClick={() => handleBookClick(book)}
                >
                  <div className="book-image-wrapper">
                    <img
                      src={book.foto_buku_url || 'https://via.placeholder.com/150x200'}
                      alt={book.judul_buku}
                      className="book-image"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/150x200';
                      }}
                    />
                  </div>
                  <div className="card-body">
                    <h5 className="card-title">{book.judul_buku}</h5>
                    <div className="action-buttons">
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(book);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(book.id_buku);
                        }}
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showModal && (
        <>
          <div className="modal-backdrop-custom" onClick={handleCloseModal}></div>
          <div className="modal-custom bg-white shadow-lg">
            <h5 className="modal-title mb-3">Edit Buku</h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="judul_buku" className="form-label">
                  Nama Buku
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="judul_buku"
                  name="judul_buku"
                  value={formData.judul_buku}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="penerbit" className="form-label">
                  Penerbit
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="penerbit"
                  name="penerbit"
                  value={formData.penerbit}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="penulis" className="form-label">
                  Penulis
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="penulis"
                  name="penulis"
                  value={formData.penulis}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="kategori" className="form-label">
                  Kategori
                </label>
                <select
                  className="form-select"
                  id="kategori"
                  name="kategori"
                  value={formData.kategori}
                  onChange={handleInputChange}
                >
                  <option value="">Pilih Kategori</option>
                  {kategoriOptions.map((option) => (
                    <option key={option} value={option.toLowerCase()}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="foto_buku" className="form-label">
                  Foto Buku
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="foto_buku"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {selectedBook?.foto_buku_url && (
                  <img
                    src={selectedBook.foto_buku_url}
                    alt="Preview"
                    className="mt-2"
                    style={{ maxWidth: '100px', maxHeight: '100px' }}
                  />
                )}
              </div>
              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* Book Popup */}
      {showBookPopup && selectedBook && (
        <>
          <div className="modal-backdrop-custom" onClick={handleCloseBookPopup}></div>
          <div className="book-popup">
            <img
              src={selectedBook.foto_buku_url || 'https://via.placeholder.com/150x200'}
              alt={selectedBook.judul_buku}
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/150x200';
              }}
            />
            <h3>{selectedBook.judul_buku}</h3>
            <button className="btn btn-primary" onClick={handleBorrowClick}>
              Pinjam
            </button>
          </div>
        </>
      )}
    </Layout>
  );
};

export default ListBuku;