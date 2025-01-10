
// Функция для получения текущей недели в формате 'dd.mm-dd.mm'
export function getCurrentWeek() {
  const today = new Date();
  const firstDayOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 1);
  const lastDayOfWeek = new Date(firstDayOfWeek);
  lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6);

  return [firstDayOfWeek, lastDayOfWeek];
}

// Функция для сдвига недели вперед или назад
export function shiftWeek([startDate, endDate]:Date[], weeksToShift: number) {
  const shiftedStartDate = new Date(startDate);
  const shiftedEndDate = new Date(endDate);

  shiftedStartDate.setDate(shiftedStartDate.getDate() + weeksToShift * 7);
  shiftedEndDate.setDate(shiftedEndDate.getDate() + weeksToShift * 7);

  return [shiftedStartDate, shiftedEndDate];
}

// Функция для преобразования двух дат в строку формата 'dd.mm-dd.mm'
export function formatWeekAsString([startDate, endDate]:Date[]) {
  return `${formatDate(startDate)}-${formatDate(endDate)}`;
}

// Вспомогательная функция для форматирования одной даты в формат 'dd.mm'
export function formatDate(date:Date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}.${month}`;
}

export function formatDateUTC(date: Date) {
  const year = date.getFullYear();
  let month = String(date.getMonth() + 1);
  month = month.length === 1 ? "0" + month : month
  let day = String(date.getDate());
  day = day.length === 1 ? "0" + day : day
  return `${year}-${month}-${day}`;
}

export function getWeekNumber(firstDayOfWeek:Date) {
  const firstDayOfYear = new Date(firstDayOfWeek.getFullYear(), 0, 1);
  const pastDays = Math.floor((firstDayOfWeek.getTime() - firstDayOfYear.getTime()) / (24 * 60 * 60 * 1000));
  const weekNumber = Math.ceil((pastDays + firstDayOfYear.getDay()) / 7);
  return weekNumber;
}
// Функция получения массива дат в формате 'dd.mm'
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

export function getWeekDayAndDate(dateStr: string): string {
  const [, month, day] = dateStr.split('-');
  return `${day}.${month}`;
}

export function getBackDate(date: string) {
  const [day, month] = date.split('.')
  return `${'2025'}-${month}-${day}`
}