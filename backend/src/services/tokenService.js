const crypto = require('crypto');
const pool = require('../config/database');

// Generate random token
const generateToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Create verification token
const createVerificationToken = async (userId) => {
  const token = generateToken();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  await pool.query(
    'INSERT INTO tokens (user_id, token, type, expires_at) VALUES ($1, $2, $3, $4)',
    [userId, token, 'email_verification', expiresAt]
  );

  return token;
};

// Create password reset token
const createPasswordResetToken = async (userId) => {
  const token = generateToken();
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await pool.query(
    'INSERT INTO tokens (user_id, token, type, expires_at) VALUES ($1, $2, $3, $4)',
    [userId, token, 'password_reset', expiresAt]
  );

  return token;
};

// Verify token
const verifyToken = async (token, type) => {
  const result = await pool.query(
    'SELECT * FROM tokens WHERE token = $1 AND type = $2 AND expires_at > NOW()',
    [token, type]
  );

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0];
};

// Delete token
const deleteToken = async (token) => {
  await pool.query('DELETE FROM tokens WHERE token = $1', [token]);
};

// Delete all tokens for a user
const deleteUserTokens = async (userId, type) => {
  await pool.query('DELETE FROM tokens WHERE user_id = $1 AND type = $2', [userId, type]);
};

module.exports = {
  createVerificationToken,
  createPasswordResetToken,
  verifyToken,
  deleteToken,
  deleteUserTokens,
};
