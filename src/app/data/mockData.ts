export interface Review {
  id: string;
  studentName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Tutor {
  tutorId: number;           // Key change: 'id' is now 'tutorId'
  fullname: string;          // Key change: 'name' is now 'fullname'
  profilePicture: string;    // Key change: 'photo' is now 'profilePicture'
  verified: boolean;
  rating: number;
  studentsTaught: number;    // Key change: 'studentsCount' is now 'studentsTaught'
  experience: number;
  startingPrice: number;     // Key change: 'pricePerHour' is now 'startingPrice'
  subjects: string[];
  bio: string;
  skills: string[];
  teachingMode: ('online' | 'tutor-home' | 'student-home')[];
  location: string;
  availability: string;
  reviews: Review[];
  highlights: string | null;
  public: boolean;
}

export interface Subject {
  id: string;
  name: string;
  icon: string;
  tutorCount: number;
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

// --- DATA ARRAYS ---

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
    tutorId: 1,
    fullname: "Sarah Johnson",
    profilePicture: "https://images.unsplash.com/photo-1551989745-347c28b620e5?w=400",
    verified: true,
    rating: 4.9,
    studentsTaught: 127,
    experience: 8,
    startingPrice: 45,
    subjects: ['Math', 'Physics'],
    bio: 'Experienced math tutor.',
    skills: ['Calculus'],
    teachingMode: ['online'],
    location: 'New York, NY',
    availability: 'Mon-Fri',
    reviews: [],
    highlights: "Master's Degree",
    public: true
  },
  {
    tutorId: 2,
    fullname: "David Chen",
    profilePicture: "https://images.unsplash.com/photo-1621388840627-a6909154b1f8?w=400",
    verified: true,
    rating: 4.8,
    studentsTaught: 95,
    experience: 5,
    startingPrice: 50,
    subjects: ['Programming'],
    bio: 'Software engineer.',
    skills: ['React'],
    teachingMode: ['online'],
    location: 'San Francisco',
    availability: 'Flexible',
    reviews: [],
    highlights: 'Ex-Google',
    public: true
  },
  // Add 5 more similar objects here to reach 7...
  {
    tutorId: 3, fullname: "John the Tutor", profilePicture: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400",
    verified: true, rating: 5.0, studentsTaught: 42, experience: 3, startingPrice: 25,
    subjects: ['English'], bio: 'Native speaker.', skills: ['IELTS'],
    teachingMode: ['online'], location: 'Remote', availability: '4PM-8PM', reviews: [], highlights: null, public: true
  },
  {
    tutorId: 4, fullname: "Emily Rodriguez", profilePicture: "https://images.unsplash.com/photo-1758685847747-597ce085906e?w=400",
    verified: true, rating: 5.0, studentsTaught: 156, experience: 10, startingPrice: 55,
    subjects: ['IELTS'], bio: 'Examiner.', skills: ['Writing'],
    teachingMode: ['online'], location: 'London', availability: 'Tue-Sat', reviews: [], highlights: "Examiner", public: true
  },
  {
    tutorId: 5, fullname: "Michael Thompson", profilePicture: "https://images.unsplash.com/photo-1511629091441-ee46146481b6?w=400",
    verified: true, rating: 4.7, studentsTaught: 82, experience: 6, startingPrice: 40,
    subjects: ['Chemistry'], bio: 'PhD Holder.', skills: ['Organic'],
    teachingMode: ['online'], location: 'Boston', availability: 'Mon-Thu', reviews: [], highlights: "PhD", public: true
  },
  {
    tutorId: 6, fullname: "Jessica Park", profilePicture: "https://images.unsplash.com/photo-1758685848147-e1e149bf2603?w=400",
    verified: true, rating: 4.9, studentsTaught: 103, experience: 7, startingPrice: 48,
    subjects: ['Piano'], bio: 'Pianist.', skills: ['Theory'],
    teachingMode: ['tutor-home'], location: 'L.A.', availability: 'Weekends', reviews: [], highlights: "Pro", public: true
  },
  {
    tutorId: 7, fullname: "Robert Anderson", profilePicture: "https://images.unsplash.com/photo-1584554376766-ac0f2c65e949?w=400",
    verified: true, rating: 4.8, studentsTaught: 91, experience: 9, startingPrice: 52,
    subjects: ['SAT Prep'], bio: 'Test specialist.', skills: ['SAT Math'],
    teachingMode: ['online'], location: 'Chicago', availability: 'Daily', reviews: [], highlights: "SAT Guru", public: true
  },
  {
    tutorId: 8,
    fullname: "Dr. Sofia Al-Farsi",
    profilePicture: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400",
    verified: true,
    rating: 4.9,
    studentsTaught: 210,
    experience: 12,
    startingPrice: 65,
    subjects: ['Science', 'Biology'],
    bio: 'Medical researcher and biology specialist.',
    skills: ['Genetics', 'Anatomy'],
    teachingMode: ['online', 'tutor-home'],
    location: 'Dubai, UAE',
    availability: 'Evenings',
    reviews: [],
    highlights: "Medical Doctor",
    public: true
  },
  {
    tutorId: 9,
    fullname: "Marcus Thorne",
    profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    verified: true,
    rating: 4.7,
    studentsTaught: 68,
    experience: 4,
    startingPrice: 35,
    subjects: ['Programming', 'Math'],
    bio: 'Full-stack developer with a passion for logic.',
    skills: ['Python', 'Data Science'],
    teachingMode: ['online'],
    location: 'Austin, TX',
    availability: 'Mon-Fri',
    reviews: [],
    highlights: "Bootcamp Mentor",
    public: true
  },
  {
    tutorId: 10,
    fullname: "Elena Kuznetsova",
    profilePicture: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
    verified: true,
    rating: 5.0,
    studentsTaught: 88,
    experience: 6,
    startingPrice: 42,
    subjects: ['Music', 'Piano'],
    bio: 'Classical pianist from the Conservatory.',
    skills: ['Composition', 'Performance'],
    teachingMode: ['student-home'],
    location: 'Berlin, DE',
    availability: 'Weekends',
    reviews: [],
    highlights: "Award Winner",
    public: true
  },
  {
    tutorId: 11,
    fullname: "Liam O'Connor",
    profilePicture: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
    verified: false,
    rating: 4.6,
    studentsTaught: 54,
    experience: 3,
    startingPrice: 30,
    subjects: ['English', 'IELTS'],
    bio: 'Friendly conversationalist and test prep coach.',
    skills: ['Speaking', 'Grammar'],
    teachingMode: ['online', 'student-home'],
    location: 'Dublin, IE',
    availability: 'Flexible',
    reviews: [],
    highlights: null,
    public: true
  },
  {
    tutorId: 12,
    fullname: "Yuki Tanaka",
    profilePicture: "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=400",
    verified: true,
    rating: 4.9,
    studentsTaught: 115,
    experience: 7,
    startingPrice: 48,
    subjects: ['Science', 'Chemistry'],
    bio: 'Lab researcher specializing in organic chemistry.',
    skills: ['Lab Safety', 'Stoichiometry'],
    teachingMode: ['online'],
    location: 'Tokyo, JP',
    availability: 'Mornings',
    reviews: [],
    highlights: "Research Fellow",
    public: true
  }
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
  }
];