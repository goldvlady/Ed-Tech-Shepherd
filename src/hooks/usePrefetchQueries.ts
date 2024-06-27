import { useQueryClient } from '@tanstack/react-query';
import { User } from '../types';
import ApiService from '../services/ApiService';
import { fetchStudentConversations } from '../services/AI';
import { loadDataFromLocalStorage } from '../views/Dashboard';

function usePrefetchQueries() {
  const qc = useQueryClient();

  function prefetchQueries(user: User) {
    const studentId = user._id;
    qc.prefetchQuery({
      queryKey: ['feeds-student'],
      queryFn: async () => {
        const response = await ApiService.getActivityFeeds();
        if (!response.ok) throw new Error('Something went wrong fetching');
        const feeds = await response.json();
        return feeds;
      },
      retry: 3
    });
    qc.prefetchQuery({
      queryKey: ['events-student'],
      queryFn: async () => {
        const response = await ApiService.getCalendarEvents();
        if (!response.ok) throw new Error('Something went wrong fetching');
        const { data } = await response.json();
        return data;
      },
      retry: 3,
      initialData: () => {
        const d = loadDataFromLocalStorage('calendarData');
        return d;
      }
    });
    qc.prefetchQuery({
      queryKey: ['studentReport'],
      queryFn: async () => {
        const response = await ApiService.getStudentReport();
        if (!response.ok)
          throw new Error('Something went wrong fetching student reports');
        const studentReport = await response.json();
        return studentReport;
      },
      retry: 3,
      initialData: () => {
        const d = loadDataFromLocalStorage('studentReport');
        return d;
      }
    });
    qc.prefetchQuery({
      queryKey: ['upcomingEvent-student'],
      queryFn: async () => {
        const response = await ApiService.getUpcomingEvent();
        if (!response.ok)
          throw new Error('Something went wrong fetching student reports');
        const upcomingEvent = await response.json();
        return upcomingEvent;
      },
      retry: 3,
      initialData: () => {
        const d = loadDataFromLocalStorage('nextEvent');
        return d;
      }
    });
    qc.prefetchQuery({
      queryKey: ['tutorReport'],
      queryFn: async () => {
        const response = await ApiService.getTutorReport();
        if (!response.ok)
          throw new Error('Something went wrong fetching student reports');
        const { data } = await response.json();
        return data;
      },
      retry: 3
    });
    qc.prefetchQuery({
      queryKey: ['feeds-tutor'],
      queryFn: async () => {
        const response = await ApiService.getActivityFeeds();

        if (!response.ok) throw new Error('Something went wrong fetching');
        const feeds = await response.json();
        return feeds;
      },
      retry: 3
    });
    qc.prefetchQuery({
      queryKey: ['events-tutor'],
      queryFn: async () => {
        const response = await ApiService.getCalendarEvents();
        if (!response.ok) throw new Error('Something went wrong fetching');
        const { data } = await response.json();
        return data;
      },
      retry: 3
    });
    qc.prefetchQuery({
      queryKey: ['upcomingEvent-tutor'],
      queryFn: async () => {
        const response = await ApiService.getUpcomingEvent();

        if (!response.ok)
          throw new Error('Something went wrong fetching student reports');
        const upcomingEvent = await response.json();
        return upcomingEvent;
      },
      retry: 3
    });
    qc.prefetchQuery({
      queryKey: ['chatHistory', { studentId }],
      queryFn: () => fetchStudentConversations(studentId)
    });
  }
  return { prefetchQueries };
}

export { usePrefetchQueries };
