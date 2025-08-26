import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Users, FileText, Shield, Plus } from "lucide-react";
import Navigation from "../components/ui/navigation";

export default function Admin() {
  const [selectedTab, setSelectedTab] = useState("users");

  // Mock data
  const users = [
    { id: "1", firstName: "Alice", lastName: "Johnson", email: "alice@example.com", isAdmin: true, createdAt: "2024-01-15" },
    { id: "2", firstName: "Bob", lastName: "Smith", email: "bob@example.com", isAdmin: false, createdAt: "2024-03-10" },
  ];

  const stats = [
    { country: "United States", count: 12 },
    { country: "India", count: 8 },
    { country: "Germany", count: 5 },
  ];

  const COUNTRIES = [
    { code: "us", name: "United States" },
    { code: "gb", name: "United Kingdom" },
    { code: "in", name: "India" },
  ];

  const CATEGORIES = ["general", "business", "technology", "sports"];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-news-gray mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage users, content, and monitor platform statistics.</p>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">
              <Users className="w-4 h-4 mr-2" /> Users
            </TabsTrigger>
            <TabsTrigger value="add-news">
              <Plus className="w-4 h-4 mr-2" /> Add News
            </TabsTrigger>
            <TabsTrigger value="content">
              <FileText className="w-4 h-4 mr-2" /> Content
            </TabsTrigger>
            <TabsTrigger value="stats">
              <Shield className="w-4 h-4 mr-2" /> Statistics
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((u) => (
                    <div key={u.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-news-blue rounded-full flex items-center justify-center text-white font-semibold">
                          {u.firstName[0]}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">
                              {u.firstName} {u.lastName}
                            </span>
                            {u.isAdmin && <Badge variant="secondary">Admin</Badge>}
                          </div>
                          <span className="text-sm text-gray-500">{u.email}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-400">Joined {new Date(u.createdAt).toLocaleDateString()}</span>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
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
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label>Title</Label>
                      <Input placeholder="Article title" />
                    </div>
                    <div>
                      <Label>Source</Label>
                      <Input placeholder="News source" />
                    </div>
                  </div>

                  <div>
                    <Label>Description</Label>
                    <Textarea placeholder="Brief description of the article" className="min-h-[100px]" />
                  </div>

                  <div>
                    <Label>Content</Label>
                    <Textarea placeholder="Full article content" className="min-h-[200px]" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label>Article URL</Label>
                      <Input placeholder="https://example.com/article" />
                    </div>
                    <div>
                      <Label>Image URL</Label>
                      <Input placeholder="https://example.com/image.jpg" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <Label>Author</Label>
                      <Input placeholder="Author name" />
                    </div>
                    <div>
                      <Label>Country</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          {COUNTRIES.map((c) => (
                            <SelectItem key={c.code} value={c.code}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Category</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button type="submit" className="w-full md:w-auto">
                    <Plus className="mr-2 h-4 w-4" /> Create Article
                  </Button>
                </form>
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
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>Content management features coming soon.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-news-blue">{users.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Admin Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-news-green">
                    {users.filter((u) => u.isAdmin).length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Countries Covered</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600">{stats.length}</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Articles by Country</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.map((s) => (
                    <div key={s.country} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">{s.country}</span>
                      <Badge variant="outline">{s.count} articles</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
