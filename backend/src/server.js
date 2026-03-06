const app = require('./app');
const database = require('./config/database');

const PORT = process.env.PORT || 5000;

database.connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to database:', err);
    process.exit(1);
  });
