import "./globals.css";


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning={true}
        className="theme-main min-h-screen bg-gradient-to-b from-[#071A2E] to-[#0B1F3A] text-slate-100"
      >
        {children}
      </body>
    </html>
  );
}
