import { StatisticMonth } from "../lib/schemas/statistic.schema";

export const formatStatisticDataByYear = (
        year: number,
        data: StatisticMonth[]
    ): Record<number, StatisticMonth[]> => {
        const filledData: StatisticMonth[] = [];
  
    for (let i = 1; i <= 12; i++) {
        const found = data.find(item => item.month === i);
        filledData.push({
            month: i,
            money: found ? found.money : 0,
        });
    }
  
    return {
        [year]: filledData,
    };
};
