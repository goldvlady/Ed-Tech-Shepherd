import { doFetch } from "../util";

class ApiService {
  static baseEndpoint =
    "https://dev--shepherd-tutors.netlify.app/.netlify/functions";

  static getResources = async () => {
    return doFetch(`${ApiService.baseEndpoint}/resources`);
  };

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

  static createStripeSetupPaymentIntent = async (data: any) => {
    return doFetch(
      `${ApiService.baseEndpoint}/createStripeSetupPaymentIntent`,
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  };

  static addPaymentMethod = async (stripeId: string) => {
    return doFetch(`${ApiService.baseEndpoint}/addPaymentMethod`, {
      method: "POST",
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

  static withdrawOffer = async (id: string) => {
    return doFetch(`${ApiService.baseEndpoint}/withdrawOffer`, {
      method: "POST",
      body: JSON.stringify({ id }),
    });
  };

  static bookOffer = async (id: string, paymentMethodId: string) => {
    return doFetch(`${ApiService.baseEndpoint}/bookOffer`, {
      method: "POST",
      body: JSON.stringify({ id, paymentMethodId }),
    });
  };

  static getAllTutors = async () => {
    return doFetch(`${ApiService.baseEndpoint}/tutors`);
  };

  static getFilteredTutors = async (formData: any) => {
    let filterParams = "";
    let minRate = "";
    let maxRate = "";
    console.log("FORM", formData);

    for (const key in formData) {
      // filterParams += !!formData["price"] ? `&${formData["price"]}` : "";
      console.log(formData["price"]);
      const rateArray = formData["price"].split("-");
      minRate = rateArray[0];
      maxRate = rateArray[1];
      // filterParams += !!formData["price"]
      //   ? `&rate>=${minRate}&rate<=${maxRate}`
      //   : "";

      if (key !== "tz") {
        filterParams += !!formData[key]
          ? key == "price"
            ? `&${key}=${formData[key]}&rate>=${minRate}&rate<=${maxRate}`
            : `&${key}=${formData[key]}`
          : "";
      }
    }

    return doFetch(
      `${ApiService.baseEndpoint}/tutors?tz=${formData.tz + filterParams}`
      // `${ApiService.baseEndpoint}/tutors?tz=Africa/Lagos${filterParams}`
    );
  };

  static bookmarkTutor = async (id: string) => {
    return doFetch(`${ApiService.baseEndpoint}/bookmarkTutor`, {
      method: "POST",
      body: JSON.stringify({ tutorId: id }),
    });
  };

  static getBookmarkedTutors = async () => {
    return doFetch(`${ApiService.baseEndpoint}/bookmarkedTutors`);
  };
}

export default ApiService;
