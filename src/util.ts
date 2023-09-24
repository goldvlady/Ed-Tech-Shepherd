import { firebaseAuth } from './firebase';
import { ToastId, createStandaloneToast } from '@chakra-ui/react';
import { isArray } from 'lodash';
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
  showErrorMessage = false
) => {
  const headers: HeadersInit = {};

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

export const numberToDayOfWeekName = (num: number, format = 'dddd') =>
  moment().day(num).format(format);
export const DayOfWeekNameToNumber = (num: number, format = 'dddd') =>
  moment().day(num).format(format);

// export const convertTimeToUserTimezone = (time, timezone) => {
//   console.log(time, 'tym', timezone);

//   // Parse the input time as UTC without DST adjustments
//   const uTime = moment(time);

//   // Convert the UTC time to the specified user timezone
//   const userTime = uTime.tz(timezone);

//   console.log(userTime, 'tymu');

//   if (!userTime.isValid()) {
//     // Invalid time, return null or handle the error accordingly
//     return null;
//   }

//   // Format the userTime in 12-hour format with 'h:mm A'
//   const formattedUserTime = userTime.format('hA');
//   console.log(formattedUserTime, 'tymuf');

//   return formattedUserTime;
// };

export const adjustDateTimeByHours = (
  dateTimeString,
  timeDifferenceInHours
) => {
  const originalDate = new Date(dateTimeString);

  const adjustedDate = new Date(
    originalDate.getTime() + (timeDifferenceInHours + 1) * 60 * 60 * 1000
  );

  const adjustedDateTimeString = adjustedDate.toISOString().slice(0, -1); // Remove the 'Z' at the end

  return adjustedDateTimeString;
};

export const calculateTimeDifference = (timeString, sourceTimeZone) => {
  const now = new Date();
  console.log('UR TIMEZONE', moment.tz.guess());

  const newtz: any = new Date(
    now.toLocaleString('en-US', {
      // timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      // timeZone: moment.tz.guess()
      timeZone: 'America/New_York'
    })
  );
  const oldtz: any = new Date(
    now.toLocaleString('en-US', { timeZone: sourceTimeZone })
  );

  const timeDifferenceMillis = newtz - oldtz;

  const timeDifferenceHours = timeDifferenceMillis / (1000 * 60 * 60);

  const adjustedTime = adjustDateTimeByHours(timeString, timeDifferenceHours);
  const date = new Date(adjustedTime);

  let hours = date.getHours();
  let amOrPm = 'AM';

  // Determine AM or PM
  if (hours >= 12) {
    amOrPm = 'PM';
    if (hours > 12) {
      hours -= 12;
    }
  } else if (hours === 0) {
    hours = 12; // 12 AM
  }

  const formattedHours = `${hours}${amOrPm}`;

  return formattedHours;
};

// console.log(
//   `${calculateTimeDifference(
//     '2023-09-23T12:00:00',
//     'America/New_York',
//     'Africa/Lagos'
//   )}`,
//   'yao'
// );

export const convertTimeStringToISOString = (timeString) => {
  // Get the current date
  const currentDate = new Date();

  // Extract the current year, month, and day from the current date
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const day = currentDate.getDate();

  // Extract the hours and AM/PM from the timeString
  const timeParts = timeString.match(/(\d+)(AM|PM)/i);

  if (!timeParts) {
    throw new Error('Invalid timeString format');
  }

  let hours = parseInt(timeParts[1], 10) || 0;
  const amPm = (timeParts[2] || '').toUpperCase();

  if (amPm === 'PM' && hours !== 12) {
    hours += 12;
  } else if (amPm === 'AM' && hours === 12) {
    hours = 0;
  }

  const dateWithTime = new Date(year, month, day, hours, 0); // Minutes set to 0
  return dateWithTime.toISOString();
};

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
