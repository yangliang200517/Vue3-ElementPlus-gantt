import dayjs from 'dayjs';

// 扩展给定的日期范围(需求需要)
export const extendDateRange = (startDateStr, endDateStr) => {
    const startDate = dayjs(startDateStr);
    const endDate = dayjs(endDateStr);

    // 获取开始日期的年份
    const startYear = startDate.year();
    // 获取结束日期的年份
    const endYear = endDate.year();

    // 扩展后的开始日期：开始年份的第一天
    const extendedStartDate = dayjs(`${startYear}-01-01`);

    // 扩展后的结束日期：结束年份的最后一天
    const extendedEndDate = dayjs(`${endYear}-12-31`);

    return {
        start_date: extendedStartDate.format('YYYY-MM-DD'),
        end_date: extendedEndDate.format('YYYY-MM-DD')
    };
}
