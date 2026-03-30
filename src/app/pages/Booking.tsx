import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/figma/ui/button';
import { Label } from '../components/figma/ui/label';
import { Textarea } from '../components/figma/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/figma/ui/select';
import { Calendar } from '../components/figma/ui/calendar';
import { tutors } from '../data/mockData';
import { CheckCircle } from 'lucide-react';

export function Booking() {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedTutor, setSelectedTutor] = useState<string>('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const timeSlots = [
    '9:00 AM',
    '10:00 AM',
    '11:00 AM',
    '2:00 PM',
    '3:00 PM',
    '4:00 PM',
    '5:00 PM',
    '6:00 PM',
  ];

  const handleSubmit = () => {
    setIsSubmitted(true);
    setTimeout(() => {
      navigate('/bookings');
    }, 2000);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center pb-20 md:pb-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="mb-2">Booking Request Sent!</h2>
          <p className="text-muted-foreground">
            The tutor will confirm your booking soon
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 md:pb-8">
      <div className="bg-gradient-to-r from-indigo-50 to-cyan-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="mb-2">Book a Session</h1>
          <p className="text-muted-foreground">
            Schedule a session with your preferred tutor
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Booking Form */}
            <div className="space-y-6">
              <div className="bg-card rounded-lg border border-border p-6">
                <h3 className="mb-6">Session Details</h3>

                <div className="space-y-4">
                  <div>
                    <Label className="mb-2 block">Select Tutor</Label>
                    <Select value={selectedTutor} onValueChange={setSelectedTutor}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a tutor" />
                      </SelectTrigger>
                      <SelectContent>
                        {tutors.map((tutor) => (
                          <SelectItem key={tutor.id} value={tutor.id}>
                            {tutor.name} - {tutor.subjects.join(', ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="mb-2 block">Subject</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="math">Math</SelectItem>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="programming">Programming</SelectItem>
                        <SelectItem value="science">Science</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="mb-2 block">Session Duration</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">60 minutes</SelectItem>
                        <SelectItem value="90">90 minutes</SelectItem>
                        <SelectItem value="120">120 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="mb-2 block">Teaching Mode</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="online">Online</SelectItem>
                        <SelectItem value="tutor-home">Tutor's Home</SelectItem>
                        <SelectItem value="student-home">Student's Home</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="mb-2 block">
                      Message (Optional)
                    </Label>
                    <Textarea
                      placeholder="Tell the tutor about your learning goals..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={4}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Date & Time Selection */}
            <div className="space-y-6">
              <div className="bg-card rounded-lg border border-border p-6">
                <h3 className="mb-6">Select Date</h3>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border mx-auto"
                />
              </div>

              <div className="bg-card rounded-lg border border-border p-6">
                <h3 className="mb-4">Available Time Slots</h3>
                <div className="grid grid-cols-2 gap-3">
                  {timeSlots.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? 'default' : 'outline'}
                      onClick={() => setSelectedTime(time)}
                      className="w-full"
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Summary & Submit */}
          <div className="mt-8 bg-card rounded-lg border border-border p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="mb-2">Booking Summary</h3>
                <p className="text-muted-foreground">
                  {date && selectedTime ? (
                    <>
                      {date.toLocaleDateString()} at {selectedTime}
                    </>
                  ) : (
                    'Please select date and time'
                  )}
                </p>
              </div>
              <Button
                size="lg"
                onClick={handleSubmit}
                disabled={!selectedTutor || !date || !selectedTime}
              >
                Send Booking Request
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
