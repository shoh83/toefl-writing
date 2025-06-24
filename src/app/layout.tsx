// src/app/layout.tsx
import './globals.css';
import React from 'react';

export const metadata = {
  title: 'TOEFL Writing Coach',
  description: 'Instant AI-powered feedback on your TOEFL writing.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 font-sans text-gray-800">
        {children}
      </body>
    </html>
  );
}
