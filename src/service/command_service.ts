import Command from "../model/command";
import * as MQTTService from "../service/mqtt_service";
export const getCommands = async (controller: string): Promise<Command[]> => {
  const commands = await Command.find({ controller: controller }).lean();
  return commands;
};

export const createCommand = async (command: Command): Promise<boolean> => {
  try {
    await Command.create(command);
    return true;
  } catch (error) {
    console.error("Error creating command in database", error);
    throw error;
  }
};

export const createMultipleCommands = async (commands: Command[]): Promise<boolean> => {
  try {
    await Command.insertMany(commands);
    return true;
  } catch (error) {
    console.error("Error creating command in database", error);
    throw error;
  }
};

export const saveCommand = async (controller_id: string, device_id: string, value: string): Promise<boolean> => {
  let command = await Command.findOne({ controller_id, device_id });
  if (command) {
    command.value = value;
    command.last_updated = new Date();
    await command.save();
  } else {
    command = new Command({ controller_id, device_id, value: value });
    await Command.create(command);
  }

  MQTTService.publishMessage(controller_id, device_id, value);

  return true;
};

// export const getCommands = async (controller: string): Promise<Command[]> => {
//   const commands: Command[] = [];
//   let connection;
//   const query = "SELECT * FROM commands where controller = '" + controller + "'";

//   try {
//     connection = await dbpool.getConnection();
//     const [results, fields] = (await connection.query(query)) as [any[], any];
//     console.log("fetch command Results: ", results, "fields: ", fields);
//     for (const row of results) {
//       const command: Command = {
//         controller: row.controller,
//         code: row.code,
//         value: row.value,
//         last_updated: row.last_updated,
//       };
//       commands.push(command);
//     }
//   } catch (error) {
//     console.error("Error fetching commands from database", error);
//     throw error;
//   } finally {
//     if (connection) connection.release();
//   }

//   return commands;
// };

// const getByCommandCode = async (controller: string, code: string): Promise<Command | null> => {
//   let connection;
//   const query = "SELECT * FROM commands where controller = ? and code = ?";
//   // execute the query and return the result
//   try {
//     connection = await dbpool.getConnection();

//     const [results, fields] = (await connection.query(query, [controller, code])) as [any[], any];
//     if (results.length > 0) {
//       return {
//         controller: results[0].controller,
//         code: results[0].code,
//         value: results[0].value,
//         last_updated: results[0].last_updated,
//       };
//     }
//     return null;
//   } catch (error) {
//     console.error("Error fetching commands from database", error);
//     throw error;
//   } finally {
//     if (connection) connection.release();
//   }
// };

// export const createCommand = async (command: Command) => {
//   let connection;
//   const query = "INSERT INTO commands (controller, code, value, last_updated) VALUES (?, ?, ?, ?)";
//   // execute the query and return the result
//   try {
//     connection = await dbpool.getConnection();
//     await connection.beginTransaction();
//     await connection.query(query, [command.controller, command.code, command.value, new Date()]);
//     await connection.commit();
//   } catch (error) {
//     console.error("Error saving commands in database", error);
//     throw error;
//   } finally {
//     if (connection) connection.release();
//   }
// };

// export const createMultipleCommands = async (commands: Command[]) => {
//   let connection;
//   const query = "INSERT INTO commands (controller, code, value, last_updated) VALUES ?";
//   // execute the query and return the result
//   try {
//     connection = await dbpool.getConnection();
//     await connection.beginTransaction();
//     const values = commands.map((command) => [command.controller, command.code, command.value, new Date()]);
//     await connection.query(query, [values]);
//     await connection.commit();
//   } catch (error) {
//     console.error("Error saving commands in database", error);
//     throw error;
//   } finally {
//     if (connection) connection.release();
//   }
// };

// export const updateCommand = async (controller: string, command: any) => {
//   let connection;
//   const existingCommand = await getByCommandCode(controller, command.code);
//   if (!existingCommand) {
//     throw new Error("Command not found with code " + command.code);
//   }
//   const updateQuery = "UPDATE commands SET value = ?, last_updated = ? WHERE code = ? and controller = ?";
//   const currentDateTime = new Date();
//   try {
//     connection = await dbpool.getConnection();
//     await connection.beginTransaction();
//     await connection.query(updateQuery, [command.value, currentDateTime, command.code, controller]);
//     await connection.commit();
//   } catch (error) {
//     console.error("Error updating commands in database", error);
//     connection?.rollback();
//     throw error;
//   } finally {
//     if (connection) connection.release();
//   }
// };
