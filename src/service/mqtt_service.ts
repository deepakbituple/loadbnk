import mqtt from "mqtt";
import * as ControllerService from "../service/controller_service";
import { getEnv } from "../utils/common";
import { io } from "../";
const projectName = getEnv("PROJECT_NAME");
const mqttHost = getEnv("MQTT_HOST");
const mqttPort = getEnv("MQTT_PORT", "1883");
const mqttClientId = getEnv("MQTT_CLIENT_ID", `nodejs_loadbank`);
import * as deviceLogsService from "../service/device_logs_service";
import { writeDeviceLogs } from "./device_logs_influxdb";

const getSubscriptionTopics = async () => {
  subscriptionList = [];
  const controllers = await ControllerService.get();
  for (const controller of controllers) {
    const controllerId = controller.controller_id;
    subscriptionList.push(`${projectName}/${controllerId}/status`);
  }
};

let mqttClient: any;
const connectUrl = `mqtt://${mqttHost}:${mqttPort}`;
let subscriptionList: string[] = [];

const startMQTTClient = async () => {
  console.log(`Connecting to MQTT broker ${connectUrl}`);
  mqttClient = await mqtt.connect(connectUrl, {
    clientId: mqttClientId,
    clean: true,
    connectTimeout: 10000,
    reconnectPeriod: 10000,
  });

  mqttClient.on("connect", async () => {
    console.log("Connected to MQTT broker at ", connectUrl);
    // fetch all the topics to subscribe
    await getSubscriptionTopics();
    if (subscriptionList.length === 0) {
      console.log("In MQTT on connect, No topics to subscribe. Check Database");
      return;
    }
    mqttClient.subscribe(subscriptionList, () => {
      console.log(`Subscribe to topic '${subscriptionList}'`);
    });
  });

  mqttClient.on("message", async (topic: string, payload: any) => {
    console.log("Received Message: onmessage", topic, payload.toString());
    if (subscriptionList.includes(topic)) {
      const data = JSON.parse(payload.toString());
      const controllerId = topic.split("/")[1];
      const values = data.values;
      const controller = await ControllerService.updateDeviceStatus(controllerId, values);
      console.log("Updated controller in on message", controller);
      io.emit("controller", controller);
      //   deviceLogsService.create(controllerId, values);
      writeDeviceLogs(controllerId, values);
    }
  });

  mqttClient.on("error", (error: any) => {
    console.error("Error:", error);
  });

  mqttClient.on("close", () => {
    console.log("Connection closed");
  });

  mqttClient.on("offline", () => {
    console.log("Client offline");
  });

  mqttClient.on("reconnect", () => {
    console.log("Reconnecting...");
  });

  mqttClient.on("disconnect", () => {
    console.log("Disconnecting...");
  });

  mqttClient.on("end", () => {
    console.log("End");
  });
};

const disconnect = () => {
  console.log("Disconnecting MQTT client");
  mqttClient.end();
};

const reconnect = () => {
  console.log("Reconnecting MQTT client");
  mqttClient.reconnect();
};

const publishMessage = async (controller_id: string, device_id: string, value: string) => {
  const topic = `${projectName}/${controller_id}/${device_id}`;
  const message = value;
  console.log("Publishing message", topic, message);
  mqttClient.publish(topic, message, { qos: 2 }, (err: any) => {
    if (err) {
      console.error("Error publishing message", err);
    }
  });
};

const getMQTTStatus = () => {
  return mqttClient.connected;
};

export { startMQTTClient, disconnect, reconnect, publishMessage, getMQTTStatus };
