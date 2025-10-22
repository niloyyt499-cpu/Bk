"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { XCircle } from "lucide-react"

interface PaymentFailedPageProps {
  countdown: number | null // Now receives countdown as a prop
}

export default function PaymentFailedPage({ countdown }: PaymentFailedPageProps) {
  // const [countdown, setCountdown] = useState(3)
  // const [showRedirectText, setShowRedirectText] = useState(true)

  // useEffect(() => {
  //   if (countdown > 0) {
  //     const timer = setTimeout(() => {
  //       setCountdown((prev) => prev - 1)
  //     }, 1000)
  //     return () => clearTimeout(timer)
  //   } else {
  //     setShowRedirectText(false)
  //     const redirectTimer = setTimeout(() => {
  //       onRedirect()
  //     }, 1000)
  //     return () => clearTimeout(redirectTimer)
  //   }
  // }, [countdown, onRedirect])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-sm rounded-xl overflow-hidden shadow-lg">
        <CardContent className="p-0">
          {/* Logo Section */}
          <div className="flex justify-center pt-6 pb-4 bg-white">
            <Image src="/bkash-logo.png" width={150} height={50} alt="bKash Logo" className="object-contain" />
          </div>

          {/* Payment Failed Section */}
          <div className="bg-bkash-pink p-6 text-white space-y-4 flex flex-col items-center justify-center text-center min-h-[300px]">
            <XCircle className="w-16 h-16 text-white" />
            <h2 className="text-2xl font-bold">Payment Failed</h2>
            <p className="text-sm">Merchant verification failed</p>
            {countdown !== null && (
              <p className="text-sm">
                Redirecting to <span className="font-medium underline">Merchant Website</span>{" "}
                {countdown > 0 ? `in ${countdown}s` : ""}
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="flex flex-col items-center justify-center p-4 text-xs space-y-1 bg-white">
            <div className="flex items-center gap-1 text-bkash-pink">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-phone-call"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>16247</span>
            </div>
            <p className="text-xs" style={{ color: "#9e9e9e" }}>
              © 2025 bKash, All Rights Reserved
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
