import { Inter } from 'next/font/google'
import 'bootstrap/dist/css/bootstrap.css'
import Menu from '@/componentes/menu'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name='viewport' content='width=device-width, initial-scale=1'></meta>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
          integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL"
          crossorigin="anonymous">
        </script>
        <title>Examen</title>
      </head>

      <body className={inter.className}>
        <div className='container-fluid'>

          <section className='container'>
            {children}
          </section>

        </div>
      </body>

      {/* <body className={inter.className}>{children}</body> */}
    </html>
  )
}
