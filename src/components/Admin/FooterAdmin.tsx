import React from 'react';
import Link from 'next/link';

const FooterAdmin = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="w-full bg-gray-100 py-4 text-center">
      <div className="container mx-auto">
        <p className="text-gray-700">
          {year} © VANTEK. Crafted by{' '}
          ❤️{' '}
          <Link href="" className="font-bold text-blue-600 hover:underline" target="_blank">
            A2 Labz
          </Link>
        </p>
      </div>
    </footer>
  );
};

export default FooterAdmin;