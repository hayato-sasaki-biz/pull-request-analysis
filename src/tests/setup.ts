import dotenv from "dotenv";
import dayjs from "dayjs";
dotenv.config({ debug: true });
require("dayjs/locale/ja");
dayjs.locale("ja");

global.PropertiesService = {
  // @ts-ignore
  getScriptProperties: () => ({
    getProperty: (key: string) => {
      const property = process.env[key];
      if (property == null) {
        throw new Error(
          `${key} is not set in environment variables. Please set the property to run the tests.`
        );
      }
      return property;
    },
  }),
};

// @ts-ignore
global.Logger = {
  log: (data: any) => {
    console.log(data);
    return null;
  },
};
