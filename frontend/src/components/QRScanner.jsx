"use client"

import { useEffect } from "react"
import { Html5Qrcode } from "html5-qrcode"

const QRScanner = ({ onResult, onClose }) => {
  useEffect(() => {
    const html5QrCode = new Html5Qrcode("qr-reader")

    const startScanner = async () => {
      try {
        await html5QrCode.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            html5QrCode.stop()
            onResult(decodedText)
          },
          (error) => {
            // console.error(error);
          },
        )
      } catch (err) {
        console.error("Error starting scanner:", err)
      }
    }

    startScanner()

    return () => {
      html5QrCode.stop().catch((err) => console.error(err))
    }
  }, [onResult])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg max-w-md w-full">
        <div className="mb-4 flex justify-between items-center">
          <h3 className="text-lg font-semibold">Scan QR Code</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
        <div id="qr-reader" className="w-full"></div>
      </div>
    </div>
  )
}

export default QRScanner

