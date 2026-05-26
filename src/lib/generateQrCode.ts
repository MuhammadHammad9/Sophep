/**
 * Generates a QR code PNG as a Buffer or base64 data URI.
 * Uses the `qrcode` package which runs in Node.js serverless without issues.
 */
import QRCode from 'qrcode';

/**
 * Returns a PNG Buffer containing a QR code for the given text.
 * Suitable for attaching to emails via Resend.
 */
export async function generateQrCodeBuffer(text: string): Promise<Buffer> {
  const buffer = await QRCode.toBuffer(text, {
    type: 'png',
    width: 300,
    margin: 2,
    color: {
      dark: '#0A0415',  // SOPHEP brand dark
      light: '#FFFFFF',
    },
    errorCorrectionLevel: 'H',
  });
  return buffer;
}

/**
 * Returns a base64 data URI string — useful for embedding in PDF/HTML templates.
 */
export async function generateQrCodeDataUri(text: string): Promise<string> {
  return QRCode.toDataURL(text, {
    type: 'image/png',
    width: 300,
    margin: 2,
    color: {
      dark: '#0A0415',
      light: '#FFFFFF',
    },
    errorCorrectionLevel: 'H',
  });
}
