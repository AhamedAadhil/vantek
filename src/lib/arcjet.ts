// lib/arcjet.ts
import arcjet, {
  ArcjetBotCategory,
  detectBot,
  shield,
  tokenBucket,
  ArcjetWellKnownBot,
} from "@arcjet/next";

const aj = arcjet({
  key:
    process.env.NODE_ENV === "production"
      ? process.env.ARCJET_KEY_PRODUCTION!
      : process.env.ARCJET_KEY!,
  characteristics: ["ip.src"],
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({
      mode: process.env.NODE_ENV === "development" ? "DRY_RUN" : "LIVE",
      allow: [
        "CATEGORY:SEARCH_ENGINE" as ArcjetBotCategory,
        ...(process.env.NODE_ENV === "development"
          ? ["POSTMAN" as ArcjetWellKnownBot]
          : []),
      ],
    }),

    tokenBucket({
      mode: "LIVE",
      refillRate: 20,
      interval: 10,
      capacity: 40,
    }),
  ],
});

export default aj;
