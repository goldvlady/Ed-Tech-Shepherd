import async from "react-select/dist/declarations/src/async/index"
import { doFetch } from "../util"

class ApiService {
    //GET USER
     
       
static getUser = async()=> {
    // return doFetch('/.netlify/functions/createStudentLead', {
    //     method: "POST",
    //     header: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(token)
    // })
    const headers = { 'Authorization': `Bearer ${localStorage.getItem("token")}` };
    return fetch('/.netlify/functions/me', { headers })
            .then(response => response.json())
            .then(data => console.log(data));
   
}
    
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

    static createBooking = async (data: any) => {
        return doFetch('/.netlify/functions/createBooking', {
            method: "POST",
            body: JSON.stringify(data)
        })
    }

    // Tutor

    static getTutor = async(id: string) => {
        return doFetch(`/.netlify/functions/tutor/${id}`);
    }

    // Offer

    static createOffer = async (data: any) => {
        return doFetch('/.netlify/functions/createOffer', {
            method: "POST",
            body: JSON.stringify(data)
        })
    }
}

export default ApiService