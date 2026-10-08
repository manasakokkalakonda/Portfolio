import './globals.css';

export const metadata = {
  title: 'My Full-Stack Portfolio',
  description: 'Explore my projects, full-stack experience, and get in touch.',
  openGraph: {
    title: 'Full-Stack Developer Portfolio',
    description: 'Explore my projects, full-stack experience, and get in touch.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased selection:bg-blue-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}