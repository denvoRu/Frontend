
// get current format 'dd.mm-dd.mm'
export function getCurrentWeek() {
  const today = new Date();
  const firstDayOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 1);
  const lastDayOfWeek = new Date(firstDayOfWeek);
  lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6);

  return [firstDayOfWeek, lastDayOfWeek];
}

// shift week
export function shiftWeek([startDate, endDate]:Date[], weeksToShift: number) {
  const shiftedStartDate = new Date(startDate);
  const shiftedEndDate = new Date(endDate);

  shiftedStartDate.setDate(shiftedStartDate.getDate() + weeksToShift * 7);
  shiftedEndDate.setDate(shiftedEndDate.getDate() + weeksToShift * 7);

  return [shiftedStartDate, shiftedEndDate];
}

// from [yyyy-mm-dd, yyyy-mm-dd] to 'dd.mm-dd.mm'
export function formatWeekAsString([startDate, endDate]:Date[]) {
  return `${formatDate(startDate)}-${formatDate(endDate)}`;
}

// from Date to 'dd.mm'
export function formatDate(date:Date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}.${month}`;
}
// from Date to yyyy-mm-dd
export function formatDateUTC(date: Date) {
  const year = date.getFullYear();
  let month = String(date.getMonth() + 1);
  month = month.length === 1 ? "0" + month : month
  let day = String(date.getDate());
  day = day.length === 1 ? "0" + day : day
  return `${year}-${month}-${day}`;
}

// get week number from Date
export function getWeekNumber(firstDayOfWeek:Date) {
  const firstDayOfYear = new Date(firstDayOfWeek.getFullYear(), 0, 1);
  const pastDays = Math.floor((firstDayOfWeek.getTime() - firstDayOfYear.getTime()) / (24 * 60 * 60 * 1000));
  const weekNumber = Math.ceil((pastDays + firstDayOfYear.getDay()) / 7);
  return weekNumber;
}
//from [yyyy-mm-dd, yyyy-mm-dd] to 'dd.mm' array 
export function createDateArrayFromRange([startDate, endDate]:Date[]) {
  const dates = [];
  for (
      let date = new Date(startDate);
      date <= endDate;
      date.setDate(date.getDate() + 1)
  ) {
      dates.push(formatDate(date));
  }
  return dates;
}

// from [Date, Date] to yyyy-mm-dd[]
export function generateDateStrings([startDate, endDate]:Date[]) {
  const result = [];
  for (
      let date = new Date(startDate);
      date <= endDate;
      date.setDate(date.getDate() + 1)
  ) {
      result.push(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`);
  }
  return result;
}

// from yyyy-mm-dd то dd.mm
export function getWeekDayAndDate(dateStr: string): string {
  const [, month, day] = dateStr.split('-');
  return `${day}.${month}`;
}

// from 'dd.mm' to yyyy-mm-dd
export function getBackDate(date: string) {
  const [day, month] = date.split('.')
  return `${'2025'}-${month}-${day}`
}

//from yyyy-mm-dd to ['day month', weekDay]
export function getDayAndWeekday(dateString: string) {
  const daysOfWeek = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
  const months = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
  
  const date = new Date(dateString);
  const day = date.getDate();
  const monthIndex = date.getMonth();
  const weekdayIndex = date.getDay();
  
  return [day + " " + months[monthIndex], daysOfWeek[weekdayIndex]];
}
//from date input get weekDayNumber
export function getDayOfWeek(dateString: string) {
  const date = new Date(dateString);
  let day = date.getDay();
  if (day === 0) {
      day = 6;
  } else {
      day--;
  }
  return day;
}