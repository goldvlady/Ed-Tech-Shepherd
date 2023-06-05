import { createStandaloneToast, ToastId } from "@chakra-ui/react";
import { isArray } from "lodash";
import moment, { Duration, Moment } from "moment";
import { firebaseAuth } from "./firebase";

const { toast } = createStandaloneToast();

declare global {
  interface Window {
    networkErrorToast: ToastId;
  }
}

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

export const doFetch = async (input: RequestInfo, init?: RequestInit) => {
  const headers: HeadersInit = {};

  const token = await firebaseAuth.currentUser?.getIdToken();

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(input, { ...init, headers });

  if (!response.ok) {
    if (window.networkErrorToast) {
      toast.close(window.networkErrorToast);
    }

    window.networkErrorToast = toast({
      title: "An error occurred.",
      status: "error",
      position: "top",
      isClosable: true,
    });
    throw response;
  }

  return response;
};
export const educationLevelOptions = [
  {
    label: "Primary School Certificate",
    value: "primary-school-cert",
  },
  {
    label: "Junior Secondary School Certificate",
    value: "junior-secondary-school-cert",
  },
  {
    label: "Senior Secondary School Certificate",
    value: "senior-secondary-school-cert",
  },
  {
    label: "National Diploma (ND)",
    value: "national-diploma",
  },
  {
    label: "Higher National Diploma (HND)",
    value: "higher-national-diploma",
  },
  {
    label: "Bachelor's Degree (BSc, BA, BEng, etc.)",
    value: "bachelors-degree",
  },
  {
    label: "Master's Degree (MSc, MA, MEng, etc.)",
    value: "masters-degree",
  },
  {
    label: "Doctoral Degree (PhD, MD, etc.)",
    value: "doctoral-degree",
  },
  {
    label: "Vocational/Technical Certificate",
    value: "vocation-technical-cert",
  },
];

export const numberToDayOfWeekName = (num: number, format = "dddd") =>
  moment().day(num).format(format);
export const DayOfWeekNameToNumber = (num: number, format = "dddd") =>
  moment().day(num).format(format);

export const leadingZero = (num: number) => `0${num}`.slice(-2);

export const roundDate = (
  date: Date | Moment,
  duration: Duration,
  method: "ceil"
) => {
  return moment(Math[method](+date / +duration) * +duration);
};
export const twoDigitFormat = (d: number) => {
  return d < 10 ? "0" + d.toString() : d.toString();
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
    ending = "...";
  }
  if (str.length > length) {
    return str.substring(0, length - ending.length) + ending;
  } else {
    return str;
  }
};
