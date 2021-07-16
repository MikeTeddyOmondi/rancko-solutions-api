// Database Connection
dbPassword = process.env.MONGODB_REMOTE_URI;

module.exports = {
	mongoURI: dbPassword,
};
