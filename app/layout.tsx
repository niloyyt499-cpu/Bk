export const metadata = {
  title: 'bKash Payment',
  description: 'bKash Payment System',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
