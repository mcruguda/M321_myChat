let pool = null;

/**
 * Initializes the MariaDB connection pool.
 * The connection pool is used to execute SQL queries.
 * The connection pool is created with the following parameters:
 * - database: The name of the database to connect to. (process.env.DB_NAME)
 * - host: The host of the database. (process.env.DB_HOST)
 * - user: The user to connect to the database. (process.env.DB_USER)
 * - password: The password to connect to the database. (process.env.DB_PASSWORD)
 * - connectionLimit: The maximum number of connections in the pool. (5)
 * @example
 * initializeMariaDB();
 * @returns {void}
 * @see {@link https://mariadb.com/kb/en/mariadb-connector-nodejs-pooling/}
 */
const initializeMariaDB = () => {
  const mariadb = require("mariadb");
  pool = mariadb.createPool({
    database: process.env.DB_NAME || "mychat",
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "mychat",
    password: process.env.DB_PASSWORD || "mychatpassword",
    connectionLimit: 5,
  });
};

/**
 * Allows the execution of SQL queries.
 * @example
 * // Insert statement with a parameter. Can be multiple in an array format like ["Patrick", 1]
 * executeSQL("INSERT INTO users value (?)", ["Patrick"]);
 * @example
 * // Select statement without parameters.
 * executeSQL("SELECT * FROM users;");
 * @returns {Promise<Array>} Returns the result of the query.
 */
const executeSQL = async (query, params) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const res = await conn.query(query, params);
    return res;
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.release();
  }
};

/**
 * Initializes the database schema.
 * Creates the tables if they do not exist.
 * Useful for the first time setup.
 */
const initializeDBSchema = async () => {
  const userTableQuery = `CREATE TABLE IF NOT EXISTS user (
    userId INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL UNIQUE,
    birthday VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    PRIMARY KEY (userid)
  );`;
  await executeSQL(userTableQuery);
  const chatTableQuery = `CREATE TABLE IF NOT EXISTS chats (
    chatId INT NOT NULL AUTO_INCREMENT,
    chatName VARCHAR(255) NOT NULL,
    PRIMARY KEY (chatId)
  );`;
  await executeSQL(chatTableQuery);
  const messageTableQuery = `CREATE TABLE IF NOT EXISTS messages (
    messageId INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    chat_id INT NOT NULL,
    msgText text NOT NULL,
    date VARCHAR(255) NOT NULL,
    time VARCHAR(255) NOT NULL,
    PRIMARY KEY (messageId),
    FOREIGN KEY (user_id) REFERENCES user(userId),
    FOREIGN KEY (chat_id) REFERENCES chats(chatId)
  );`;
  await executeSQL(messageTableQuery);
  const userChatTableQuery = `CREATE TABLE IF NOT EXISTS user_chats (
    chat_id INT NOT NULL,
    user_id INT NOT NULL,
    PRIMARY KEY (chat_id, user_id),
    FOREIGN KEY (user_id) REFERENCES user(userId),
    FOREIGN KEY (chat_id) REFERENCES chats(chatId)
  );`;
  await executeSQL(userChatTableQuery);
  const publicChat = `INSERT INTO chats (chatId, chatName) VALUES (1, "Public") ON DUPLICATE KEY UPDATE chatId = 1;`;
  await executeSQL(publicChat);
};

module.exports = { executeSQL, initializeMariaDB, initializeDBSchema };
