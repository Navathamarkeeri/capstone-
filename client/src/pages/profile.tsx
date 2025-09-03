import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function Profile() {
  const [, setLocation] = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@email.com",
    university: "University of Technology",
    major: "Computer Science",
    graduationYear: "2024",
    gpa: "3.7",
    bio: "Passionate computer science student with experience in web development and machine learning. Looking for internship opportunities to apply my skills and learn from industry professionals.",
    skills: ["JavaScript", "Python", "React", "Node.js", "Machine Learning", "Git"]
  });

  const { data: resumes = [] } = useQuery({
    queryKey: ['/api/resumes'],
    queryFn: async () => {
      const response = await fetch('/api/resumes?userId=default-user');
      if (!response.ok) throw new Error('Failed to fetch resumes');
      return response.json();
    },
  });

  const handleSave = () => {
    // In a real app, this would save to the backend
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleViewResume = (resumeId: string) => {
    // In a real app, this would open the resume in a viewer
    alert(`Opening resume ${resumeId}`);
  };

  const handleDownloadResume = (resumeId: string, fileName: string) => {
    // In a real app, this would download the resume file
    alert(`Downloading ${fileName}`);
  };

  const scrollToUploadSection = () => {
    setLocation('/');
    setTimeout(() => {
      const uploadSection = document.getElementById('resume-upload-section');
      uploadSection?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="py-16 min-h-screen bg-muted/30" data-testid="page-profile">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-foreground mb-4" data-testid="title-profile">
              My Profile
            </h1>
            <p className="text-lg text-muted-foreground">
              Manage your personal information and preferences
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Info */}
            <div className="lg:col-span-2 space-y-6">
              <Card data-testid="card-personal-info">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Personal Information</CardTitle>
                  <Button 
                    variant={isEditing ? "default" : "outline"}
                    onClick={isEditing ? handleSave : () => setIsEditing(true)}
                    data-testid="button-edit-profile"
                  >
                    {isEditing ? (
                      <>
                        <i className="fas fa-save mr-2"></i>
                        Save Changes
                      </>
                    ) : (
                      <>
                        <i className="fas fa-edit mr-2"></i>
                        Edit Profile
                      </>
                    )}
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={profileData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        disabled={!isEditing}
                        data-testid="input-first-name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={profileData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        disabled={!isEditing}
                        data-testid="input-last-name"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      disabled={!isEditing}
                      data-testid="input-email"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="university">University</Label>
                      <Input
                        id="university"
                        value={profileData.university}
                        onChange={(e) => handleInputChange('university', e.target.value)}
                        disabled={!isEditing}
                        data-testid="input-university"
                      />
                    </div>
                    <div>
                      <Label htmlFor="major">Major</Label>
                      <Input
                        id="major"
                        value={profileData.major}
                        onChange={(e) => handleInputChange('major', e.target.value)}
                        disabled={!isEditing}
                        data-testid="input-major"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="graduationYear">Graduation Year</Label>
                      <Input
                        id="graduationYear"
                        value={profileData.graduationYear}
                        onChange={(e) => handleInputChange('graduationYear', e.target.value)}
                        disabled={!isEditing}
                        data-testid="input-graduation-year"
                      />
                    </div>
                    <div>
                      <Label htmlFor="gpa">GPA</Label>
                      <Input
                        id="gpa"
                        value={profileData.gpa}
                        onChange={(e) => handleInputChange('gpa', e.target.value)}
                        disabled={!isEditing}
                        data-testid="input-gpa"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      disabled={!isEditing}
                      rows={4}
                      data-testid="textarea-bio"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Uploaded Resumes */}
              <Card data-testid="card-resumes">
                <CardHeader>
                  <CardTitle>My Resumes</CardTitle>
                </CardHeader>
                <CardContent>
                  {resumes.length === 0 ? (
                    <div className="text-center py-8">
                      <i className="fas fa-file-pdf text-4xl text-muted-foreground mb-4"></i>
                      <p className="text-muted-foreground">No resumes uploaded yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {resumes.map((resume: any) => (
                        <div key={resume.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <i className="fas fa-file-pdf text-red-500 text-xl"></i>
                            <div>
                              <p className="font-medium" data-testid={`text-resume-name-${resume.id}`}>
                                {resume.fileName}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                ATS Score: {resume.analysisScore}% • 
                                Uploaded {new Date(resume.uploadedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleViewResume(resume.id)}
                              data-testid={`button-view-resume-${resume.id}`}
                            >
                              <i className="fas fa-eye mr-1"></i>
                              View
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDownloadResume(resume.id, resume.fileName)}
                              data-testid={`button-download-resume-${resume.id}`}
                            >
                              <i className="fas fa-download mr-1"></i>
                              Download
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Profile Sidebar */}
            <div className="space-y-6">
              <Card data-testid="card-profile-summary">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Avatar className="w-24 h-24 mx-auto mb-4">
                      <AvatarImage src="/api/placeholder/150/150" />
                      <AvatarFallback className="text-2xl">
                        {profileData.firstName[0]}{profileData.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-semibold" data-testid="text-profile-name">
                      {profileData.firstName} {profileData.lastName}
                    </h3>
                    <p className="text-muted-foreground" data-testid="text-profile-major">
                      {profileData.major} Student
                    </p>
                    <p className="text-sm text-muted-foreground" data-testid="text-profile-university">
                      {profileData.university}
                    </p>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">GPA</span>
                      <span className="font-medium">{profileData.gpa}/4.0</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Graduation</span>
                      <span className="font-medium">{profileData.graduationYear}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Resumes</span>
                      <span className="font-medium">{resumes.length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card data-testid="card-skills">
                <CardHeader>
                  <CardTitle className="text-lg">Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {profileData.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" data-testid={`badge-skill-${skill.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card data-testid="card-quick-actions">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start" 
                    onClick={scrollToUploadSection}
                    data-testid="button-upload-new-resume"
                  >
                    <i className="fas fa-upload mr-2"></i>
                    Upload New Resume
                  </Button>
                  <Link href="/applications">
                    <Button variant="outline" className="w-full justify-start" data-testid="button-view-applications">
                      <i className="fas fa-list mr-2"></i>
                      View Applications
                    </Button>
                  </Link>
                  <Link href="/jobs">
                    <Button variant="outline" className="w-full justify-start" data-testid="button-browse-jobs">
                      <i className="fas fa-search mr-2"></i>
                      Browse Jobs
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}