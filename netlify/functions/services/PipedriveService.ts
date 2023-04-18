import { capitalize } from "lodash";
import moment from "moment-timezone";
import { Schedule } from "../database/models/Schedule";
import { StudentLead } from "../database/models/StudentLead";
import { TutorLead } from "../database/models/TutorLead";

const pipedrive = require('pipedrive');

const fieldsIds = {
    tutorOrStudent: 'c4157fd23bdbe3279f0b801eee593bb4abc2923d',
    dob: '10c6111750d6a6f001e3925a8d055772eb531892',
    courses: '64fd01968de976802e3eea2ea909c36122b8ec2d',
    rate: '8b5a6c9941e4dd1802b10276d2302a1282659c67',
    occupation: '12890cdbe754666c4622c9b67cef0d8e790c1d28',
    highestLevelOfEducation: '9f30073269016953fb31e696d319c3d8c73a4f50',
    cv: 'aa2b43510821df481e13809668dcaa11b1759ecd',
    teachLevel: 'f73a4064e89327fc0875b2b199583223ef74343e',
    tz: '7b8817dd88aea9aa42aad464ab5e3c3ab23871db',
    parentOrStudent: '52f093658436046c28a289b467bc2aeb66b633be'
}

export class PipedriveService {

    constructor() {
    }

    get defaultClient() {
        let defaultClient = new pipedrive.ApiClient();
        let apiToken = defaultClient.authentications.api_key;
        apiToken.apiKey = process.env.PIPEDRIVE_TOKEN;

        return defaultClient;
    }

    get personsApi() {
        return new pipedrive.PersonsApi(this.defaultClient);
    }

    get dealsApi() {
        return new pipedrive.DealsApi(this.defaultClient);
    }

    get notesApi() {
        return new pipedrive.NotesApi(this.defaultClient);
    }

    /**
     * Formats tutor fields and params for Pipedrive
     * @param tutor 
     * @returns 
     */
    formatTutorForPipedrive(tutor: TutorLead) {
        return {
            title: `${capitalize(tutor.name.first)} ${capitalize(tutor.name.last)} - Tutor (${tutor.active ? 'active' : 'inactive'})`,
            [fieldsIds.tutorOrStudent]: "tutor",
            [fieldsIds.dob]: tutor.dob,
            [fieldsIds.courses]: tutor.courses.join(' '),
            [fieldsIds.rate]: tutor.rate,
            [fieldsIds.occupation]: tutor.occupation,
            [fieldsIds.highestLevelOfEducation]: tutor.highestLevelOfEducation,
            [fieldsIds.cv]: tutor.cv,
            [fieldsIds.teachLevel]: tutor.teachLevel.join(' '),
            [fieldsIds.tz]: tutor.tz
        }
    }

    /**
     * Create tutor deal in pipedrive
     * @param tutor 
     * @returns deal ID
     */
    async createTutorDeal(tutor: TutorLead) {
        const { success, data: { id: personId } } = await this.personsApi.addPerson({
            name: `${tutor.name.first} ${tutor.name.last}`,
            email: tutor.email
        });

        if (!success) {
            throw "error";
        }

        const { success: dealCreateSuccess, data: { id: tutorDealId } } = await this.dealsApi.addDeal({
            personId,
            ...this.formatTutorForPipedrive(tutor)
        });

        if (!dealCreateSuccess) {
            throw "error";
        }

        return tutorDealId;
    }

    /**
     * Update tutor deal in Pipedrive
     * @param tutor Tutor
     */
    async updateTutorDeal(tutor: TutorLead) {
        const { success: dealUpdateSuccess } = await this.dealsApi.updateDeal(tutor.pipedriveDealId, {
            ...this.formatTutorForPipedrive(tutor)
        });

        if (!dealUpdateSuccess) {
            throw "error";
        }
    }

    /**
     * Post a note in the tutor deal in Pipedrive
     * @param tutor 
     */
    async createTutorNote(tutor: TutorLead) {
        const schedule = tutor.schedule.map((s: Schedule) => {
            return `${moment(s.begin).format('dddd')}: ${moment(s.begin).tz('Africa/Lagos').format('hh:mm A')} - ${moment(s.end).tz('Africa/Lagos').format('hh:mm A')}`
        })

        const content = `
        <b>ID</b>: ${tutor._id}
        <br />
        <b>First name</b>: ${tutor.name.first}
        <br/>
        <b>Last name</b>: ${tutor.name.last}
        <br/>
        <b>Email</b>: ${tutor.email}
        <br/>
        <b>Date of birth</b>: ${tutor.dob}
        <br/>
        <b>Courses</b>: ${tutor.courses.join(", ")}
        <br/>
        <b>Schedule (WAT)</b>:
        ${schedule.join('<br />')}
        <br/>
        <b>Rate</b>: ${tutor.rate}
        <br/>
        <b>Occupation</b>: ${tutor.occupation}
        <br/>
        <b>Highest level of education</b>: ${tutor.highestLevelOfEducation}
        <br/>
        <b>CV</b>: ${tutor.cv}
        <br/>
        <b>Teach level</b>: ${tutor.teachLevel.join(', ')}
        <br/>
        <b>Timezone</b>: ${tutor.tz}
        <br/>
        <b>Avatar</b>: ${tutor.avatar}
        <br/>
        <b>Description</b>: ${tutor.description}
        `

        const { success } = await this.notesApi.addNote({
            pinned_to_deal_flag: 1,
            deal_id: tutor.pipedriveDealId,
            content
        })

        if (!success) {
            throw "error";
        }
    }

    /**
     * Create a student deal in Pipedrive
     * @param student 
     * @returns 
     */
    async createStudentDeal(student: StudentLead) {
        const { success, data: { id: personId } } = await this.personsApi.addPerson({
            name: `${student.name.first} ${student.name.last}`,
            email: student.email
        });

        if (!success) {
            throw "error";
        }

        const { success: dealCreateSuccess, data: { id: studentDealId } } = await this.dealsApi.addDeal({
            title: `${capitalize(student.name.first)} ${capitalize(student.name.last)} - Student`,
            personId,
            [fieldsIds.tutorOrStudent]: "student",
            [fieldsIds.dob]: student.dob,
            [fieldsIds.courses]: student.courses.join(' '),
            [fieldsIds.parentOrStudent]: student.parentOrStudent,
            [fieldsIds.tz]: student.tz
        });

        if (!dealCreateSuccess) {
            throw "error";
        }

        return studentDealId;
    }

    /**
     * Post a note in the student deal in Pipedrive
     * @param student 
     */
    async createStudentNote(student: StudentLead) {
        // @ts-ignore
        const schedule = student.schedule.map((s: Schedule) => {
            return `${moment(s.begin).format('dddd')}: ${moment(s.begin).tz('Africa/Lagos').format('hh:mm A')} - ${moment(s.end).tz('Africa/Lagos').format('hh:mm A')}`
        })

        const content = `
        <b>ID</b>: ${student._id}
        <br />
        <b>Parent or Student</b>: ${student.parentOrStudent}
        <br />
        <b>First name</b>: ${student.name.first}
        <br/>
        <b>Last name</b>: ${student.name.last}
        <br/>
        <b>Email</b>: ${student.email}
        <br/>
        <b>Date of birth</b>: ${student.dob}
        <br/>
        <b>Courses</b>: ${student.courses.join(", ")}
        <br/>
        <br/>
        <b>Grade level</b>: ${student.gradeLevel || "-"}
        <br/>
        <br/>
        <b>Topic</b>: ${student.topic || "-"}
        <br/>
        <br/>
        <b>Skill level</b>: ${student.skillLevel || "-"}
        <br/>
        <b>Schedule (WAT)</b>:
        ${schedule.join('<br />')}
        <br/>
        <b>Timezone</b>: ${student.tz}
        `

        const { success } = await this.notesApi.addNote({
            pinned_to_deal_flag: 1,
            deal_id: student.pipedriveDealId,
            content
        })

        if (!success) {
            throw "error";
        }
    }
}