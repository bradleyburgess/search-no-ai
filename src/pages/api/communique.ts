import { contactFormSchema } from "@/lib/schemas";
import { ZodError } from "zod";
import type { APIRoute } from "astro";
import { DateTime } from "luxon";

export const prerender = false;

const { NODE_ENV, TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, FORM_TOKEN } =
  import.meta.env;

interface ITelegramMessageProps {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const createMessage = ({
  name,
  email,
  subject,
  message,
}: ITelegramMessageProps) =>
  `New message through search-no-ai

Name: ${name}
Date: ${DateTime.now()
    .setZone("Africa/Johannesburg")
    .toLocaleString(DateTime.DATETIME_MED)}
Email: ${email}
Subject: ${subject}

Message: ${message}`;

const sendTelegramMessage = async ({
  name,
  email,
  subject,
  message,
}: ITelegramMessageProps) => {
  const result = await fetch(
    `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: createMessage({
          name,
          email,
          subject,
          message,
        }),
      }),
    }
  );
  return result;
};

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();
  const { token, name, email, subject, message } = body;
  if (token != import.meta.env.FORM_TOKEN)
    return new Response("Missing Token", { status: 401 });
  try {
    const validationResult = contactFormSchema.parse({
      email,
      name,
      subject,
      message,
    });
    const telegramResult = await sendTelegramMessage({
      name,
      email,
      subject,
      message,
    });
    if (telegramResult.status === 200) {
      return new Response(null, {
        status: 200,
      });
    }
    return new Response(
      JSON.stringify({ error: "Something went wrong sending the message" }),
      {
        status: 500,
      }
    );
  } catch (error) {
    console.log(error);
    if (error instanceof ZodError) {
      const badFields = Array.from(
        new Set(error.issues.map((i) => i.path).reduce((a, c) => [...a, ...c]))
      );
      return new Response(
        JSON.stringify({
          error: `Invalid submission. Please check: ${badFields.join(", ")}.`,
        }),
        {
          status: 400,
        }
      );
    }
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
    });
  }
};
