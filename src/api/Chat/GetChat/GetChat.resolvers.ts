import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";
import User from "../../../entities/User";
import Chat from "../../../entities/Chat";

const resolvers: Resolvers = {
  Query: {
    GetChat: privateResolver(async (_, args, { req }) => {
      const user: User = req.user;
      try {
        const chat = await Chat.findOne(
          {
            id: args.chatId
          },
          { relations: ["messages"] }
        );
        if (chat) {
          if (chat.passengerId === user.id || chat.driverId === user.id) {
            return {
              ok: true,
              error: null,
              chat
            };
          } else {
            return {
              ok: false,
              error: "채팅방을 볼 수 있는 권한이 없습니다.",
              chat: null
            };
          }
        } else {
          return {
            ok: false,
            error: "찾을 수 없는 채팅방입니다.",
            chat: null
          };
        }
      } catch (error) {
        return {
          ok: false,
          error: error.message,
          chat: null
        };
      }
    })
  }
};
export default resolvers;
