import { doFetch } from "../util"

class ApiService {
    static baseEndpoint = '/.netlify/functions';

    static getUser = async () => {
        return doFetch(`${ApiService.baseEndpoint}/me`); 
    }
    
    static submitStudentLead = async (data: any) => {
        return doFetch(`${ApiService.baseEndpoint}/createStudentLead`, {
            method: "POST",
            body: JSON.stringify(data)
        })
    }

    static submitTutorLead = async (data: any) => {
        return doFetch(`${ApiService.baseEndpoint}/createTutorLead`, {
            method: "POST",
            body: JSON.stringify(data)
        })
    }

    static getBookSessionData = async (data: any) => {
        return doFetch(`${ApiService.baseEndpoint}/getBookSessionData?${new URLSearchParams(data)}`)
    }

    static getBooking = async (id: string) => {
        return doFetch(`${ApiService.baseEndpoint}/getBooking?id=${id}`)
    }

    // Payments

    static createBooking = async (data: any) => {
        return doFetch(`${ApiService.baseEndpoint}/createBooking`, {
            method: "POST",
            body: JSON.stringify(data)
        })
    }

    // Tutor

    static getTutor = async(id: string) => {
        return doFetch(`${ApiService.baseEndpoint}/tutor/${id}`);
    }

    // Offer

    static getOffer = async(id: string) => {
        return doFetch(`${ApiService.baseEndpoint}/offer/${id}`);
    }

    static createOffer = async (data: any) => {
        return doFetch(`${ApiService.baseEndpoint}/createOffer`, {
            method: "POST",
            body: JSON.stringify(data)
        })
    }

    static acceptOffer = async (id: string) => {
        return doFetch(`${ApiService.baseEndpoint}/acceptOffer`, {
            method: "POST",
            body: JSON.stringify({id})
        })
    }

    static declineOffer = async (id: string, note: string) => {
        return doFetch(`${ApiService.baseEndpoint}/declineOffer`, {
            method: "POST",
            body: JSON.stringify({id, note})
        })
    }

    static withdrawOffer = async (id: string) => {
        return doFetch(`${ApiService.baseEndpoint}/withdrawOffer`, {
            method: "POST",
            body: JSON.stringify({id})
        })
    }
}

export default ApiService