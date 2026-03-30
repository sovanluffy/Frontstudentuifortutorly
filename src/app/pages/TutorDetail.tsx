import { useParams, useNavigate } from 'react-router';
import { tutors, openClasses } from '../data/mockData';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ClassCard } from '../components/ClassCard';
import {
  Star,
  CheckCircle2,
  Users,
  Calendar,
  MessageCircle,
  Phone,
  MapPin,
  Clock,
  Send,
} from 'lucide-react';

export function TutorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const tutor = tutors.find((t) => t.id === id);
  const tutorClasses = openClasses.filter((c) => c.tutorId === id);

  if (!tutor) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2>Tutor not found</h2>
        <Button onClick={() => navigate('/search')} className="mt-4">
          Back to Search
        </Button>
      </div>
    );
  }

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const timeSlots = [
    '9:00 AM',
    '11:00 AM',
    '2:00 PM',
    '4:00 PM',
    '6:00 PM',
    '8:00 PM',
  ];

  return (
    <div className="min-h-screen pb-20 md:pb-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-50 to-cyan-50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <img
              src={tutor.photo}
              alt={tutor.name}
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h1>{tutor.name}</h1>
                {tutor.verified && (
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                )}
              </div>
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span>{tutor.rating}</span>
                  <span className="text-muted-foreground">
                    ({tutor.studentsCount} students)
                  </span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Users className="w-5 h-5" />
                  <span>{tutor.experience} years experience</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="w-5 h-5" />
                  <span>{tutor.location}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {tutor.subjects.map((subject) => (
                  <Badge key={subject} variant="secondary">
                    {subject}
                  </Badge>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <Button onClick={() => navigate('/booking')}>
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Session
                </Button>
                <Button variant="outline">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Message
                </Button>
                <Button variant="outline">
                  <Send className="w-4 h-4 mr-2" />
                  Telegram
                </Button>
                <Button variant="outline">
                  <Phone className="w-4 h-4 mr-2" />
                  Call
                </Button>
              </div>
            </div>
            <div className="bg-card rounded-lg border border-border p-6 text-center">
              <div className="text-4xl text-primary mb-1">
                ${tutor.pricePerHour}
              </div>
              <div className="text-sm text-muted-foreground">per hour</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="about" className="w-full">
          <TabsList className="grid w-full md:w-auto grid-cols-4 mb-8">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="classes">Classes</TabsTrigger>
            <TabsTrigger value="availability">Availability</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="space-y-6">
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="mb-4">About {tutor.name}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {tutor.bio}
              </p>
            </div>

            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="mb-4">Skills & Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {tutor.skills.map((skill) => (
                  <Badge key={skill} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="mb-4">Teaching Modes</h3>
              <div className="space-y-2">
                {tutor.teachingMode.map((mode) => (
                  <div key={mode} className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span className="capitalize">
                      {mode.replace('-', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="classes">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tutorClasses.length > 0 ? (
                tutorClasses.map((openClass) => (
                  <ClassCard
                    key={openClass.id}
                    openClass={openClass}
                    onBookClick={() => navigate('/booking')}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  No open classes available at the moment
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="availability">
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="mb-6">Weekly Schedule</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="text-left p-2 border-b border-border">
                        Time
                      </th>
                      {weekDays.map((day) => (
                        <th
                          key={day}
                          className="text-center p-2 border-b border-border"
                        >
                          {day}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {timeSlots.map((time) => (
                      <tr key={time}>
                        <td className="p-2 text-sm text-muted-foreground border-b border-border">
                          {time}
                        </td>
                        {weekDays.map((day) => {
                          const isAvailable = Math.random() > 0.4;
                          return (
                            <td
                              key={`${day}-${time}`}
                              className="p-2 border-b border-border"
                            >
                              <div
                                className={`h-8 rounded ${
                                  isAvailable
                                    ? 'bg-green-100 border border-green-300 cursor-pointer hover:bg-green-200'
                                    : 'bg-gray-100'
                                }`}
                              />
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center gap-4 mt-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-100 border border-green-300 rounded" />
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-100 rounded" />
                  <span>Unavailable</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reviews">
            <div className="space-y-6">
              <div className="bg-card rounded-lg border border-border p-6">
                <div className="flex items-center gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-5xl mb-2">{tutor.rating}</div>
                    <div className="flex items-center gap-1 mb-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className="w-5 h-5 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {tutor.reviews.length} reviews
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center gap-3">
                        <span className="text-sm w-8">{rating}★</span>
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-yellow-400"
                            style={{
                              width: rating === 5 ? '80%' : '10%',
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {tutor.reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-card rounded-lg border border-border p-6"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="mb-1">{review.studentName}</h4>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground">{review.comment}</p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
