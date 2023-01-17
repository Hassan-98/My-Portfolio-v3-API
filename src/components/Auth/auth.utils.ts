import { OAuth2Client } from 'google-auth-library';

export const verifyGoogleAuth = async (token: string) => {
  const client = new OAuth2Client(process.env.G_CLIENT_ID);

  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.G_CLIENT_ID
  });

  const payload = ticket.getPayload();

  return payload;
}