import Device from "../model/device";
import pool from "./db";

async function createDevice(device: Device): Promise<boolean> {
  let connection;
  const query = "INSERT INTO device (device, type, state, last_seen, controller) VALUES (?, ?, ?, ?, ?)";
  // execute the query and return the result
  try {
    connection = await pool.getConnection();
    const [results, fields] = (await connection.query(query, [
      device.device,
      device.type,
      device.state,
      new Date(),
      device.controller,
    ])) as [any[], any];
    console.log("create device Results: ", results, "fields: ", fields);
    return true;
  } catch (error) {
    console.error("Error creating device in database", error);
    throw error;
  } finally {
    if (connection) connection.release();
  }
}

async function getDevices(controller: string): Promise<Device[]> {
  const devices: Device[] = [];
  let connection;
  const query = "SELECT * FROM device where controller = '" + controller + "'";
  // execute the query and return the result
  try {
    connection = await pool.getConnection();
    const [results, fields] = (await connection.query(query)) as [any[], any];
    console.log("fetch device Results: ", results, "fields: ", fields);
    for (const row of results) {
      const device: Device = {
        controller: row.controller,
        device: row.device,
        type: row.type,
        state: row.state,
        last_seen: row.last_seen,
      };
      devices.push(device);
    }
  } catch (error) {
    console.error("Error fetching devices from database", error);
    throw error;
  } finally {
    if (connection) connection.release();
  }

  return devices;
}

async function updateDevices(controller: string, deviceInput: any[]) {
  console.log("Updating device status for controller: ", controller, deviceInput);
  let connection: any;
  const updateQuery = "UPDATE device SET state = ?, last_seen = ? WHERE device = ? and controller = ?";
  const currentDateTime = new Date();
  let changedRows = 0;
  try {
    connection = await pool.getConnection();
    connection.beginTransaction();
    await deviceInput.forEach(async (deviceIn: any) => {
      const [results, fields] = await connection.query(updateQuery, [
        deviceIn.state,
        currentDateTime,
        deviceIn.device,
        controller,
      ]);
      console.log("Device ", deviceIn.device, " updated successfully", results);
      changedRows += results.changedRows;
    });

    connection.commit();
    console.log("Total devices updated: ", changedRows);
  } catch (error) {
    if (connection) connection.rollback();
    changedRows = 0;
    console.error("Error updating devices in  database", error);
    throw error;
  } finally {
    if (connection) connection.release();
  }
  return changedRows;
}

// async function createDevice(device: Device) {
//   return await createNewDevice(device);
// }

export { getDevices, updateDevices, createDevice };
