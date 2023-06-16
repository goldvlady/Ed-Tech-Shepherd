import { REACT_APP_API_ENDPOINT } from '../config';
import { doFetch } from '../util';
import {User} from '../../netlify/database/models/User';

class ApiService {
  static baseEndpoint = REACT_APP_API_ENDPOINT;

  static getResources = async () => {
    return doFetch(`${ApiService.baseEndpoint}/resources`);
  };

  static getCountries = async () => {
    return doFetch('https://restcountries.com/v3.1/all');
  };

  static getUser = async () => {
    return doFetch(`${ApiService.baseEndpoint}/me`);
  };

  
  static createUser = async (data: Partial<User>) => {
    return doFetch(`${ApiService.baseEndpoint}/createUser`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  };

  static submitStudent = async (data: any) => {
    return doFetch(`${ApiService.baseEndpoint}/createStudent`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  };

  static submitTutor = async (data: any) => {
    return doFetch(`${ApiService.baseEndpoint}/createTutor`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  };

  static getBookSessionData = async (data: any) => {
    return doFetch(`${ApiService.baseEndpoint}/getBookSessionData?${new URLSearchParams(data)}`);
  };

  static getBooking = async (id: string) => {
    return doFetch(`${ApiService.baseEndpoint}/getBooking?id=${id}`);
  };

  // Payments

  static createBooking = async (data: any) => {
    return doFetch(`${ApiService.baseEndpoint}/createBooking`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  };

  static createStripeSetupPaymentIntent = async (data: any) => {
    return doFetch(`${ApiService.baseEndpoint}/createStripeSetupPaymentIntent`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  };

  static addPaymentMethod = async (stripeId: string) => {
    return doFetch(`${ApiService.baseEndpoint}/addPaymentMethod`, {
      method: 'POST',
      body: JSON.stringify({ stripeId }),
    });
  };

  // Tutor

  static getTutor = async (id: string) => {
    return doFetch(`${ApiService.baseEndpoint}/tutor/${id}`);
  };

  // Offer

  static getOffer = async (id: string) => {
    return doFetch(`${ApiService.baseEndpoint}/offer/${id}`);
  };

  static createOffer = async (data: any) => {
    return doFetch(`${ApiService.baseEndpoint}/createOffer`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  };

  static acceptOffer = async (id: string) => {
    return doFetch(`${ApiService.baseEndpoint}/acceptOffer`, {
      method: 'POST',
      body: JSON.stringify({ id }),
    });
  };

  static declineOffer = async (id: string, note: string) => {
    return doFetch(`${ApiService.baseEndpoint}/declineOffer`, {
      method: 'POST',
      body: JSON.stringify({ id, note }),
    });
  };

  static withdrawOffer = async (id: string) => {
    return doFetch(`${ApiService.baseEndpoint}/withdrawOffer`, {
      method: 'POST',
      body: JSON.stringify({ id }),
    });
  };

  static bookOffer = async (id: string, paymentMethodId: string) => {
    return doFetch(`${ApiService.baseEndpoint}/bookOffer`, {
      method: 'POST',
      body: JSON.stringify({ id, paymentMethodId }),
    });
  };

  // static getAllTutors = async () => {
  //   return doFetch(`${ApiService.baseEndpoint}/tutors`);
  // };

  static getAllTutors = async (formData: any) => {
    let filterParams = '';
    let minRate = '';
    let maxRate = '';
    let days = '';
    console.log('FORM', formData);

    if (
      !formData['courses'] &&
      !formData['levels'] &&
      !formData['days'] &&
      !formData['price'] &&
      !formData['floorRating'] &&
      !formData['startTime'] &&
      !formData['endTime']
    ) {
      return doFetch(`${ApiService.baseEndpoint}/tutors`);
    } else {
      for (const key in formData) {
        const rateArray = formData['price'].split('-');
        minRate = rateArray[0];
        maxRate = rateArray[1];

        const daysArray = formData['days'];

        if (key !== 'tz' && key !== 'price' && key !== 'days') {
          filterParams += !!formData[key] ? `&${key}=${formData[key]}` : '';
        }
        if (key == 'price' && !!formData['price']) {
          filterParams += `&rate>=${minRate}&rate<=${maxRate}`;
        }
        if (key == 'days' && !!formData['days']) {
          daysArray.forEach((element: any) => {
            filterParams += `&schedule.${element.value}`;
          });
        }
      }
      return doFetch(
        `${ApiService.baseEndpoint}/tutors?tz=${formData.tz + filterParams}`
        // `${ApiService.baseEndpoint}/tutors?tz=Africa/Lagos${filterParams}`
      );
    }
  };

  static toggleBookmarkedTutor = async (id: string) => {
    return doFetch(`${ApiService.baseEndpoint}/toggleBookmarkedTutor`, {
      method: 'POST',
      body: JSON.stringify({ tutorId: id }),
    });
  };

  static getBookmarkedTutors = async () => {
    return doFetch(`${ApiService.baseEndpoint}/bookmarkedTutors`);
  };
}

export default ApiService;
