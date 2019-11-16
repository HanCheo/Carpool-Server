import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";
import User from "../../../entities/User";
import Chat from "../../../entities/Chat";
import Message from "../../../entities/Message";
import {
  SendChatMessageMutationArgs,
  SendChatMessageResponse
} from "../../../types/graph";

const resolvers: Resolvers = {
  Mutation: {
    SendChatMessage: privateResolver(
      async (
        _,
        args: SendChatMessageMutationArgs,
        { req, pubSub }
      ): Promise<SendChatMessageResponse> => {
        const user: User = req.user;
        try {
          const chat = await Chat.findOne({ id: args.chatId });
          if (chat) {
            if (chat.passengerId === user.id || chat.driverId === user.id) {
              const message = await Message.create({
                text: args.text,
                chat,
                user
              }).save();
              console.log("message", message);
              pubSub.publish("newChatMessage", {
                MessageSubscription: message
              });
              return {
                ok: true,
                error: null,
                message
              };
            } else {
              return {
                ok: false,
                error: "권한이 없습니다.",
                message: null
              };
            }
          } else {
            return {
              ok: false,
              error: "채팅을 찾을 수 없습니다.",
              message: null
            };
          }
        } catch (error) {
          return {
            ok: false,
            error: error.message,
            message: null
          };
        }
      }
    )
  }
};
export default resolvers;
