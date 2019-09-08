
import { Resolvers } from "../../../types/resolvers";
import { GetMyPlacesResponse } from "../../../types/graph";
import privateResolver from "../../../utils/privateResolver";
import User from "../../../entities/User";

const resolvers: Resolvers = {
  Query: {
    GetMyPlaces: privateResolver(
      async (_, __, { req }): Promise<GetMyPlacesResponse> => {
        try {
          const user = await User.findOne(
            { id: req.user.id },
            { relations: ["places"] }
          );
          if (user) {
            return {
              ok: true,
              places: user.places,              
              error: null
            };
          } else {
            return {
              ok: false,
              places: null,
              error: "유저를 찾을 수 없습니다."
            };
          }
        } catch (error) {
          return {
            ok: false,
            error: error.maesage,
            places: null
          };
        }
      }
    )
  }
};

export default resolvers;
