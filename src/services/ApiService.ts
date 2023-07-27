import { REACT_APP_API_ENDPOINT } from '../config';
import { AI_API, HEADER_KEY } from '../config';
import { objectToQueryString } from '../helpers/http.helpers';
import { User } from '../types';
import { doFetch } from '../util';

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
      body: JSON.stringify(data)
    });
  };

  static scheduleStudyEvent = async (data: any) => {
    return doFetch(`${ApiService.baseEndpoint}/scheduleStudyEvent`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  };

  static submitStudent = async (data: any) => {
    return doFetch(`${ApiService.baseEndpoint}/createStudent`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  };

  static updateQuestionAttempt = async (data: any) => {
    return doFetch(
      `${ApiService.baseEndpoint}/updateFlashcardQuestionAttempt`,
      {
        method: 'POST',
        body: JSON.stringify(data)
      }
    );
  };

  static storeFlashcardScore = async (data: any) => {
    return doFetch(`${ApiService.baseEndpoint}/storeScore`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  };

  static getFlashcards = async (queryParams: {
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const queryString = objectToQueryString(queryParams);
    return doFetch(
      `${ApiService.baseEndpoint}/getStudentFlashcards?${queryString}`
    );
  };

  static deleteFlashcard = async (id: string | number) => {
    return doFetch(`${ApiService.baseEndpoint}/deleteFlashcard?id=${id}`, {
      method: 'POST'
    });
  };

  static createFlashcard = async (data: any, generatorType = 'manual') => {
    return doFetch(
      `${ApiService.baseEndpoint}/createFlashcard?generatorType=${generatorType}`,
      {
        method: 'POST',
        body: JSON.stringify(data)
      }
    );
  };

  static verifyToken = async (token: string) => {
    return doFetch(
      `${ApiService.baseEndpoint}/verifyUserEmail?token=${token}`,
      {
        method: 'POST'
      }
    );
  };

  static logStudySession = async (data: any) => {
    return doFetch(`${ApiService.baseEndpoint}/logStudySession`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  };

  static storeCurrentStudy = async (flashcardId: string, data: any) => {
    return doFetch(`${ApiService.baseEndpoint}/storeCurrentStudy`, {
      method: 'POST',
      body: JSON.stringify({ flashcardId, data })
    });
  };

  static generateFlashcardQuestions = async (data: any, studentId: string) => {
    return fetch(`${AI_API}/flash-cards/students/${studentId}`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'x-shepherd-header': HEADER_KEY,
        'Content-Type': 'application/json'
      }
    });
  };

  static generateMneomics = async (query: string) => {
    return fetch(`${AI_API}/mnemonics/generate`, {
      method: 'POST',
      body: JSON.stringify({ query }),
      headers: {
        'x-shepherd-header': HEADER_KEY,
        'Content-Type': 'application/json'
      }
    });
  };

  static createMneomics = async (data: any) => {
    return doFetch(`${ApiService.baseEndpoint}/createMneomics`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  };

  static submitTutor = async (data: any) => {
    return doFetch(`${ApiService.baseEndpoint}/createTutor`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  };

  static getBookSessionData = async (data: any) => {
    return doFetch(
      `${ApiService.baseEndpoint}/getBookSessionData?${new URLSearchParams(
        data
      )}`
    );
  };

  static getBooking = async (id: string) => {
    return doFetch(`${ApiService.baseEndpoint}/getBooking?id=${id}`);
  };

  // Payments

  static createBooking = async (data: any) => {
    return doFetch(`${ApiService.baseEndpoint}/createBooking`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  };

  static createStripeSetupPaymentIntent = async (data: any) => {
    return doFetch(
      `${ApiService.baseEndpoint}/createStripeSetupPaymentIntent`,
      {
        method: 'POST',
        body: JSON.stringify(data)
      }
    );
  };

  static addPaymentMethod = async (stripeId: string) => {
    return doFetch(`${ApiService.baseEndpoint}/addPaymentMethod`, {
      method: 'POST',
      body: JSON.stringify({ stripeId })
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
      body: JSON.stringify(data)
    });
  };

  static acceptOffer = async (id: string) => {
    return doFetch(`${ApiService.baseEndpoint}/acceptOffer`, {
      method: 'POST',
      body: JSON.stringify({ id })
    });
  };

  static declineOffer = async (id: string, note: string) => {
    return doFetch(`${ApiService.baseEndpoint}/declineOffer`, {
      method: 'POST',
      body: JSON.stringify({ id, note })
    });
  };

  static withdrawOffer = async (id: string) => {
    return doFetch(`${ApiService.baseEndpoint}/withdrawOffer`, {
      method: 'POST',
      body: JSON.stringify({ id })
    });
  };

  static bookOffer = async (id: string, paymentMethodId: string) => {
    return doFetch(`${ApiService.baseEndpoint}/bookOffer`, {
      method: 'POST',
      body: JSON.stringify({ id, paymentMethodId })
    });
  };

  static getAllTutors = async (formData: any) => {
    let filterParams = '';

    for (const key in formData) {
      if (key === 'price' && !!formData['price']) {
        const rateArray = formData['price'].split('-');
        const minRate = rateArray[0];
        const maxRate = rateArray[1];
        filterParams += `&rate>=${minRate}&rate<=${maxRate}`;
      } else if (key === 'days' && !!formData['days']) {
        const daysArray = formData['days'];
        // eslint-disable-next-line
        daysArray.forEach((element: any) => {
          filterParams += `&schedule.${element.value}`;
        });
      } else if (
        key !== 'tz' &&
        key !== 'price' &&
        key !== 'days' &&
        !!formData[key]
      ) {
        filterParams += `&${key}=${formData[key]}`;
      }
    }

    const url = `${ApiService.baseEndpoint}/tutors?tz=${formData.tz}${filterParams}`;
    return doFetch(url);
  };

  static toggleBookmarkedTutor = async (id: string) => {
    return doFetch(`${ApiService.baseEndpoint}/toggleBookmarkedTutor`, {
      method: 'POST',
      body: JSON.stringify({ tutorId: id })
    });
  };

  // Get All Bookmarked tutors
  static getBookmarkedTutors = async () => {
    return doFetch(
      // `${ApiService.baseEndpoint}/bookmarkedTutors?page=${page}&limit=${limit}`
      `${ApiService.baseEndpoint}/bookmarkedTutors`
    );
  };

  static getStudentTutors = async () => {
    return doFetch(`${ApiService.baseEndpoint}/getStudentTutors`);
  };

  static getActivityFeeds = async () => {
    return doFetch(`${ApiService.baseEndpoint}/getActivityFeed`);
  };

  static getStudentReport = async () => {
    return doFetch(`${ApiService.baseEndpoint}/getStudentReport`);
  };

  // Get All Tutor Clients
  static getTutorClients = async () => {
    return doFetch(`${ApiService.baseEndpoint}/getTutorClients`);
  };

  // Get Single Tutor Clients
  static getTutorSingleClients = async (id: string) => {
    return doFetch(`${ApiService.baseEndpoint}/getClients?id=${id}`, {
      method: 'GET'
    });
  };

  // Get All Tutor Offers
  static getOffers = async (page: number, limit: number) => {
    return doFetch(
      `${ApiService.baseEndpoint}/getOffers?page=${page}&limit=${limit}`
    );
  };

  // Get Singlege Tutor Offers
  static getTutorSingleOffers = async (id: string) => {
    return doFetch(`${ApiService.baseEndpoint}/getOffers?id=${id}`);
  };

  //Tutor notification
  static getTutorNotifications = async () => {
    return doFetch(`${ApiService.baseEndpoint}/notifications`);
  };

  //Tutor Activity Feed
  static getTutorActivityFeed = async () => {
    return doFetch(`${ApiService.baseEndpoint}/getActivityFeed`);
  };

  static getUserNotifications = async () => {
    return doFetch(`${ApiService.baseEndpoint}/notifications`);
  };

  // Notes

  static getAllNotes = async () => {
    return doFetch(`${ApiService.baseEndpoint}/notes`);
  };

  static getNote = async (id: string | number) => {
    return doFetch(`${ApiService.baseEndpoint}/notes/${id}`);
  };

  static createNote = async (data: any) => {
    return doFetch(`${ApiService.baseEndpoint}/createNote`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  };

  static updateNote = async (id: string | number, data: any) => {
    return doFetch(`${ApiService.baseEndpoint}/updateNote/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  };

  static deleteNote = async (id: string | number) => {
    return doFetch(`${ApiService.baseEndpoint}/deleteNote?id=${id}`, {
      method: 'DELETE'
    });
  };
  static updateProfile = async (formData: any) => {
    return doFetch(`${ApiService.baseEndpoint}/updateProfile`, {
      method: 'PUT',
      body: JSON.stringify(formData)
    });
  };
}

export default ApiService;
