export interface StatisticMonth {
    month?: number,
    date?: string,
    time?: string,
    money: number,
}

export interface StatisticMonthResponse {
    code: number;
    result: StatisticMonth[];
}

export interface StatisticParams {
    month: number;
    year: number;
}