import { httpCollection } from "../http";


export default {
    getAllDoctors: async function (params) {
      let  data  = await httpCollection.postData("all_doctors",params);
      return data;
    },
    
    getPopulorDoctorsId: async function () {
      let  data  = await httpCollection.getData("populor_doctors_id");
      return data;
    },
  
  };