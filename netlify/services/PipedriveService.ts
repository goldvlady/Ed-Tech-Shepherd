import { capitalize } from 'lodash';
import moment from 'moment-timezone';

import { SCHEDULE_FORMAT } from '../../src/config';
import { Schedule } from '../../src/types';
import { Student } from '../database/models/Student';
import { Tutor } from '../database/models/Tutor';

const pipedrive = require('pipedrive');

const fieldsIds = {
  tutorOrStudent: 'c4157fd23bdbe3279f0b801eee593bb4abc2923d',
  dob: '10c6111750d6a6f001e3925a8d055772eb531892',
  coursesAndLevels: '64fd01968de976802e3eea2ea909c36122b8ec2d',
  rate: '8b5a6c9941e4dd1802b10276d2302a1282659c67',
  occupation: '12890cdbe754666c4622c9b67cef0d8e790c1d28',
  cv: 'aa2b43510821df481e13809668dcaa11b1759ecd',
  tz: '7b8817dd88aea9aa42aad464ab5e3c3ab23871db',
  parentOrStudent: '52f093658436046c28a289b467bc2aeb66b633be',
};

export class PipedriveService {
  constructor() {}

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

  formatScheduleToWAT(schedule: Schedule) {
    const parseDateFormat = 'MM-DD-YYYY';

    return Object.keys(schedule).map((d) => {
      const weekDay = parseInt(d);
      const dateStr = moment().isoWeekday(weekDay).format(parseDateFormat);

      return schedule[weekDay]
        .map((s) => {
          const begin = moment(
            `${dateStr}, ${s.begin}`,
            `${parseDateFormat}, ${SCHEDULE_FORMAT}`
          ).tz('Africa/Lagos');
          const end = moment(`${dateStr}, ${s.end}`, `${parseDateFormat}, ${SCHEDULE_FORMAT}`).tz(
            'Africa/Lagos'
          );
          return `${begin.format('dddd')} ${begin.format('hh:mm A')} - ${end.format(
            'dddd'
          )} ${end.format('hh:mm A')}`;
        })
        .join('\n');
    });
  }

  /**
   * Formats tutor fields and params for Pipedrive
   * @param tutor
   * @returns
   */
  formatTutorForPipedrive(tutor: Tutor) {
    return {
      title: `${capitalize(tutor.user.name.first)} ${capitalize(tutor.user.name.last)} - Tutor (${
        tutor.active ? 'active' : 'inactive'
      })`,
      [fieldsIds.tutorOrStudent]: 'tutor',
      [fieldsIds.dob]: tutor.dob,
      [fieldsIds.coursesAndLevels]: tutor.coursesAndLevels
        .map((v) => `${v.course.label} ${v.level.label}`)
        .join(', '),
      [fieldsIds.rate]: tutor.rate,
      [fieldsIds.cv]: tutor.cv,
      [fieldsIds.tz]: tutor.tz,
    };
  }

  /**
   * Create tutor deal in pipedrive
   * @param tutor
   * @returns deal ID
   */
  async createTutorDeal(tutor: Tutor) {
    const {
      success,
      data: { id: personId },
    } = await this.personsApi.addPerson({
      name: `${tutor.user.name.first} ${tutor.user.name.last}`,
      email: tutor.email,
    });

    if (!success) {
      throw 'error';
    }

    const {
      success: dealCreateSuccess,
      data: { id: tutorDealId },
    } = await this.dealsApi.addDeal({
      personId,
      ...this.formatTutorForPipedrive(tutor),
    });

    if (!dealCreateSuccess) {
      throw 'error';
    }

    return tutorDealId;
  }

  /**
   * Update tutor deal in Pipedrive
   * @param tutor Tutor
   */
  async updateTutorDeal(tutor: Tutor) {
    const { success: dealUpdateSuccess } = await this.dealsApi.updateDeal(tutor.pipedriveDealId, {
      ...this.formatTutorForPipedrive(tutor),
    });

    if (!dealUpdateSuccess) {
      throw 'error';
    }
  }

  /**
   * Post a note in the tutor deal in Pipedrive
   * @param tutor
   */
  async createTutorNote(tutor: Tutor) {
    const schedule = this.formatScheduleToWAT(tutor.schedule);

    const content = `
        <b>ID</b>: ${tutor._id}
        <br />
        <b>First name</b>: ${tutor.user.name.first}
        <br/>
        <b>Last name</b>: ${tutor.user.name.last}
        <br/>
        <b>Email</b>: ${tutor.email}
        <br/>
        <b>Date of birth</b>: ${tutor.dob}
        <br/>
        <b>Courses</b>: ${tutor.coursesAndLevels
          .map((v) => `${v.course.label} ${v.level.label}`)
          .join(', ')}
        <br/>
        <b>Schedule (WAT)</b>:
        ${schedule.join('<br />')}
        <br/>
        <b>Rate</b>: ${tutor.rate}
        <br/>
        <b>CV</b>: ${tutor.cv}
        <br/>
        <b>Timezone</b>: ${tutor.tz}
        <br/>
        <b>Avatar</b>: ${tutor.avatar}
        <br/>
        <b>Description</b>: ${tutor.description}
        `;

    const { success } = await this.notesApi.addNote({
      pinned_to_deal_flag: 1,
      deal_id: tutor.pipedriveDealId,
      content,
    });

    if (!success) {
      throw 'error';
    }
  }

  /**
   * Create a student deal in Pipedrive
   * @param student
   * @returns
   */
  async createStudentDeal(student: Student) {
    const {
      success,
      data: { id: personId },
    } = await this.personsApi.addPerson({
      name: `${student.name.first} ${student.name.last}`,
      email: student.email,
    });

    if (!success) {
      throw 'error';
    }

    const {
      success: dealCreateSuccess,
      data: { id: studentDealId },
    } = await this.dealsApi.addDeal({
      title: `${capitalize(student.name.first)} ${capitalize(student.name.last)} - Student`,
      personId,
      [fieldsIds.tutorOrStudent]: 'student',
      [fieldsIds.dob]: student.dob,
      [fieldsIds.coursesAndLevels]: student.courses.join(' '),
      [fieldsIds.parentOrStudent]: student.parentOrStudent,
      [fieldsIds.tz]: student.tz,
    });

    if (!dealCreateSuccess) {
      throw 'error';
    }

    return studentDealId;
  }

  /**
   * Post a note in the student deal in Pipedrive
   * @param student
   */
  async createStudentNote(student: Student) {
    const schedule = this.formatScheduleToWAT(student.schedule);

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
        <b>Courses</b>: ${student.courses.join(', ')}
        <br/>
        <b>Opted to learn something else</b>: ${student.somethingElse || '-'}
        <br/>
        <b>Grade level</b>: ${student.gradeLevel || '-'}
        <br/>
        <b>Topic</b>: ${student.topic || '-'}
        <br/>
        <b>Schedule (WAT)</b>:
        ${schedule.join('<br />')}
        <br/>
        <b>Timezone</b>: ${student.tz}
        `;

    const { success } = await this.notesApi.addNote({
      pinned_to_deal_flag: 1,
      deal_id: student.pipedriveDealId,
      content,
    });

    if (!success) {
      throw 'error';
    }
  }
}
