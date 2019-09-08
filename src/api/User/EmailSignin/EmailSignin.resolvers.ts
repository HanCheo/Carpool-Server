import { Resolvers } from "src/types/resolvers";
import { EmailSignInMutationArgs, EmailSignInResponse } from "src/types/graph";
import User from "../../../entities/User";
import createJWT from "../../../utils/createJWT"

const resolvers: Resolvers = {
  Mutation: {
    EmailSignIn: async (
      _,
      args: EmailSignInMutationArgs
    ): Promise<EmailSignInResponse> => {
      const { email, password } = args;
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return {
            ok: false,
            error: "해당 이메일을 가진 사용자가 없습니다.",
            token: null
          };
        }
        const checkPassword = await user.comparePassword(password);
        const token = createJWT(user.id)
        if(checkPassword){
            return {
                ok: true,
                error: null,
                token
            }
        }
        else {
            return {
                ok: false,
                error: "패스워드가 잘못되었습니다.",
                token: null
            }
        }
      } catch (error) {
        return {
          ok: false,
          error: error.message,
          token: null
        };
      }
    }
  }
};

export default resolvers;
