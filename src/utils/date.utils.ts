export function getNextWeekRange() {
  const today = new Date();
  const todayDay = today.getDay();

  // Tính còn mấy ngày nữa sẽ đến thứ 2 đầu tuần
  const daysNeedToMonday = todayDay === 0 ? 1 : 8 - todayDay;

  // Tính ngày thứ 2 của tuần sau
  const nextMonday = new Date(today);
  nextMonday.setDate(today.getDate() + daysNeedToMonday);
  nextMonday.setHours(0, 0, 0, 0);

  // Tính chủ nhật tuần đỏ
  const nextSunday = new Date(nextMonday);
  nextSunday.setDate(nextMonday.getDate() + 6);
  nextSunday.setHours(23, 59, 59, 999);

  return { nextMonday, nextSunday };
}

export function parseDateOnly(date: string): Date {
  const [y, m, d] = date.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}
