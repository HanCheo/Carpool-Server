import dotenv from "dotenv";
dotenv.config();
import { Options } from "graphql-yoga";
import { createConnection } from "typeorm";
import app from "./app";
import connectionOptions from "./ormConfig";
import decodeJWT from "./utils/documentJWT";

const PORT: number | string = process.env.PORT || 4000;
const PLAYGROUND_ENDPOINT: string = "/playground";
const GRAPHQL_ENDPOINT: string = "/graphql";
const SUBSCRIPTION_ENDPOINT: string = "/subscription";

const appOtions: Options = {
  port: PORT,
  playground: PLAYGROUND_ENDPOINT,
  endpoint: GRAPHQL_ENDPOINT,
  subscriptions: {
    path: SUBSCRIPTION_ENDPOINT,
    onConnect: async connectionParams => {
      const token = connectionParams["X-JWT"];
      if (token) {
        const user = await decodeJWT(token);
        if (user) {
          return {
            currentUser: user
          };
        }
      }
      throw new Error("JWT가 없어 접속이 불가능합니다.")
    }
  }
};

const handleAppStart = () => console.log(`포트번호 ${PORT} /playground`);

createConnection(connectionOptions)
  .then(() => {
    app.start(appOtions, handleAppStart);
  })
  .catch(error => console.log(error));