import { doFetch } from "../util"

class ApiService {
    static submitStudentLead = async (data: any) => {
        return doFetch('/.netlify/functions/createStudentLead', {
            method: "POST",
            body: JSON.stringify(data)
        })
    }

    static submitTutorLead = async (data: any) => {
        return doFetch('/.netlify/functions/createTutorLead', {
            method: "POST",
            body: JSON.stringify(data)
        })
    }

    static getBookSessionData = async (data: any) => {
        return doFetch('/.netlify/functions/getBookSessionData?' + new URLSearchParams(data))
    }

    static getBooking = async (id: string) => {
        return doFetch(`/.netlify/functions/getBooking?id=${id}`)
    }

    // Payments

    static createBookingPaymentIntent = async (data: any) => {
        return doFetch('/.netlify/functions/createBookingPaymentIntent', {
            method: "POST",
            body: JSON.stringify(data)
        })
    }
}

export default ApiService