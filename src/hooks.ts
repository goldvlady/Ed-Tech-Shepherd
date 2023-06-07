export const useTitle = (title: string) =>
    (document.title = title ? `${title} - Shepherd Tutors` : 'Shepherd Tutors');
