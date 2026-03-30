import { Search } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { subjects } from '../data/mockData';

interface SearchBarProps {
  onSearch?: (filters: SearchFilters) => void;
}

export interface SearchFilters {
  subject: string;
  location: string;
  budget: string;
  experience: string;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  return (
    <div className="bg-card rounded-lg shadow-lg border border-border p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select Subject" />
          </SelectTrigger>
          <SelectContent>
            {subjects.map((subject) => (
              <SelectItem key={subject.id} value={subject.name.toLowerCase()}>
                {subject.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input placeholder="Location (City / District)" />

        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Budget" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0-30">$0 - $30/hr</SelectItem>
            <SelectItem value="30-50">$30 - $50/hr</SelectItem>
            <SelectItem value="50-70">$50 - $70/hr</SelectItem>
            <SelectItem value="70+">$70+/hr</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Experience" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0-2">0-2 years</SelectItem>
            <SelectItem value="3-5">3-5 years</SelectItem>
            <SelectItem value="6-10">6-10 years</SelectItem>
            <SelectItem value="10+">10+ years</SelectItem>
          </SelectContent>
        </Select>

        <Button className="w-full">
          <Search className="w-4 h-4 mr-2" />
          Search
        </Button>
      </div>
    </div>
  );
}
