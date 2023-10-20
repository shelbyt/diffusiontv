// DesktopView.tsx
import React from 'react';
import QRCode from 'react-qr-code';

const DesktopView: React.FC = () => {

  return (
    <div className="min-h-screen flex justify-center items-center">
        <QRCode
          value="https://21f1-108-65-6-128.ngrok-free.app"
          size={200}
          className="border rounded-md"
        />
    </div>
  );
};

export default DesktopView;
