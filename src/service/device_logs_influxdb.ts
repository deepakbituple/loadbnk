import { InfluxDB, Point } from "@influxdata/influxdb-client";

const token = process.env.INFLUXDB_TOKEN;
// const url = "http://192.168.68.62:8086";
const url = process.env.INFLUXDB_URL || "";

const client = new InfluxDB({ url, token });

let org = "ITUPLE";
let bucket = "loadbnk";
let writeClient = client.getWriteApi(org, bucket);
export const writeDeviceLogs = (controllerId: string, values: any) => {
  try {
    // console.log("Writing device logs influxdb", controllerId, values);
    let point = new Point("device_logs")
      .tag("controller_id", controllerId)
      .stringField("OP1", values["OP1"])
      .stringField("OP2", values["OP2"])
      .stringField("OP3", values["OP3"])
      .stringField("OP4", values["OP4"])
      .stringField("OP5", values["OP5"])
      .stringField("OP6", values["OP6"])
      .stringField("OP7", values["OP7"])
      .stringField("OP8", values["OP8"])
      .stringField("OP9", values["OP9"])

      .floatField("v", values["v"])
      .timestamp(new Date());

    writeClient.writePoint(point);
    writeClient.flush();
  } catch (error) {
    console.error("Error writing device logs in influxdb", error);
    throw error;
  }
};

// for (let i = 0; i < 5; i++) {
//   let point = new Point('measurement1')
//     .tag('tagname1', 'tagvalue1')
//     .intField('field1', i)

//   void setTimeout(() => {
//     writeClient.writePoint(point)
//   }, i * 1000) // separate points by 1 second

//   void setTimeout(() => {
//     writeClient.flush()
//   }, 5000)
// }
