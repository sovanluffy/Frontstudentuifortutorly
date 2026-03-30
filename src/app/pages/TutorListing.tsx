import { useState } from 'react';
import { TutorCard } from '../components/TutorCard';
import { tutors } from '../data/mockData';
import { Button } from '../components/ui/button';
import { Slider } from '../components/ui/slider';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Sheet, SheetContent, SheetTrigger } from '../components/ui/sheet';
import { SlidersHorizontal } from 'lucide-react';
import { Checkbox } from '../components/ui/checkbox';

export function TutorListing() {
  const [budget, setBudget] = useState([50]);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const FilterPanel = () => (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4">Filters</h3>
      </div>

      <div>
        <Label className="mb-3 block">Subject</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="All Subjects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            <SelectItem value="math">Math</SelectItem>
            <SelectItem value="english">English</SelectItem>
            <SelectItem value="programming">Programming</SelectItem>
            <SelectItem value="science">Science</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="mb-3 block">Budget ($/hour)</Label>
        <Slider
          value={budget}
          onValueChange={setBudget}
          max={100}
          step={5}
          className="mb-2"
        />
        <div className="text-sm text-muted-foreground">
          Up to ${budget[0]}/hour
        </div>
      </div>

      <div>
        <Label className="mb-3 block">Experience</Label>
        <div className="space-y-2">
          {['0-2 years', '3-5 years', '6-10 years', '10+ years'].map(
            (exp) => (
              <div key={exp} className="flex items-center gap-2">
                <Checkbox id={exp} />
                <label htmlFor={exp} className="text-sm cursor-pointer">
                  {exp}
                </label>
              </div>
            )
          )}
        </div>
      </div>

      <div>
        <Label className="mb-3 block">Teaching Mode</Label>
        <div className="space-y-2">
          {['Online', "Tutor's Home", "Student's Home"].map((mode) => (
            <div key={mode} className="flex items-center gap-2">
              <Checkbox id={mode} />
              <label htmlFor={mode} className="text-sm cursor-pointer">
                {mode}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label className="mb-3 block">Rating</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="All Ratings" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Ratings</SelectItem>
            <SelectItem value="4.5">4.5+ Stars</SelectItem>
            <SelectItem value="4.0">4.0+ Stars</SelectItem>
            <SelectItem value="3.5">3.5+ Stars</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button className="w-full">Apply Filters</Button>
    </div>
  );

  return (
    <div className="min-h-screen pb-20 md:pb-8">
      <div className="bg-gradient-to-r from-indigo-50 to-cyan-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="mb-2">Find Your Perfect Tutor</h1>
          <p className="text-muted-foreground">
            {tutors.length} tutors available
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-24 bg-card rounded-lg border border-border p-6">
              <FilterPanel />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filter Button */}
            <div className="mb-6 lg:hidden">
              <Sheet open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="overflow-y-auto">
                  <div className="mt-6">
                    <FilterPanel />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Tutor Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tutors.map((tutor) => (
                <TutorCard key={tutor.id} tutor={tutor} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
