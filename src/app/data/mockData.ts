export interface Tutor {
  id: string;
  name: string;
  photo: string;
  verified: boolean;
  rating: number;
  studentsCount: number;
  experience: number;
  pricePerHour: number;
  subjects: string[];
  bio: string;
  skills: string[];
  teachingMode: ('online' | 'tutor-home' | 'student-home')[];
  location: string;
  availability: string;
  reviews: Review[];
}

export interface Review {
  id: string;
  studentName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface OpenClass {
  id: string;
  subject: string;
  tutorId: string;
  tutorName: string;
  price: number;
  nextSlot: string;
  teachingMode: 'online' | 'tutor-home' | 'student-home';
  duration: number;
}

export interface Subject {
  id: string;
  name: string;
  icon: string;
  tutorCount: number;
}

export const subjects: Subject[] = [
  { id: '1', name: 'Math', icon: 'calculator', tutorCount: 234 },
  { id: '2', name: 'English', icon: 'book-open', tutorCount: 189 },
  { id: '3', name: 'Programming', icon: 'code', tutorCount: 156 },
  { id: '4', name: 'IELTS', icon: 'award', tutorCount: 98 },
  { id: '5', name: 'Science', icon: 'flask-conical', tutorCount: 176 },
  { id: '6', name: 'Music', icon: 'music', tutorCount: 87 },
];

export const tutors: Tutor[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    photo: 'https://images.unsplash.com/photo-1551989745-347c28b620e5?w=400',
    verified: true,
    rating: 4.9,
    studentsCount: 127,
    experience: 8,
    pricePerHour: 45,
    subjects: ['Math', 'Physics'],
    bio: 'Experienced mathematics and physics tutor with a passion for making complex concepts simple. I hold a Master\'s degree in Mathematics and have been teaching for 8 years.',
    skills: ['Algebra', 'Calculus', 'Geometry', 'Physics', 'Problem Solving'],
    teachingMode: ['online', 'student-home'],
    location: 'New York, NY',
    availability: 'Mon-Fri: 4PM-8PM',
    reviews: [
      {
        id: '1',
        studentName: 'Michael Brown',
        rating: 5,
        comment: 'Sarah is an excellent tutor! She helped me improve my calculus grade from C to A.',
        date: '2026-03-15',
      },
      {
        id: '2',
        studentName: 'Emma Davis',
        rating: 5,
        comment: 'Very patient and explains concepts clearly. Highly recommended!',
        date: '2026-03-10',
      },
    ],
  },
  {
    id: '2',
    name: 'David Chen',
    photo: 'https://images.unsplash.com/photo-1621388840627-a6909154b1f8?w=400',
    verified: true,
    rating: 4.8,
    studentsCount: 95,
    experience: 5,
    pricePerHour: 50,
    subjects: ['Programming', 'Computer Science'],
    bio: 'Software engineer turned educator. I specialize in Python, JavaScript, and web development. Let\'s code together!',
    skills: ['Python', 'JavaScript', 'React', 'Web Development', 'Algorithms'],
    teachingMode: ['online'],
    location: 'San Francisco, CA',
    availability: 'Mon-Sun: Flexible',
    reviews: [
      {
        id: '3',
        studentName: 'Alex Turner',
        rating: 5,
        comment: 'David taught me React from scratch. Now I can build my own apps!',
        date: '2026-03-20',
      },
    ],
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    photo: 'https://images.unsplash.com/photo-1758685847747-597ce085906e?w=400',
    verified: true,
    rating: 5.0,
    studentsCount: 156,
    experience: 10,
    pricePerHour: 55,
    subjects: ['English', 'IELTS', 'Writing'],
    bio: 'IELTS examiner with 10 years of experience. I\'ve helped over 150 students achieve their target band scores.',
    skills: ['IELTS', 'TOEFL', 'Academic Writing', 'Speaking', 'Grammar'],
    teachingMode: ['online', 'tutor-home', 'student-home'],
    location: 'London, UK',
    availability: 'Tue-Sat: 10AM-6PM',
    reviews: [
      {
        id: '4',
        studentName: 'Sophia Lee',
        rating: 5,
        comment: 'Got band 8 in IELTS thanks to Emily! Best investment ever.',
        date: '2026-03-18',
      },
      {
        id: '5',
        studentName: 'James Wilson',
        rating: 5,
        comment: 'Emily is professional and knows exactly what examiners look for.',
        date: '2026-03-12',
      },
    ],
  },
  {
    id: '4',
    name: 'Michael Thompson',
    photo: 'https://images.unsplash.com/photo-1511629091441-ee46146481b6?w=400',
    verified: true,
    rating: 4.7,
    studentsCount: 82,
    experience: 6,
    pricePerHour: 40,
    subjects: ['Science', 'Chemistry', 'Biology'],
    bio: 'PhD in Chemistry with a love for teaching. I make science fun and accessible for all students.',
    skills: ['Chemistry', 'Biology', 'Lab Techniques', 'AP Science', 'Research Methods'],
    teachingMode: ['online', 'student-home'],
    location: 'Boston, MA',
    availability: 'Mon-Thu: 3PM-7PM',
    reviews: [
      {
        id: '6',
        studentName: 'Olivia Martinez',
        rating: 5,
        comment: 'Michael made chemistry so much easier to understand!',
        date: '2026-03-22',
      },
    ],
  },
  {
    id: '5',
    name: 'Jessica Park',
    photo: 'https://images.unsplash.com/photo-1758685848147-e1e149bf2603?w=400',
    verified: true,
    rating: 4.9,
    studentsCount: 103,
    experience: 7,
    pricePerHour: 48,
    subjects: ['Music', 'Piano', 'Music Theory'],
    bio: 'Professional pianist and music educator. I teach all levels from beginners to advanced students.',
    skills: ['Piano', 'Music Theory', 'Composition', 'Sight Reading', 'Performance'],
    teachingMode: ['tutor-home', 'student-home'],
    location: 'Los Angeles, CA',
    availability: 'Mon-Fri: 2PM-8PM',
    reviews: [
      {
        id: '7',
        studentName: 'Daniel Kim',
        rating: 5,
        comment: 'Jessica is an amazing piano teacher. Very patient and encouraging.',
        date: '2026-03-25',
      },
    ],
  },
  {
    id: '6',
    name: 'Robert Anderson',
    photo: 'https://images.unsplash.com/photo-1584554376766-ac0f2c65e949?w=400',
    verified: true,
    rating: 4.8,
    studentsCount: 91,
    experience: 9,
    pricePerHour: 52,
    subjects: ['Math', 'SAT Prep', 'ACT Prep'],
    bio: 'Standardized test prep specialist. I\'ve helped hundreds of students achieve their dream college admissions.',
    skills: ['SAT Math', 'ACT Math', 'Test Strategy', 'College Prep', 'Statistics'],
    teachingMode: ['online', 'tutor-home'],
    location: 'Chicago, IL',
    availability: 'Weekends: 9AM-5PM',
    reviews: [
      {
        id: '8',
        studentName: 'Isabella Garcia',
        rating: 5,
        comment: 'Increased my SAT math score by 150 points! Thank you Robert!',
        date: '2026-03-19',
      },
    ],
  },
];

export const openClasses: OpenClass[] = [
  {
    id: '1',
    subject: 'Advanced Calculus',
    tutorId: '1',
    tutorName: 'Sarah Johnson',
    price: 45,
    nextSlot: '2026-04-02 4:00 PM',
    teachingMode: 'online',
    duration: 60,
  },
  {
    id: '2',
    subject: 'React for Beginners',
    tutorId: '2',
    tutorName: 'David Chen',
    price: 50,
    nextSlot: '2026-04-01 6:00 PM',
    teachingMode: 'online',
    duration: 90,
  },
  {
    id: '3',
    subject: 'IELTS Speaking Practice',
    tutorId: '3',
    tutorName: 'Emily Rodriguez',
    price: 55,
    nextSlot: '2026-04-03 2:00 PM',
    teachingMode: 'online',
    duration: 60,
  },
  {
    id: '4',
    subject: 'Organic Chemistry Crash Course',
    tutorId: '4',
    tutorName: 'Michael Thompson',
    price: 40,
    nextSlot: '2026-04-02 3:30 PM',
    teachingMode: 'online',
    duration: 75,
  },
  {
    id: '5',
    subject: 'Piano Basics',
    tutorId: '5',
    tutorName: 'Jessica Park',
    price: 48,
    nextSlot: '2026-04-04 5:00 PM',
    teachingMode: 'tutor-home',
    duration: 60,
  },
];