export interface PrimitiveUser {
  id: number;
  email: string;
  passwordHash: string;
  fullName: string;
  phone: string | null;
  role: 'customer' | 'creator' | 'admin';
  status: 'active' | 'suspended' | 'pending';
  createdAt: Date;
  updatedAt: Date;
}

export type NewUserDTO = Omit<PrimitiveUser, 'id' | 'status' | 'createdAt' | 'updatedAt'>;
