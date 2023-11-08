import { firebaseAuth } from './firebase';
import { ToastId, createStandaloneToast } from '@chakra-ui/react';
import { isArray } from 'lodash';
import { DateTime, IANAZone } from 'luxon';
import moment, { Duration, Moment } from 'moment-timezone';

const { toast } = createStandaloneToast();

declare global {
  interface Window {
    networkErrorToast: ToastId;
  }
}

export const classNames = (...classes: any[]) => {
  return classes.filter(Boolean).join(' ');
};

export const ServiceFeePercentage = 0.05;

export const MinPasswordLength = 8;

export const getOptionValue = (
  opts: Array<{ value: any; label: any }>,
  val: any
) => {
  if (isArray(val)) {
    return opts.filter((o) => val.includes(o.value));
  }
  return opts.find((o) => o.value === val);
};

export const doFetch = async (
  input: RequestInfo,
  init?: RequestInit,
  showErrorMessage = false,
  initHeaders = {}
) => {
  const headers: HeadersInit = { ...initHeaders };

  const token = await firebaseAuth.currentUser?.getIdToken();
  headers['x-shepherd-header'] = 'vunderkind23';

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(input, { ...init, headers });

  if (!response.ok && showErrorMessage) {
    if (window.networkErrorToast) {
      toast.close(window.networkErrorToast);
    }
    window.networkErrorToast = toast({
      title: 'An error occurred.',
      status: 'error',
      position: 'top',
      isClosable: true
    });
    throw response;
  }

  return response;
};
export const educationLevelOptions = [
  {
    label: 'Primary School Certificate',
    value: 'primary-school-cert'
  },
  {
    label: 'Junior Secondary School Certificate',
    value: 'junior-secondary-school-cert'
  },
  {
    label: 'Senior Secondary School Certificate',
    value: 'senior-secondary-school-cert'
  },
  {
    label: 'National Diploma (ND)',
    value: 'national-diploma'
  },
  {
    label: 'Higher National Diploma (HND)',
    value: 'higher-national-diploma'
  },
  {
    label: "Bachelor's Degree (BSc, BA, BEng, etc.)",
    value: 'bachelors-degree'
  },
  {
    label: "Master's Degree (MSc, MA, MEng, etc.)",
    value: 'masters-degree'
  },
  {
    label: 'Doctoral Degree (PhD, MD, etc.)',
    value: 'doctoral-degree'
  },
  {
    label: 'Vocational/Technical Certificate',
    value: 'vocation-technical-cert'
  }
];
interface Schedule {
  [day: string]: {
    begin: string;
    end: string;
  };
}

export const convertTimeToUTC = (time: string, tzIdentifier: string) => {
  // Parse the input time string
  const parsedTime = moment.tz(time, 'hh:mm A', tzIdentifier);

  // Convert the parsed time to UTC+0 with the same format
  const utcTime = parsedTime.utc().format('hh:mm A');

  return utcTime;
};

export const convertScheduleToUTC = (schedule: Schedule) => {
  const tzIdentifier = moment.tz.guess();
  const utcSchedule = {};

  for (const day in schedule) {
    if (schedule[day]) {
      const beginTime = schedule[day].begin;
      const endTime = schedule[day].end;

      const beginUTC = convertTimeToUTC(beginTime, tzIdentifier);
      const endUTC = convertTimeToUTC(endTime, tzIdentifier);

      utcSchedule[day] = {
        begin: beginUTC,
        end: endUTC
      };
    }
  }

  return utcSchedule;
};

export const numberToDayOfWeekName = (num: number, format = 'dddd') => {
  // Use the adjusted number to get the day of the week's name
  // 0 for Sunday, 1 for Monday and so on...
  return moment().day(num).format(format);
};
export const DayOfWeekNameToNumber = (num: number, format = 'dddd') =>
  moment().day(num).format(format);

export const convertUtcToUserTime = (utcTime) => {
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Parse the UTC time string using Moment.js
  const utcMoment = moment.utc(utcTime);

  // Convert the UTC time to the user's timezone
  const userMoment = utcMoment.tz(userTimezone);

  // Format the user's time in a desired format
  return userMoment.format('h:mm A');
};

export const convertTimeToDateTime = (time) => {
  const currentDate = new Date();

  // Regular expression to match different time formats
  const timeRegex =
    /^(\d{1,2}|0\d{1,2})(?::(\d{2}))?(?:\s)?(AM|PM)$|^(\d{1,2}|0\d{1,2})(AM|PM)$/i;
  const matches = time.match(timeRegex);

  if (!matches) {
    return null; // Invalid time format
  }

  let hours = parseInt(matches[1], 10);
  const minutes = parseInt(matches[2] || 0, 10);
  const ampm = (matches[3] || '').toLowerCase();

  if (ampm === 'pm' && hours !== 12) {
    hours += 12;
  } else if (ampm === 'am' && hours === 12) {
    hours = 0;
  }

  currentDate.setHours(hours);
  currentDate.setMinutes(minutes);
  currentDate.setSeconds(0);
  currentDate.setMilliseconds(0);

  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  const hours24 = String(currentDate.getHours()).padStart(2, '0');
  const minutesStr = String(currentDate.getMinutes()).padStart(2, '0');
  const seconds = '00';
  return `${year}-${month}-${day} ${hours24}:${minutesStr}:${seconds}`;
};

// Function to convert time from one timezone to another and format it as "5PM"
export const convertTimeToTimeZone = (inputTime, inputTimeZone) => {
  // Define an array of possible date/time formats
  const inputFormats = ['YYYY-MM-DDTHH:mm:ss.SSSZ', 'YYYY-MM-DD HH:mm:ss'];

  // Attempt to parse the input time using different formats
  const inputMoment = moment.tz(inputTime, inputFormats, inputTimeZone);

  if (!inputMoment.isValid()) {
    return 'Invalid input time format';
  }

  // Convert to the output timezone
  const outputMoment = inputMoment.clone().tz(moment.tz.guess());

  // Format the result as "5PM"
  const formattedTime = outputMoment.format('h:mmA');

  return formattedTime;
};

export const convertISOToCustomFormat = (isoString) => {
  const date = new Date(isoString);

  // Get date components
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');

  // Get time components
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');

  // Create the custom format
  const customFormat = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  return customFormat;
};

// // Example usage:
// const inputTime1 = '2023-10-03T09:30:00.000Z'; // ISO format
// const inputTime2 = '2023-10-03 09:30:00'; // Custom format
// const inputTime3 = '9AM'; // Custom format
// const inputTimeZone = 'America/New_York'; // Input timezone
// const outputTimeZone = 'Europe/London'; // Output timezone

// const formattedTime1 = convertTimeToTimeZone(
//   convertISOToCustomFormat(inputTime1),
//   inputTimeZone
// );
// const formattedTime2 = convertTimeToTimeZone(inputTime2, inputTimeZone);
// const formattedTime3 = convertTimeToTimeZone(
//   convertTimeToDateTime(inputTime3),
//   inputTimeZone
// );
// console.log(`Formatted time 1: ${formattedTime1}`);
// console.log(`Formatted time 2: ${formattedTime2}`);
// console.log(`Formatted time 3: ${formattedTime3}`);

export const isSameDay = (date1, date2) => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

export const isSameWeek = (date1, date2) => {
  const oneDay = 24 * 60 * 60 * 1000;
  const diff = Math.round(Math.abs((date1 - date2) / oneDay));
  return diff <= 6 && date1.getDay() >= date2.getDay();
};

export const isSameMonth = (date1, date2) => {
  return (
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

export const leadingZero = (num: number) => `0${num}`.slice(-2);

export const roundDate = (
  date: Date | Moment,
  duration: Duration,
  method: 'ceil'
) => {
  return moment(Math[method](+date / +duration) * +duration);
};
export const twoDigitFormat = (d: number) => {
  return d < 10 ? '0' + d.toString() : d.toString();
};

export const textTruncate = function (
  str: string,
  length: number,
  ending?: any
) {
  if (length == null) {
    length = 100;
  }
  if (ending == null) {
    ending = '...';
  }
  if (str.length > length) {
    return str.substring(0, length - ending.length) + ending;
  } else {
    return str;
  }
};

export const getCroppedImg = (
  imageSrc: string,
  crop: { x: number; y: number; width: number; height: number }
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const image = new Image();

    image.onload = () => {
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      const ctx = canvas.getContext('2d');

      canvas.width = crop.width;
      canvas.height = crop.height;

      ctx?.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );

      const base64data = canvas?.toDataURL('image/jpeg', 1);
      resolve(base64data);
    };

    image.onerror = reject;
    image.src = imageSrc;
  });
};
