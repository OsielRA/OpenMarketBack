import { z } from 'zod';

// Campos básicos reutilizables
const email = z.string({ message: 'El email es requerido' }).email('Email inválido');

const password = z
  .string({ message: 'La contraseña es requerida' })
  .min(8, 'La contraseña debe tener al menos 8 caracteres');

const fullName = z
  .string({ message: 'El nombre completo es requerido' })
  .min(2, 'Nombre demasiado corto')
  .max(150, 'Nombre demasiado largo');

const phone = z
  .string()
  .min(7, 'Teléfono demasiado corto')
  .max(30, 'Teléfono demasiado largo')
  .optional()
  .nullable()
  .transform((v) => (v === undefined ? null : v));

export const createUserSchema = z
  .object({
    email,
    passwordHash: password,
    fullName,
    phone,
    role: z.enum(['customer', 'creator', 'admin']),
  })
  .strict(); // rechaza claves extra

// Para /users/:id (params)
export const userIdParamSchema = z
  .object({ id: z.coerce.number().int().positive('id inválido') })
  .strict();

// Para PATCH /users/:id (parcial)
export const updateUserSchema = z
  .object({
    fullName: z.string().min(2).max(150).optional(),
    phone: z.string().min(7).max(30).optional().nullable(),
    status: z.enum(['active', 'suspended', 'pending']).optional(),
    role: z.enum(['customer', 'creator', 'admin']).optional(),
  })
  .strict();

export type CreateUserDTO = z.infer<typeof createUserSchema>;
export type UserIdParamDTO = z.infer<typeof userIdParamSchema>;
export type UpdateUserDTO = z.infer<typeof updateUserSchema>;
