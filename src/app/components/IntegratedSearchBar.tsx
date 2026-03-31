import { useState } from "react";
import {
  Search,
  MapPin,
  DollarSign,
  Star,
  Calendar,
  Sparkles
} from "lucide-react";
import { Button } from "./figma/ui/button";
import { subjects as mockSubjects } from "../data/mockData";

interface Props {
  selectedSubject: string;
  onSubjectSelect: (name: string) => void;
}

export function IntegratedSearchBar({
  selectedSubject,
  onSubjectSelect
}: Props) {
  const [subjectSearch, setSubjectSearch] = useState("");
  const [locSearch, setLocSearch] = useState("");

  const [selectedLoc, setSelectedLoc] = useState("Anywhere");
  const [selectedBudget, setSelectedBudget] = useState("Any Price");
  const [selectedRating, setSelectedRating] = useState("Any Rating");
  const [selectedSchedule, setSelectedSchedule] = useState("Any Time");

  const locations = [
    "Anywhere",
    "Online",
    "Phnom Penh",
    "Siem Reap",
    "Battambang",
    "Kampot",
    "Bangkok",
    "Singapore",
    "Tokyo"
  ];

  const filteredSubjects = mockSubjects.filter((s: any) =>
    s.name.toLowerCase().includes(subjectSearch.toLowerCase())
  );

  const filteredLocations = locations.filter((city) =>
    city.toLowerCase().includes(locSearch.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-140px)]">
      <div className="bg-white p-6 rounded-3xl border shadow-xl flex flex-col h-full">

        {/* HEADER */}
        <h2 className="font-black text-lg mb-4">Filters</h2>

        {/* SCROLL AREA */}
        <div className="overflow-y-auto pr-2 flex-1 space-y-6">

          {/* SUBJECT */}
          <div>
            <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
              <Sparkles size={16} /> Subject
            </h3>

            <input
              placeholder="Search subject..."
              className="w-full border rounded-xl px-3 py-2 mb-3 text-sm focus:border-indigo-500 outline-none"
              value={subjectSearch}
              onChange={(e) => setSubjectSearch(e.target.value)}
            />

            <div className="max-h-40 overflow-y-auto space-y-1">
              {filteredSubjects.map((item: any) => (
                <button
                  key={item.id}
                  onClick={() => onSubjectSelect(item.name)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                    selectedSubject === item.name
                      ? "bg-indigo-100 text-indigo-700 font-bold"
                      : "hover:bg-slate-100"
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          {/* LOCATION */}
          <div>
            <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
              <MapPin size={16} /> Location
            </h3>

            <div className="flex items-center gap-2 border rounded-xl px-3 py-2 mb-3 focus-within:border-indigo-500">
              <Search size={14} className="text-slate-400" />
              <input
                placeholder="Search city..."
                className="outline-none text-sm w-full"
                value={locSearch}
                onChange={(e) => setLocSearch(e.target.value)}
              />
            </div>

            <div className="max-h-44 overflow-y-auto space-y-1 pr-1">
              {filteredLocations.map((loc) => (
                <button
                  key={loc}
                  onClick={() => setSelectedLoc(loc)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                    selectedLoc === loc
                      ? "bg-indigo-100 text-indigo-700 font-bold"
                      : "hover:bg-slate-100"
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>

          {/* PRICE */}
          <div>
            <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
              <DollarSign size={16} /> Price
            </h3>

            {["Any Price", "$10 - $20", "$20 - $40", "$40 - $80"].map((price) => (
              <button
                key={price}
                onClick={() => setSelectedBudget(price)}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                  selectedBudget === price
                    ? "bg-indigo-100 text-indigo-700 font-bold"
                    : "hover:bg-slate-100"
                }`}
              >
                {price}
              </button>
            ))}
          </div>

          {/* RATING */}
          <div>
            <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
              <Star size={16} /> Rating
            </h3>

            {["Any Rating", "4★ & up", "4.5★ & up", "5★ only"].map((rating) => (
              <button
                key={rating}
                onClick={() => setSelectedRating(rating)}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                  selectedRating === rating
                    ? "bg-indigo-100 text-indigo-700 font-bold"
                    : "hover:bg-slate-100"
                }`}
              >
                {rating}
              </button>
            ))}
          </div>

          {/* AVAILABILITY */}
          <div>
            <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
              <Calendar size={16} /> Availability
            </h3>

            {["Any Time", "Weekend", "Weekday", "Evening"].map((time) => (
              <button
                key={time}
                onClick={() => setSelectedSchedule(time)}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                  selectedSchedule === time
                    ? "bg-indigo-100 text-indigo-700 font-bold"
                    : "hover:bg-slate-100"
                }`}
              >
                {time}
              </button>
            ))}
          </div>

        </div>

        {/* APPLY BUTTON */}
        <Button className="mt-4 w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl">
          <Search size={18} />
          Apply Filters
        </Button>

      </div>
    </div>
  );
}