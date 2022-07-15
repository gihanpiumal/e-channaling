import { httpCollection } from "../http";

export default {
  getAllUsers: async function () {
    let  data  = await httpCollection.getData("all_users","asasa");
    console.log(data.allUsers);
    return data;
  },

};
