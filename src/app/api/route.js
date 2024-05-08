import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req) {
  const token = "bQpzIpNyMwmu9yf5PaZny40gpRyFYTteESRDeypWpqp";
  const { message } = await req.json();
  console.log(message);

  try {
    const response = await axios("https://notify-api.line.me/api/notify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${token}`,
      },
      data: `message=${message}`,
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Failed to send Line notification:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
