import { Course } from "./types";

const { createClient } = require('contentful/dist/contentful.browser.min.js');

export const getContentfulClient = () => {
    return createClient({
        space: 'q5h35qt388me',
        accessToken: 'OEuSBhuUmMRB-5H0GijzoaOCI5lDy108XexhmRTsbGk'
    })
}

export const getContentfulFileSrc = (item: any): string => {
    return item.fields.file.url;
}

export const formatContentFulCourse = (item: any): Course => {
    const { title, id } = item.fields;

    let image = item.fields.image;
    let icon = item.fields.icon;

    if (!!image) {
        image = getContentfulFileSrc(image);
    }

    if (!!icon) {
        icon = getContentfulFileSrc(icon);
    }

    return {
        title,
        id,
        image,
        icon
    }
}