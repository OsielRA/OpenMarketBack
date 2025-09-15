import { z } from 'zod';

export const loginSchema = z
  .object({
    email: z.string().email('Email inválido'),
    password: z.string().min(8, 'Contraseña mínima de 8 caracteres'),
  })
  .strict();
export type LoginDTO = z.infer<typeof loginSchema>;
