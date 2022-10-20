import { WhereOptions, Op } from "sequelize";

/**
 * @param searchOptions and로 검색할 요소들을 한개의 object로 묶어서 전달.
 * @example searchOptions = {examScheduleId: 28, examType: 화공직 ...etc }
 */
export const whereAndOptions = (searchOptions: object): WhereOptions => {
  const whereOptions: WhereOptions = [];

  Object.entries(searchOptions).map(([key, value]) => {
    whereOptions.push({
      [key]: {
        [Op.and]: {
          [Op.eq]: value,
        },
      },
    });
  });

  return whereOptions;
};
