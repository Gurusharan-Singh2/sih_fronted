import './globals.css'; //
import QueryProvider from './QueryProvider';

export const metadata = {
  title: 'Smart SOC Dashboard',
  description: 'Smart Security Operations Center Dashboard',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  )
}
