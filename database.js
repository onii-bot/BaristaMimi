import { MongoClient } from "mongodb";
import axios from "axios";

const MONGO_TOKEN = process.env.MONGO_TOKEN;

const client = new MongoClient(MONGO_TOKEN);

async function dbConnection() {
  let result = await client.connect();
  let db = result.db("discord");
  return db.collection("ethos_xp_data");
}


export async function getUsers() {
  try {
    let connec = await dbConnection();
    let result = await connec.find({ _id: "userlist" }).toArray();
    console.log(typeof result[0].users);
  } catch {
    (err) => {
      console.log("e");
    };
  }
}

export async function isNewUser(user_id) {
  try {
    let connec = await dbConnection();
    let result = await connec.find({ _id: "userlist" }).toArray();
    let user_list = result[0].users;
    if (!user_list.includes(user_id)) {
      return true;
    } else {
      return false;
    }
  } catch {
    (err) => {
      console.log("e");
      return false;
    };
  }
}

export async function addUser(user_id) {
  try {
    let connec = await dbConnection();
    let result = await connec.find({ _id: "userlist" }).toArray();
    let user_list = result[0].users;
    if (!user_list.includes(user_id)) {
      console.log("good");
      user_list.push(user_id);
      let d = await connec.updateOne(
        { _id: "userlist" },
        { $set: { users: user_list } }
      );
      return true;
    } else {
      return false;
    }
  } catch {
    (err) => {
      console.log("e");
      return false;
    };
  }
}

export async function xpGiver(userId, xp) {
  const word = `!give-xp <@${userId}> ${xp}`;
  const channelId = "1046331887964143667";
  const url = `https://discord.com/api/v9/channels/${channelId}/messages`;
  const payload = {
    content: word,
  };
  const headers = {
    authorization: process.env.ICHIGO_TOKEN,
  };
  await axios.post(url, payload, { headers });
}

export async function timeCheck() {
  const timeUnix = Math.floor(Date.now() / 1000);
  let connec = await dbConnection();
  let result = await connec.find({ _id: "target" }).toArray()
  let target = result[0].time
  if (timeUnix > target) {
      console.log("it's time");
      await newDay();
  }
}

export async function newDay(){
    let connec = await dbConnection();
//     connec.deleteOne({"_id":"target"})
    let timeUnix = Math.floor(Date.now() / 1000);
    console.log(timeUnix)
    let target = timeUnix + 86400
//     connec.insertOne({"_id": "target", "time": target})
    await connec.updateOne(
    { _id: "userlist" },
    { $set: { users: [] } }
    );
    await connec.updateOne(
    { _id: "target" },
    { $set: { "time": target } }
    );
}

