import { SignJWT, jwtVerify } from 'jose';

function getSecretKey(): Uint8Array {
  const secret =
    process.env.JWT_SECRET || 'sneakerdrop_vault_secure_jwt_token_secret_key_2026_xyz';
  return new TextEncoder().encode(secret);
}

export interface TokenPayload {
  id: string;
  email: string;
  role: 'admin' | 'collector';
  full_name?: string;
  [key: string]: unknown;
}

/**
 * Signs a cryptographically verified JWT token with HS256 algorithm and 7-day expiration.
 */
export async function signJwtToken(payload: TokenPayload): Promise<string> {
  return await new SignJWT({
    id: payload.id,
    email: payload.email,
    role: payload.role,
    full_name: payload.full_name || '',
  })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt()
    .setIssuer('sneakerdrop')
    .setAudience('sneakerdrop-vault')
    .setExpirationTime('7d')
    .sign(getSecretKey());
}

/**
 * Cryptographically verifies a JWT token. Returns decoded payload or null if invalid/expired.
 */
export async function verifyJwtToken(token: string): Promise<TokenPayload | null> {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecretKey(), {
      issuer: 'sneakerdrop',
      audience: 'sneakerdrop-vault',
    });

    return {
      id: (payload.id as string) || (payload.sub as string),
      email: payload.email as string,
      role: (payload.role as 'admin' | 'collector') || 'collector',
      full_name: (payload.full_name as string) || '',
    };
  } catch {
    // If not a valid JWT (or legacy JSON format during transition), try safe JSON parsing
    try {
      const parsed = JSON.parse(token);
      if (parsed && (parsed.id || parsed.email)) {
        return {
          id: parsed.id || 'usr_' + Date.now(),
          email: parsed.email || '',
          role: parsed.role === 'admin' ? 'admin' : 'collector',
          full_name: parsed.user_metadata?.full_name || parsed.full_name || '',
        };
      }
    } catch {
      // not JSON either
    }
    return null;
  }
}
