import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          สร้างภาพจากข้อความ (Image Generator)
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          จัดทำโดย Chaiwat P. v1.0
        </p>
      </div>
    </header>
  );
};