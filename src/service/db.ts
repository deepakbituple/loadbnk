import mysql from "mysql2/promise";

export const dbpool = mysql.createPool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export const status = async () => {
  let connection;
  try {
    connection = await dbpool.getConnection();

    return "Database is up";
  } catch (error) {
    console.error("Error connecting to database", error);
    let err = error as any;
    const message = "Database is down. " + err.code;
    return message;
  } finally {
    if (connection) connection.release();
  }
};
