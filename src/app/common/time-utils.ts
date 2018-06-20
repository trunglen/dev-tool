const endDayofMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
export function getEndDateOfMonth(month, year: number) {
    if (year % 4 == 0 && month == 1) {
        return 29
    }
    return endDayofMonth[month - 1]
}