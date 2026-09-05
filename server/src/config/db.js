const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const sequelize = new Sequelize(
  process.env.DB_NAME || 'campuslink',
  process.env.DB_USER || 'avnadmin',
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 15359,
    dialect: 'mysql',
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false
      }
    },
    logging: false
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('🚀 MySQL Database Connected successfully (via Sequelize SSL)');
  } catch (error) {
    console.error('❌ Unable to connect to the MySQL database:', error.message);
  }
};

module.exports = { sequelize, connectDB };
