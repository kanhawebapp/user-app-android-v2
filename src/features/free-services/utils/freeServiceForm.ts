export type BirthFormValues = {
  date: string;
  time: string;
};

export const getInitialBirthValues = (): BirthFormValues => {
  const now = new Date();
  let hour12 = now.getHours();
  const meridiem = hour12 >= 12 ? 'PM' : 'AM';
  if (hour12 === 0) {
    hour12 = 12;
  } else if (hour12 > 12) {
    hour12 -= 12;
  }

  return {
    date: `${String(now.getDate()).padStart(2, '0')}/${String(
      now.getMonth() + 1,
    ).padStart(2, '0')}/${now.getFullYear()}`,
    time: `${String(hour12).padStart(2, '0')}:${String(
      now.getMinutes(),
    ).padStart(2, '0')} ${meridiem}`,
  };
};

export const buildBirthPayload = (
  values: BirthFormValues,
  lat: number,
  lon: number,
  tzone: number,
  address = '',
) => {
  const [day, month, year] = values.date.split('/');
  const [timePart, meridiem] = values.time.split(' ');
  const [hour24, min] = timePart.split(':');

  let hour = Number(hour24);
  if (meridiem === 'PM' && hour !== 12) {
    hour += 12;
  }
  if (meridiem === 'AM' && hour === 12) {
    hour = 0;
  }

  return {
    day: Number(day),
    month: Number(month),
    year: Number(year),
    hour,
    min: Number(min),
    lat,
    lon,
    tzone,
    address,
  };
};
