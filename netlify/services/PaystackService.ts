import fetch from 'cross-fetch';

export default class PaystackService {
    private secret: string;

    constructor() {
        this.secret = process.env.PAYSTACK_SECRET_KEY as string;
    }

    private fetch(endpoint: string) {
        return fetch(`https://api.paystack.co/${endpoint}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${this.secret}`,
                "Content-Type": "application/json",
            }
        })
    }

    async verifyTransaction (reference: string) {
        const resp = await this.fetch(`transaction/verify/${reference}`);
        return await resp.json();
    }
}