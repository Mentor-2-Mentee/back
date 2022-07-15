import { Sequelize, WhereOptions, Op } from "sequelize";

enum DataTypesEnum {
  JSON = "JSON",
  string = "string",
}

type DataType = keyof typeof DataTypesEnum;

export const generateLiveRoomWhereOption = (
  searchTarget: string,
  column: string,
  DataType: DataType
): any => {
  switch (DataType) {
    case "JSON":
      return Sequelize.where(
        Sequelize.fn("JSON_SEARCH", Sequelize.col(column), "all", searchTarget),
        {
          [Op.ne]: null,
        }
      );

    case "string":
      return {
        [column]: {
          [Op.like]: `%${searchTarget}%`,
        },
      };

    default:
      return {
        [column]: {
          [Op.like]: `%${searchTarget}%`,
        },
      };
  }
};
