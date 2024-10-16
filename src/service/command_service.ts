import Command from "../model/command";
import pool from "./db";

export const getCommands = async (controller: string): Promise<Command[]> => {
  const commands: Command[] = [];
  let connection;
  const query = "SELECT * FROM commands where controller = '" + controller + "'";

  try {
    connection = await pool.getConnection();
    const [results, fields] = (await connection.query(query)) as [any[], any];
    console.log("fetch device Results: ", results, "fields: ", fields);
    for (const row of results) {
      const command: Command = {
        controller: row.controller,
        code: row.code,
        value: row.value,
        last_updated: row.last_updated,
      };
      commands.push(command);
    }
  } catch (error) {
    console.error("Error fetching devices from database", error);
    throw error;
  } finally {
    if (connection) connection.release();
  }

  return commands;
};

const getByCommandCode = async (controller: string, code: string): Promise<Command | null> => {
  let connection;
  const query = "SELECT * FROM commands where controller = ? and code = ?";
  // execute the query and return the result
  try {
    connection = await pool.getConnection();

    const [results, fields] = (await connection.query(query, [controller, code])) as [any[], any];
    if (results.length > 0) {
      return {
        controller: results[0].controller,
        code: results[0].code,
        value: results[0].value,
        last_updated: results[0].last_updated,
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching devices from database", error);
    throw error;
  } finally {
    if (connection) connection.release();
  }
};

export const saveCommand = async (command: Command) => {
  let connection;
  const query = "INSERT INTO commands (controller, code, value, last_updated) VALUES (?, ?, ?, ?)";
  // execute the query and return the result
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();
    await connection.query(query, [command.controller, command.code, command.value, new Date()]);
    await connection.commit();
  } catch (error) {
    console.error("Error saving commands in database", error);
    throw error;
  } finally {
    if (connection) connection.release();
  }
};

export const updateCommand = async (controller: string, command: any) => {
  let connection;
  const existingCommand = await getByCommandCode(controller, command.code);
  if (!existingCommand) {
    throw new Error("Command not found with code " + command.code);
  }
  const updateQuery = "UPDATE commands SET value = ?, last_updated = ? WHERE code = ? and controller = ?";
  const currentDateTime = new Date();
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();
    await connection.query(updateQuery, [command.value, currentDateTime, command.code, controller]);
    await connection.commit();
  } catch (error) {
    console.error("Error updating commands in database", error);
    connection?.rollback();
    throw error;
  } finally {
    if (connection) connection.release();
  }
};
