// pages/index.tsx
import Layout from '../components/layout';
import 'bootstrap/dist/css/bootstrap.min.css';
import { GetServerSideProps } from 'next';

// Definisikan tipe untuk item data
interface Item {
  id: number;
  nama: string;
}

// Definisikan tipe untuk props yang diterima komponen
interface HomeProps {
  data: Item[];
}

export default function Home({ data }: HomeProps) {
  return (
    <Layout>
      <div className="container">
        <h1 className="mt-4">Selamat Datang di Aplikasi CRUD Next.js & Laravel</h1>
        <p>Data dari Backend Laravel:</p>
        {data && data.length > 0 ? (
          <ul>
            {data.map((item) => (
              <li key={item.id}>{item.nama}</li>
            ))}
          </ul>
        ) : (
          <p>Tidak ada data.</p>
        )}
      </div>
    </Layout>
  );
}

// Fungsi getServerSideProps dengan tipe dari Next.js
export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const res = await fetch('http://localhost:8000/api/');
    if (!res.ok) {
      throw new Error(`Failed to fetch data, status: ${res.status}`);
    }
    const data: Item[] = await res.json();

    return {
      props: { data },
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: { data: [] },
    };
  }
};
