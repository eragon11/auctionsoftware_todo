import jwt from 'jsonwebtoken';
const JWT_SECRET = "this is a JWTSECRET!!";

const UserAuthService = {
  verifyAndDecode: async (token) => {
    let decodedPayload = {};
    try {
      decodedPayload = jwt.verify(token, JWT_SECRET);
      if (decodedPayload.exp >= (Date.now() / 1000)) {
        decodedPayload.valid = true;
      } else {
        decodedPayload.valid = false;
      }
    } catch (error) {
      return decodedPayload.valid = false;
    }
    return decodedPayload;
  },
  getJwtToken: async (payload) => {

    const token = await jwt.sign({
      data: payload
    }, JWT_SECRET, { expiresIn: '7d' });
    payload.token = token;

    return payload;
  },
  getUpdatedJwtToken: async (payload, token) => {
    let decodedPayload = jwt.verify(token, JWT_SECRET);
    payload.token = await jwt.sign({
      data: payload
    }, JWT_SECRET, {
      expiresIn: decodedPayload.exp
    });
    return payload;
  }
}

export default UserAuthService;