import './globals.css'
import type { Metadata } from 'next'
import { Providers } from "./providers";

export const meta: Metadata = {
  title: 'OxyNeo',
  description: 'A personal finance and portfolio tool',
  //viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
