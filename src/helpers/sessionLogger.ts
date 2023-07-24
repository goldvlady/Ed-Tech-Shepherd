import ApiService from '../services/ApiService';
import { UserType, SessionType } from '../types';

class StudySessionLogger {
  private user: UserType;
  private sessionType: SessionType;
  private currentState: 'INIT' | 'STARTED' | 'ENDED' = 'INIT';
  private startTime: Date | null = null;
  private endTime: Date | null = null;

  constructor(user: UserType, sessionType: SessionType) {
    this.user = user;
    this.sessionType = sessionType;
  }

  start() {
    this.startTime = new Date();
    this.currentState = 'STARTED';
    // Send start session data to the server
    // sendSessionDataToServer({
    //   user: this.user,
    //   sessionType: this.sessionType,
    //   startTime: this.startTime,
    // });
  }

  end() {
    if (this.currentState !== 'STARTED') {
      // eslint-disable-next-line
      console.error('NO SESSION STARTED');
      return;
    }
    // Store the end time
    this.endTime = new Date();
    this.currentState = 'ENDED';

    // Calculate the total session duration
    let duration = 0;
    if (this.startTime && this.endTime) {
      duration = this.endTime.getTime() - this.startTime.getTime();
    }

    // Send final session data to the server
    ApiService.logStudySession({
      user: this.user,
      sessionType: this.sessionType,
      startTime: this.startTime,
      endTime: this.endTime,
      duration: duration
    });
  }
}
export default StudySessionLogger;
