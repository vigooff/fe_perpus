import React, { ReactNode, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/navbar';
import 'bootstrap/dist/css/bootstrap.min.css';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const [books, setBooks] = useState<any[]>([]);

  const handleListBuku = () => {
    router.push('buku/listbuku');
  };

  const handleTambahBuku = () => {
    router.push('buku/tambahbuku');
  };

  const handlePinjamBuku = () => {
    router.push('buku/peminjaman'); // Navigasi ke halaman peminjaman
  };

  const handlePengembalianBuku = () => {
    router.push('/buku/pengembalian'); // Navigasi ke halaman pengembalian
  };

  return (
    <>
      <Navbar />
      <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <button 
            onClick={handleListBuku}
            style={{ 
              width: '50%', 
              margin: '10px 0', 
              padding: '10px', 
              borderRadius: '20px', 
              border: '2px solid black', 
              backgroundColor: 'white', 
              color: 'black', 
              fontSize: '16px', 
              cursor: 'pointer', 
              transition: 'background 2s ease, color 2s ease', 
              position: 'relative', 
              overflow: 'hidden' 
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
            List Buku
          </button>
          
          <button 
            onClick={handleTambahBuku}
            style={{ 
              width: '50%', 
              margin: '10px 0', 
              padding: '10px', 
              borderRadius: '20px', 
              border: '2px solid black', 
              backgroundColor: 'white', 
              color: 'black', 
              fontSize: '16px', 
              cursor: 'pointer', 
              transition: 'background 2s ease, color 2s ease', 
              position: 'relative', 
              overflow: 'hidden' 
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(to right, #333 0%, white 100%)';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.color = 'black';
            }}
          >
            Tambah Buku
          </button>

          <button 
            onClick={handlePinjamBuku} // Panggil fungsi handlePinjamBuku
            style={{ 
              width: '50%', 
              margin: '10px 0', 
              padding: '10px', 
              borderRadius: '20px', 
              border: '2px solid black', 
              backgroundColor: 'white', 
              color: 'black', 
              fontSize: '16px', 
              cursor: 'pointer', 
              transition: 'background 2s ease, color 2s ease', 
              position: 'relative', 
              overflow: 'hidden' 
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(to right, #333 0%, white 100%)';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.color = 'black';
            }}
          >
            Pinjam Buku
          </button>

          <button 
            onClick={handlePengembalianBuku} // Panggil fungsi handlePengembalianBuku
            style={{ 
              width: '50%', 
              margin: '10px 0', 
              padding: '10px', 
              borderRadius: '20px', 
              border: '2px solid black', 
              backgroundColor: 'white', 
              color: 'black', 
              fontSize: '16px', 
              cursor: 'pointer', 
              transition: 'background 2s ease, color 2s ease', 
              position: 'relative', 
              overflow: 'hidden' 
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
            Pengembalian Buku
          </button>
        </div>
        {children}
      </main>
    </>
  );
}
