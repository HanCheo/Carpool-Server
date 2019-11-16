import cors from "cors";
import { NextFunction, Response } from "express";
import { GraphQLServer, PubSub } from "graphql-yoga";
import helmet from "helmet";
import logger from "morgan";
import schema from "./schema";
import decodeJWT from "./utils/documentJWT";

class App {
  public app: GraphQLServer;
  public pubSub: any;
  constructor() {
    //데모버전
    this.pubSub = new PubSub();
    //REDIES, MEMCACHED
    this.pubSub.ee.setMaxListeners(99);
    this.app = new GraphQLServer({
      schema,
      context: req => {
        const { connection: { context = null } = {} } = req;
        return {
          req: req.request,
          pubSub: this.pubSub,
          context
        };
      }
    });
    this.middewares();
  }
  private middewares = (): void => {
    this.app.express.use(cors());
    this.app.express.use(logger("dev"));
    this.app.express.use(helmet());
    //커스텀 미들웨어
    this.app.express.use(this.jwt);
  };

  //jwt MiddleWare = request를 확인하고
  //이에따른 response이 있으면 response전송
  //request가 아무것도 갖고 있지 않으면
  //next 미들웨어를 실행
  private jwt = async (
    req,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    //token은 headers부분에 있기 때문에 req에서 get을 해줌.
    // "X-JWT"는 token 부분을 칭할 변수명
    const token = req.get("X-JWT");
    //token 안에 있는 id(createJWT.ts)를 찾고 해당아이디를 가진 user를 찾음.
    if (token) {
      const user = await decodeJWT(token);
      if (user) {
        req.user = user;
      } else {
        req.user = undefined;
      }
    }
    next();
  };
}

export default new App().app;
