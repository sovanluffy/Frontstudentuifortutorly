import { Button } from '../components/figma/ui/button';
import { Input } from '../components/figma/ui/input';
import { Label } from '../components/figma/ui/label';
import { User, Mail, Phone, MapPin, Edit } from 'lucide-react';

export function Profile() {
  return (
    <div className="min-h-screen pb-20 md:pb-8">
      <div className="bg-gradient-to-r from-indigo-50 to-cyan-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="mb-2">My Profile</h1>
          <p className="text-muted-foreground">Manage your account settings</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-card rounded-lg border border-border p-6 mb-6">
            <div className="flex items-center gap-6 mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-400 to-cyan-400 rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="mb-1">John Student</h3>
                <p className="text-sm text-muted-foreground">
                  Student Account
                </p>
              </div>
              <Button variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Edit Photo
              </Button>
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border p-6 space-y-6">
            <h3 className="mb-4">Personal Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="mb-2 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name
                </Label>
                <Input defaultValue="John Student" />
              </div>

              <div>
                <Label className="mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </Label>
                <Input type="email" defaultValue="john@example.com" />
              </div>

              <div>
                <Label className="mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </Label>
                <Input type="tel" defaultValue="+1 234 567 8900" />
              </div>

              <div>
                <Label className="mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Location
                </Label>
                <Input defaultValue="New York, NY" />
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-border">
              <Button>Save Changes</Button>
              <Button variant="outline">Cancel</Button>
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border p-6 mt-6">
            <h3 className="mb-4">Learning Preferences</h3>
            <div className="space-y-4">
              <div>
                <Label className="mb-2 block">Subjects of Interest</Label>
                <Input defaultValue="Math, Programming, English" />
              </div>
              <div>
                <Label className="mb-2 block">Preferred Learning Mode</Label>
                <Input defaultValue="Online" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
