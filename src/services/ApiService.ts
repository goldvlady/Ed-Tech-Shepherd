import { doFetch } from "../util";

class ApiService {
  static baseEndpoint =
    "https://dev--shepherd-tutors.netlify.app/.netlify/functions";
  // static baseEndpoint = 'https://cors-anywhere.herokuapp.com/https://dev--shepherd-tutors.netlify.app/.netlify/functions';

  static getUser = async () => {
    return doFetch(`${ApiService.baseEndpoint}/me`);
  };

  static submitStudentLead = async (data: any) => {
    return doFetch(`${ApiService.baseEndpoint}/createStudentLead`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  };

  static submitTutorLead = async (data: any) => {
    return doFetch(`${ApiService.baseEndpoint}/createTutorLead`, {
      method: "POST",
      body: JSON.stringify(data),
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
      method: "POST",
      body: JSON.stringify(data),
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
      method: "POST",
      body: JSON.stringify(data),
    });
  };

  static acceptOffer = async (id: string) => {
    return doFetch(`${ApiService.baseEndpoint}/acceptOffer`, {
      method: "POST",
      body: JSON.stringify({ id }),
    });
  };

  static declineOffer = async (id: string, note: string) => {
    return doFetch(`${ApiService.baseEndpoint}/declineOffer`, {
      method: "POST",
      body: JSON.stringify({ id, note }),
    });
  };
  static getAllTutors = async () => {
    return doFetch(`${ApiService.baseEndpoint}/tutors`);
  };
  static getFilteredTutors = async (formData: any) => {
    let filterParams = "";
    for (const key in formData) {
      if (key != "tz") {
        filterParams += !!formData[key] ? `&${key}=${formData[key]}` : "";
      }
    }

    return doFetch(
      `${ApiService.baseEndpoint}/tutors?tz=${formData.tz + filterParams}`
    );
  };
}

export default ApiService;
