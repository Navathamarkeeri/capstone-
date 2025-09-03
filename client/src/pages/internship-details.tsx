import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";
import type { Internship } from "@shared/schema";

export default function InternshipDetails() {
  const [match, params] = useRoute("/internship/:id");
  const internshipId = params?.id;

  const { data: internship, isLoading, error } = useQuery({
    queryKey: [`/api/internships/${internshipId}`],
    queryFn: async () => {
      const response = await fetch(`/api/internships/${internshipId}`);
      if (!response.ok) throw new Error('Failed to fetch internship details');
      return response.json() as Promise<Internship>;
    },
    enabled: !!internshipId,
  });

  if (!match) return null;

  if (isLoading) {
    return (
      <div className="py-16 min-h-screen bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-1/3 mb-6"></div>
              <div className="bg-card rounded-lg p-8">
                <div className="h-6 bg-muted rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-muted rounded w-1/3 mb-6"></div>
                <div className="space-y-2 mb-6">
                  <div className="h-4 bg-muted rounded w-full"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !internship) {
    return (
      <div className="py-16 min-h-screen bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Link href="/jobs">
              <Button variant="ghost" className="mb-6" data-testid="button-back-to-jobs">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Jobs
              </Button>
            </Link>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-destructive mb-4">Internship Not Found</h2>
              <p className="text-muted-foreground">The internship you're looking for doesn't exist or has been removed.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="py-16 min-h-screen bg-muted/30" data-testid="page-internship-details">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Link href="/jobs">
            <Button variant="ghost" className="mb-6" data-testid="button-back-to-jobs">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Jobs
            </Button>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Card data-testid="card-internship-overview">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                        <i className={`${internship.companyLogo || 'fas fa-building'} text-primary text-2xl`}></i>
                      </div>
                      <div>
                        <CardTitle className="text-2xl mb-2" data-testid="text-internship-title">
                          {internship.title}
                        </CardTitle>
                        <p className="text-xl text-muted-foreground" data-testid="text-company-name">
                          {internship.company}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-4">
                    <span className="flex items-center">
                      <i className="fas fa-map-marker-alt mr-2"></i>
                      {internship.location}
                    </span>
                    {internship.duration && (
                      <span className="flex items-center">
                        <i className="fas fa-clock mr-2"></i>
                        {internship.duration}
                      </span>
                    )}
                    {internship.salary && (
                      <span className="flex items-center">
                        <i className="fas fa-dollar-sign mr-2"></i>
                        {internship.salary}
                      </span>
                    )}
                    {internship.isRemote && (
                      <Badge variant="secondary">Remote</Badge>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold mb-3">About This Internship</h4>
                      <p className="text-foreground leading-relaxed" data-testid="text-description">
                        {internship.description}
                      </p>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="text-lg font-semibold mb-3">Requirements</h4>
                      <ul className="space-y-2">
                        {internship.requirements?.map((requirement, index) => (
                          <li key={index} className="flex items-start">
                            <i className="fas fa-check text-green-500 mr-3 mt-1"></i>
                            <span className="text-foreground">{requirement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="text-lg font-semibold mb-3">Required Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {internship.skills?.map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-sm">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card data-testid="card-quick-apply">
                <CardHeader>
                  <CardTitle>Apply Now</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full" size="lg" data-testid="button-apply-now">
                    <i className="fas fa-paper-plane mr-2"></i>
                    Apply for This Position
                  </Button>
                  <Button variant="outline" className="w-full" data-testid="button-save-for-later">
                    <i className="fas fa-bookmark mr-2"></i>
                    Save for Later
                  </Button>
                </CardContent>
              </Card>

              <Card data-testid="card-internship-info">
                <CardHeader>
                  <CardTitle>Internship Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Industry</span>
                    <span className="font-medium">{internship.industry}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-medium">{internship.duration || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Compensation</span>
                    <span className="font-medium">{internship.salary || 'Not disclosed'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Work Type</span>
                    <span className="font-medium">{internship.isRemote ? 'Remote' : 'On-site'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Posted</span>
                    <span className="font-medium">{formatDate(internship.postedAt || new Date())}</span>
                  </div>
                </CardContent>
              </Card>

              <Card data-testid="card-similar-roles">
                <CardHeader>
                  <CardTitle>Similar Roles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Link href="/jobs" className="block">
                      <div className="p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                        <h6 className="font-medium text-sm">View All {internship.industry} Internships</h6>
                        <p className="text-xs text-muted-foreground">Explore more opportunities</p>
                      </div>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}