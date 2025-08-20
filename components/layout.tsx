// components/Layout.tsx
import React, { ReactNode } from 'react';
import Navbar from './navbar';
import 'bootstrap/dist/css/bootstrap.min.css';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
}