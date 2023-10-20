// DesktopView.tsx
import React from 'react';
import QRCode from 'react-qr-code';

const DesktopView: React.FC = () => {

  return (
    <div className="min-h-screen flex justify-center items-center">
        <QRCode
          value={""}
          size={200}
          className="border rounded-md"
        />
    </div>
  );
};

export default DesktopView;
