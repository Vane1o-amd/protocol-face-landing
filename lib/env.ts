import { z } from "zod";

const EnvSchema = z.object({
  TG_BOT_TOKEN: z.string().min(1),
  TG_CHAT_ID: z.string().min(1),
  META_CAPI_TOKEN: z.string().min(1),
  NEXT_PUBLIC_META_PIXEL_ID: z.string().min(1),
  ALLOWED_ORIGIN: z.string().optional(),
});

export type Env = z.infer<typeof EnvSchema>;

export function getEnv(): Env {
  const parsed = EnvSchema.safeParse({
    TG_BOT_TOKEN: process.env.TG_BOT_TOKEN,
    TG_CHAT_ID: process.env.TG_CHAT_ID,
    META_CAPI_TOKEN: process.env.META_CAPI_TOKEN,
    NEXT_PUBLIC_META_PIXEL_ID: process.env.NEXT_PUBLIC_META_PIXEL_ID,
    ALLOWED_ORIGIN: process.env.ALLOWED_ORIGIN,
  });
  if (!parsed.success) {
    const missing = parsed.error.issues
      .map((i) => i.path.join("."))
      .join(", ");
    throw new Error(`Missing env: ${missing}`);
  }
  return parsed.data;
}