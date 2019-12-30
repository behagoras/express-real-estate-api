require('dotenv').config();

const config = {
  dev: process.env.node_env !== 'production',
  port: process.env.port || 3000,
  cors: process.env.cors,
  dbUser: process.env.db_user,
  dbPassword: process.env.db_password,
  dbHost: process.env.db_host,
  dbName: process.env.db_name,
  dbPort: process.env.db_port,
  authJwtSecret: process.env.auth_jwt_secret, 
  defaultAdminPassword: process.env.default_admin_password,
  defaultUserPassword: process.env.default_user_password,
  publicApiKeyToken: process.env.public_api_key_token,
  adminApiKeyToken: process.env.admin_api_key_token,
  spotifyClientID: process.env.spotify_client_id,
  spotifyClientSecret: process.env.spotify_client_secret,
  googleClientID: process.env.google_client_id,
  googleClientSecret: process.env.google_client_id
};

module.exports = { config };
