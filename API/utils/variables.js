const { env } = process;
const MONGO_URI = env.MONGO_URI;
const MAILTRAP_USER = env.MAILTRAP_USER;
const MAILTRAP_PASS = env.MAILTRAP_PASS;
const JWT_SECRET = env.JWT_SECRET;

module.exports = { MONGO_URI, MAILTRAP_USER, MAILTRAP_PASS, JWT_SECRET };
