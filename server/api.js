const { executeSQL } = require("./database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const secretKey = process.env.SECRET_KEY || `SUPERSECRET_KEY`;

/**
 * Initializes the API endpoints.
 * @example
 * initializeAPI(app);
 * @param {Object} app - The express app object.
 * @returns {void}
 */
const initializeAPI = (app) => {
  // default REST api endpoint
  app.get("/api/hello", hello);
  app.get("/api/users", users);
  app.post("/api/register", register);
  app.post("/api/login", login);
};

/**
 * A simple hello world endpoint.
 * @example
 * hello(req, res);
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void}
 */
const hello = (req, res) => {
  res.send("Hello World!");
};

/**
 * A simple users that shows the use of the database for insert and select statements.
 * @example
 * users(req, res);
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void}
 */
const users = async (req, res) => {
  await executeSQL("INSERT INTO users (name) VALUES ('John Doe');");
  const result = await executeSQL("SELECT * FROM users;");
  res.json(result);
};

const register = async (req, res) => {
  const { username, password, birthday } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const query = `INSERT INTO user (username, birthday, password) VALUES ('${username}', '${birthday}', '${hashedPassword}');`;
  await executeSQL(query);
  res.sendStatus(200);
};

const login = async (req, res) => {
  const { username, password } = req.body;

  const selectUserQuery = `
      SELECT * FROM \`user\` WHERE \`username\` = '${username}'
    `;
  const userInfo = await executeSQL(selectUserQuery);

  if (userInfo.length === 0)
    return res.status(401).send("Username or Password is incorrect!");

  const checkPassword = bcrypt.compareSync(password, userInfo[0].password);

  if (checkPassword) {
    const userId = userInfo[0].userId;
    const userName = userInfo[0].username;
    const userBirth = userInfo[0].birthday;
    const jwtToken = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
        id: userId,
        username: userName,
        birthday: userBirth,
      },
      secretKey
    );
    return res.status(200).send({ token: jwtToken });
  }

  return res.status(401).send("Username or Password is incorrect!");
};

module.exports = { initializeAPI };
