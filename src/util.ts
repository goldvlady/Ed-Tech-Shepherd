import { createStandaloneToast, ToastId } from "@chakra-ui/react";
import { isArray } from "lodash";
import moment, { Duration, Moment } from "moment";
import { firebaseAuth } from "./firebase";

const { toast } = createStandaloneToast();

declare global {
    interface Window { networkErrorToast: ToastId; }
}

export const MinPasswordLength = 8;

export const getOptionValue = (opts: Array<{ value: any, label: any }>, val: any) => {
    if (isArray(val)) {
        return opts.filter(o => val.includes(o.value))
    }
    return opts.find(o => o.value === val);
}

export const doFetch = async (input: RequestInfo, init?: RequestInit) => {
    const headers: HeadersInit = {};

    const token = await firebaseAuth.currentUser?.getIdToken();

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(input, { ...init, headers });

    if (!response.ok) {
        if (window.networkErrorToast) {
            toast.close(window.networkErrorToast)
        }

        window.networkErrorToast = toast({
            title: 'An error occurred.',
            status: 'error',
            position: 'top',
            isClosable: true
        })
        throw response;
    }

    return response;
};

export const numberToDayOfWeekName = (num: number) => moment().day(num).format('dddd');
export const leadingZero = (num: number) => `0${num}`.slice(-2);

export const roundDate = (date: Date | Moment, duration: Duration, method: "ceil") => {
    return moment(Math[method]((+date) / (+duration)) * (+duration));
}