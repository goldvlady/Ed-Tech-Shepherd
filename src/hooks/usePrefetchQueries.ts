import { useQueryClient } from '@tanstack/react-query';
import { User } from '../types';
import ApiService from '../services/ApiService';

function usePrefetchQueries() {
  const qc = useQueryClient();

  function prefetchQueries(user: User) {
    qc.prefetchQuery({
      queryKey: ['feeds', user.userRole === 'both' ? 'student' : 'student'],
      queryFn: async () => {
        const response = await ApiService.getActivityFeeds();
        if (!response.ok) throw new Error('Something went wrong fetching');
        const feeds = await response.json();
        return feeds;
      },
      retry: 3
    });
    qc.prefetchQuery({
      queryKey: ['events', user.userRole === 'both' ? 'student' : 'student'],
      queryFn: async () => {
        const response = await ApiService.getCalendarEvents();
        if (!response.ok) throw new Error('Something went wrong fetching');
        const { data } = await response.json();
        return data;
      },
      retry: 3
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
      retry: 3
    });
    qc.prefetchQuery({
      queryKey: [
        'upcomingEvent',
        user.userRole === 'both' ? 'student' : 'student'
      ],
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
      queryKey: ['feeds', 'tutor'],
      queryFn: async () => {
        const response = await ApiService.getActivityFeeds();

        if (!response.ok) throw new Error('Something went wrong fetching');
        const feeds = await response.json();
        return feeds;
      },
      retry: 3
    });
    qc.prefetchQuery({
      queryKey: ['events', 'tutor'],
      queryFn: async () => {
        const response = await ApiService.getCalendarEvents();
        if (!response.ok) throw new Error('Something went wrong fetching');
        const { data } = await response.json();
        return data;
      },
      retry: 3
    });
    qc.prefetchQuery({
      queryKey: ['upcomingEvent', 'tutor'],
      queryFn: async () => {
        const response = await ApiService.getUpcomingEvent();

        if (!response.ok)
          throw new Error('Something went wrong fetching student reports');
        const upcomingEvent = await response.json();
        return upcomingEvent;
      },
      retry: 3
    });
  }
  return { prefetchQueries };
}

export { usePrefetchQueries };
