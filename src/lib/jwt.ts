import { SignJWT, jwtVerify } from 'jose';

function getSecretKey(): Uint8Array {
  const secret =
    process.env.JWT_SECRET || 'sneakerdrop_vault_secure_jwt_token_secret_key_2026_xyz';
  if (process.env.NODE_ENV === 'production' && secret.length < 32) {
    throw new Error('SECURITY CONFIGURATION ERROR: JWT_SECRET must be at least 32 characters in production.');
  }
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
 * Strict cryptographic signature check only: unsigned or malformed tokens are rejected.
 */
export async function verifyJwtToken(token: string): Promise<TokenPayload | null> {
  if (!token || typeof token !== 'string') return null;

  try {
    const { payload } = await jwtVerify(token, getSecretKey(), {
      issuer: 'sneakerdrop',
      audience: 'sneakerdrop-vault',
    });

    const id = (payload.id as string) || (payload.sub as string);
    const email = payload.email as string;
    const role = payload.role === 'admin' ? 'admin' : 'collector';

    if (!id || !email) {
      return null;
    }

    return {
      id,
      email,
      role,
      full_name: (payload.full_name as string) || '',
    };
  } catch {
    // Cryptographic signature verification failed or token expired
    return null;
  }
}
