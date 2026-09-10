import { z } from "zod";

export const sourceSchema = z.object({
  id: z.string(), text: z.string().max(100000), noAI: z.boolean(), noBook: z.boolean(),
  version: z.number().int().positive(),
});
export type Source = z.infer<typeof sourceSchema>;
export const characterSchema = z.object({
  id: z.string(), displayName: z.string(), placeholder: z.string(), alias: z.string(),
  mode: z.enum(["pending", "real", "pseudonym", "role"]), self: z.boolean(),
  // Synthetic known names only. Production private identities must live behind an owner-only API.
  knownNames: z.array(z.string()), role: z.string(),
});
export type Character = z.infer<typeof characterSchema>;
export const questionSchema = z.object({ id: z.string(), text: z.string(), target: z.string(), status: z.enum(["active", "answered", "skipped"]) });
export const sessionStates = ["awaiting_story", "awaiting_answer", "evaluating", "generating_draft", "draft_review", "paused", "saved_incomplete", "blocked", "completed"] as const;
export const operationSchema = z.object({
  id: z.string(), kind: z.enum(["evaluate", "draft"]), version: z.number().int(), privacyRevision: z.number().int(),
  sourceIds: z.array(z.string()), sourceVersions: z.array(z.number().int()), payload: z.array(z.string()),
});
export type Operation = z.infer<typeof operationSchema>;
export const draftSchema = z.object({
  id: z.string(), text: z.string(), sourceIds: z.array(z.string()), baseRevision: z.number().int(),
  privacyRevision: z.number().int(), applied: z.boolean(),
});
export const sessionSchema = z.object({
  id: z.string(), focus: z.string(), targetSectionId: z.string(), kind: z.enum(["story", "reflection"]),
  state: z.enum(sessionStates), resumeState: z.enum(sessionStates).nullable(), version: z.number().int().nonnegative(),
  input: z.string().max(100000), inputNoAI: z.boolean(), inputNoBook: z.boolean(),
  answers: z.array(sourceSchema), questions: z.array(questionSchema), skips: z.number().int().nonnegative(),
  interviewed: z.boolean(), spent: z.number().nonnegative(), operation: operationSchema.nullable(),
  retryKind: z.enum(["evaluate", "draft"]).nullable(), error: z.string().nullable(),
  draft: draftSchema.nullable(), baseRevision: z.number().int(),
});
export type Session = z.infer<typeof sessionSchema>;
export const sectionSchema = z.object({
  id: z.string(), title: z.string(), text: z.string().max(200000), revision: z.number().int().nonnegative(),
  richContent: z.string().nullable(), sourceIds: z.array(z.string()),
});
export type Section = z.infer<typeof sectionSchema>;
export const bookSchema = z.object({
  id: z.string(), title: z.string().max(200), authorName: z.string().max(120), narratorId: z.string(),
  identityMode: z.enum(["mixed", "real", "pseudonym"]), privacyRevision: z.number().int().positive(),
  characters: z.array(characterSchema), sources: z.array(sourceSchema), sections: z.array(sectionSchema).min(1),
  sessions: z.array(sessionSchema),
});
export type Book = z.infer<typeof bookSchema>;
export const demoSchema = z.object({
  formatVersion: z.literal(1), books: z.array(bookSchema).max(3), activeBookId: z.string(),
  credits: z.number().int().nonnegative(), events: z.array(z.object({ id: z.string(), label: z.string(), amount: z.number().int() })),
});
export type Demo = z.infer<typeof demoSchema>;
export type Scenario = "normal" | "enough" | "short" | "stacked" | "failure" | "late";
