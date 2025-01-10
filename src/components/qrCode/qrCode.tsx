import { useEffect } from 'react';
import QRCode from 'react-qr-code';

type QrCodeProps = {
  id: string
  isDisplay?: boolean
  onClose?: ()=>void
}


export default function QrCode({ id, isDisplay, onClose }: QrCodeProps) {

  const host = location.origin
  useEffect(() => {
    if (!isDisplay && onClose) {
      const qrElement = document.getElementById(id);
      if (qrElement instanceof SVGSVGElement) {
        const pathContent = qrElement.outerHTML || ''; // Получаем содержимое path
        const link = document.createElement('a');
        link.href = `data:image/svg+xml;utf8,${encodeURIComponent(pathContent)}`;
        link.download = 'qrCode.svg';
        link.click();
        onClose();
      }
    }
  }, []);


  return (
    <QRCode id={`${id}`} style={!isDisplay ? {display: 'none'}:{}} value={`${host}/${id}`} />
  )
}