import { z } from 'zod';

const timeSchema = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Use HH:mm in 24-hour time');

export const appConfigSchema = z.object({
  dryRun: z.boolean(),
  localMode: z.boolean(),
  timezone: z.string().min(1),
  maxCommitsPerDay: z.number().int().min(1).max(12),
  minMinutesBetweenCommits: z.number().int().min(30).max(240),
  quietHoursStart: timeSchema,
  quietHoursEnd: timeSchema,
  allowedBranch: z.string().regex(/^[A-Za-z0-9._/-]+$/),
  gitAuthorName: z.string().min(1).max(80),
  gitAuthorEmail: z
    .string()
    .regex(/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/, 'Use a valid git author email'),
  workspaceRoot: z.string().min(1)
});

export type AppConfig = z.infer<typeof appConfigSchema>;
