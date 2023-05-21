import async from "react-select/dist/declarations/src/async/index"
import { doFetch } from "../util"

class ApiService {
    static baseEndpoint = 'https://dev--shepherd-tutors.netlify.app/.netlify/functions';

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

    static createOffer = async (data: any) => {
        return doFetch(`${ApiService.baseEndpoint}/createOffer`, {
            method: "POST",
            body: JSON.stringify(data)
        })
    }

    static getAllTutors = async () => {
        return doFetch(`${ApiService.baseEndpoint}/tutors`);
    }

}

export default ApiService