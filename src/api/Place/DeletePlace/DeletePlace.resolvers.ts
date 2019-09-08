import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";
import {
  DeletePlaceMutationArgs,
  DeletePlaceResponse
} from "../../../types/graph";
import Place from "../../../entities/Place";
import User from "../../../entities/User";

const resolvers: Resolvers = {
  Mutation: {
    DeletePlace: privateResolver(
      async (
        _,
        args: DeletePlaceMutationArgs,
        { req }
      ): Promise<DeletePlaceResponse> => {
        const user: User = req.user;
        try {
          const place = await Place.findOne({ id: args.placeId });
          if (place) {
            if (place.userId === user.id) {
              place.remove();
              return {
                ok: true,
                error: null
              };
            } else {
              return {
                ok: false,
                error: "권한이 없습니다."
              };
            }
          } else {
            return {
              ok: false,
              error: "해당 장소를 찾을 수 없습니다."
            };
          }
        } catch (error) {
          return {
            ok: false,
            error: null
          };
        }
      }
    )
  }
};

export default resolvers;
