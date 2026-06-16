import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import "@/styles/globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';

function MyApp({ Component, pageProps }: AppProps) {
  
  useEffect(() => {
    // Memanggil JS Bootstrap secara dinamis HANYA di sisi client (browser)
    import('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
