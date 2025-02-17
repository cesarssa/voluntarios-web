import './globals.css'

export const metadata = {
  title: 'Unidos Contra a Fome',
  description: 'Unidos Contra a Fome: Uma Luta Diária',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
