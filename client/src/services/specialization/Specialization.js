import { httpCollection } from "../http";


export default {
    getAllSpecializations: async function () {
      let  data  = await httpCollection.getData("get_all_specialization");
      return data;
    },
  
  };