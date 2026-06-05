import './globals.css';

export const metadata = {
  title: 'Blog - Divmagic',
  description: 'Discover the latest insights on AI, technology, and business.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
