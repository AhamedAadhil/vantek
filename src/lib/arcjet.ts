// lib/arcjet.ts
import arcjet, {
  ArcjetBotCategory,
  detectBot,
  shield,
  tokenBucket,
  ArcjetWellKnownBot,
} from "@arcjet/next";

const aj = arcjet({
  key: process.env.ARCJET_KEY!,
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
      refillRate: 5,
      interval: 10,
      capacity: 10,
    }),
  ],
});

export default aj;
