import { z } from 'zod';

export const FindTutorSchema = z.object({
  //   tutorType: z.string().optional(),
  subject: z.string({
    required_error: 'Subject is required'
  }),
  topic: z.string().optional(),
  description: z.string().optional(),
  level: z.string().optional(),
  price: z.string().optional(),
  rating: z.number().optional(),
  instructionMode: z.string().optional(),
  time: z.string().optional(),
  expirationDate: z.date().optional()
});

export type FindTutorSchemaType = z.infer<typeof FindTutorSchema>;
