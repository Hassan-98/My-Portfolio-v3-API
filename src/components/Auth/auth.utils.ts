import axios from 'axios';

interface GoogleResponse {
  sub: string,
  name: string,
  given_name: string,
  family_name: string,
  picture: string,
  email: string,
  email_verified: boolean,
  locale: string
}

export const verifyGoogleAuth = async (token: string): Promise<GoogleResponse | null> => {
  try {
    const res = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`);
    return res.data;
  } catch (err: any) {
    return null;
  }
}