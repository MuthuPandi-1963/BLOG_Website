import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest, queryClient, type UsersResponse, type StatsResponse } from "@/lib/queryClient";
import Navigation from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Trash2, Users, FileText, Shield, Loader2, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { User } from "@/interfaces/User";

export default function Admin() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState("users");

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      content: "",
      url: "",
      urlToImage: "",
      source: "",
      author: "",
      country: "us",
      category: "general",
    },
  });

  // Redirect to home if not authenticated or not admin
  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !(user as any)?.isAdmin)) {
      toast({
        title: "Unauthorized",
        description: "Admin access required. Redirecting...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
      return;
    }
  }, [isAuthenticated, authLoading, user, toast]);

  const { data: usersData, isLoading: usersLoading } = useQuery<UsersResponse>({
    queryKey: ["/api/admin/users"],
    enabled: !!(user as any)?.isAdmin,
    retry: false,
  });

  const { data: statsData } = useQuery<StatsResponse>({
    queryKey: ["/api/stats/countries"],
    enabled: !!(user as any)?.isAdmin,
    retry: false,
  });

  const createArticleMutation = useMutation({
    mutationFn: async (data) => {
      return await apiRequest("POST", "/api/admin/articles", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/news"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats/countries"] });
      form.reset();
      toast({
        title: "Success",
        description: "Article created successfully",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to create article",
        variant: "destructive",
      });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      await apiRequest("DELETE", `/api/admin/users/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    },
  });

  const handleDeleteUser = (userId: string) => {
    if (confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      deleteUserMutation.mutate(userId);
    }
  };

  const onSubmit = (data : any) => {
    console.log('Form submitted with data:', data);
    createArticleMutation.mutate(data);
  };

  const COUNTRIES = [
    { code: "us", name: "United States" },
    { code: "gb", name: "United Kingdom" }, 
    { code: "de", name: "Germany" },
    { code: "fr", name: "France" },
    { code: "jp", name: "Japan" },
    { code: "ca", name: "Canada" },
    { code: "au", name: "Australia" },
    { code: "in", name: "India" },
    { code: "br", name: "Brazil" },
    { code: "it", name: "Italy" },
    { code: "es", name: "Spain" },
    { code: "mx", name: "Mexico" },
  ];

  const CATEGORIES = [
    "general",
    "business", 
    "technology",
    "health",
    "science",
    "sports",
    "entertainment",
  ];

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-news-blue" />
      </div>
    );
  }

  if (!(user as any)?.isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h1>
            <p className="text-gray-600">You don't have admin privileges.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-news-gray mb-2" data-testid="text-admin-title">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">Manage users, content, and monitor platform statistics.</p>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4" data-testid="tabs-admin">
            <TabsTrigger value="users" data-testid="tab-users">
              <Users className="w-4 h-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="add-news" data-testid="tab-add-news">
              <Plus className="w-4 h-4 mr-2" />
              Add News
            </TabsTrigger>
            <TabsTrigger value="content" data-testid="tab-content">
              <FileText className="w-4 h-4 mr-2" />
              Content
            </TabsTrigger>
            <TabsTrigger value="stats" data-testid="tab-stats">
              <Shield className="w-4 h-4 mr-2" />
              Statistics
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="flex justify-center py-8" data-testid="loading-users">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-4" data-testid="users-list">
                    {usersData?.users?.map((userData: User) => (
                      <div 
                        key={userData.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                        data-testid={`user-row-${userData.id}`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-news-blue rounded-full flex items-center justify-center text-white font-semibold">
                            {userData.firstName?.[0]?.toUpperCase() || userData.email?.[0]?.toUpperCase() || 'U'}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium" data-testid={`text-username-${userData.id}`}>
                                {userData.firstName && userData.lastName 
                                  ? `${userData.firstName} ${userData.lastName}`
                                  : userData.email
                                }
                              </span>
                              {userData.isAdmin && (
                                <Badge variant="secondary">Admin</Badge>
                              )}
                            </div>
                            <span className="text-sm text-gray-500">{userData.email}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-400">
                            Joined {userData.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'Unknown'}
                          </span>
                          {userData.id !== (user as any)?.id && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteUser(userData.id)}
                              disabled={deleteUserMutation.isPending}
                              data-testid={`button-delete-user-${userData.id}`}
                            >
                              {deleteUserMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {usersData?.users?.length === 0 && (
                      <div className="text-center py-8 text-gray-500" data-testid="empty-users">
                        No users found.
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Add News Tab */}
          <TabsContent value="add-news" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add News Article</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" data-testid="form-add-article">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Article title" {...field} data-testid="input-title" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="source"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Source</FormLabel>
                            <FormControl>
                              <Input placeholder="News source" {...field} data-testid="input-source" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Brief description of the article" 
                              className="min-h-[100px]"
                              {...field}
                              value={field.value || ""}
                              data-testid="textarea-description"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Content</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Full article content" 
                              className="min-h-[200px]"
                              {...field}
                              value={field.value || ""}
                              data-testid="textarea-content"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="url"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Article URL</FormLabel>
                            <FormControl>
                              <Input placeholder="https://example.com/article" {...field} data-testid="input-url" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="urlToImage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Image URL</FormLabel>
                            <FormControl>
                              <Input placeholder="https://example.com/image.jpg" {...field} value={field.value || ""} data-testid="input-image-url" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FormField
                        control={form.control}
                        name="author"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Author</FormLabel>
                            <FormControl>
                              <Input placeholder="Author name" {...field} value={field.value || ""} data-testid="input-author" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value || "us"} defaultValue="us">
                              <FormControl>
                                <SelectTrigger data-testid="select-country">
                                  <SelectValue placeholder="Select country" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {COUNTRIES.map((country) => (
                                  <SelectItem key={country.code} value={country.code}>
                                    {country.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value || "general"} defaultValue="general">
                              <FormControl>
                                <SelectTrigger data-testid="select-category">
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {CATEGORIES.map((category) => (
                                  <SelectItem key={category} value={category}>
                                    {category.charAt(0).toUpperCase() + category.slice(1)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full md:w-auto"
                      disabled={createArticleMutation.isPending}
                      data-testid="button-submit-article"
                    >
                      {createArticleMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating Article...
                        </>
                      ) : (
                        <>
                          <Plus className="mr-2 h-4 w-4" />
                          Create Article
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Content Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500" data-testid="content-management">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>Content management features coming soon.</p>
                  <p className="text-sm mt-2">
                    This section will allow you to moderate articles and manage reported content.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="stats" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-news-blue" data-testid="stat-total-users">
                    {usersData?.users?.length || 0}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Admin Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-news-green" data-testid="stat-admin-users">
                    {usersData?.users?.filter((u: User) => u.isAdmin).length || 0}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Countries Covered</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600" data-testid="stat-countries">
                    {statsData?.stats?.length || 0}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Country Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Articles by Country</CardTitle>
              </CardHeader>
              <CardContent>
                {statsData?.stats?.length > 0 ? (
                  <div className="space-y-3" data-testid="country-stats">
                    {statsData.stats?.map((stat: { country: string; count: number }) => (
                      <div 
                        key={stat.country}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                        data-testid={`country-stat-${stat.country}`}
                      >
                        <span className="font-medium">{stat.country}</span>
                        <Badge variant="outline">{stat.count} articles</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500" data-testid="empty-stats">
                    No statistics available yet.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
