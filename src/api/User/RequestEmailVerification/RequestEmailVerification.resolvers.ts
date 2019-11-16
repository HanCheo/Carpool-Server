import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";
import User from "../../../entities/User";
import Verification from "../../../entities/Verification";
import { sendVerificationEmail } from "../../../utils/sendEmail";

const resolver: Resolvers = {
  Mutation: {
    RequestEmailVerification: privateResolver(async (_, __, { req }) => {
      const user: User = req.user;
      if (user.email && !user.verifiedEmail) {
        try {
          const oldVerification = await Verification.findOne({
            payload: user.email
          });
          if (oldVerification) {
            oldVerification.remove();
          }
          const newVerification = await Verification.create({
            payload: user.email,
            target: "EMAIL"
          }).save();
          await sendVerificationEmail(
            user.email,
            user.fullName,
            newVerification.key
          );
          return {
            ok: true,
            error: null
          };
        } catch (error) {
          return {
            ok: false,
            error: error.message
          };
        }
      } else {
        return {
          ok: false,
          error: "이미 인증된 메일입니다. 로그인 해주세요."
        };
      }
    })
  }
};

export default resolver;
