import { User } from '@database/models/user.model';
import { type AuthClaims, signAccessToken, signRefreshToken } from '@shared/auth/jwt';
import { verifyPassword } from '@shared/auth/password';
import { HttpError } from '@shared/errors/httpError';

export class AuthService {
  async login(input: { email: string; password: string }) {
    const user = await User.findOne({ where: { email: input.email } });
    if (!user) throw new HttpError(401, 'Credenciales inválidas');
    const ok = await verifyPassword(input.password, user.passwordHash);
    if (!ok) throw new HttpError(401, 'Credenciales inválidas');
    if (user.status !== 'active') throw new HttpError(403, 'Usuario no activo');

    const claims: AuthClaims = { sub: String(user.id), role: user.role };
    const accessToken = signAccessToken(claims);
    const refreshToken = signRefreshToken(claims);
    return { user, accessToken, refreshToken };
  }
}
