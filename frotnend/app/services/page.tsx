"use client"

import { useEffect, useState } from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { SidebarInset } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Calendar,
  Users,
  DollarSign,
  Package,
  Settings,
  Home,
  BookOpen,
  CreditCard,
  Warehouse,
  Bell,
  Search,
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  Star,
  Clock,
} from "lucide-react"
import { handleLogout } from "@/utils/auth"
import { BACKEND_URL } from "@/config"
import { toast } from "sonner";
import { EditServiceDialog } from "./EditServiceDialog"
import { useDebounce } from "@/utils/search"

import { useRouter } from "next/navigation"
import { useUser } from "@/utils/isAdmin"
import Header from "@/components/dashboard/layouts/Header"







const sidebarItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Services", url: "/services", icon: Package },
  { title: "Bookings", url: "/bookings", icon: Calendar },
  // { title: "Customers", url: "/customers", icon: Users },
  // { title: "Payments", url: "/payments", icon: CreditCard },
  { title: "Dashboard", url: "/dashboard", icon: Warehouse },
  // { title: "Reports", url: "/reports", icon: BookOpen },
  // { title: "Settings", url: "/settings", icon: Settings },
]



function AppSidebar() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);


  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div className="flex items-center gap-2">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Calendar className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">BookingPro</span>
                  <span className="truncate text-xs">Service Management</span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={item.active}>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="/placeholder.jpg?height=24&width=24" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <span>John Doe</span>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [serviceToEdit, setServiceToEdit] = useState<any | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);

  const user = useUser();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user === null) return;

    if (user?.data?.role === "admin") {
      console.log("User is admin:", user.data.role);

      setIsAdmin(true);
    } else {
      setIsAdmin(false);
      return router.push("/unauthorized");
    }

    setLoading(false);
  }, [user, router]);


  function openEditDialog(service: any) {
    setServiceToEdit(service);
    setIsEditDialogOpen(true);
  }


  // Define fetchServices inside the component
  async function fetchServices(page = 1, search = searchQuery) {
    try {
      const res = await fetch(
        `${BACKEND_URL}api/services?paginate_count=10&page=${page}&search=${search}`
      );
      if (!res.ok) throw new Error("Failed to fetch services");

      const json = await res.json();
      const services = json.data?.data || [];
      setServices(services);

      setTotalPages(json.data?.last_page || 1);
      setCurrentPage(json.data?.current_page || 1);
    } catch (error) {
      console.error("Error fetching services:", error);
      setServices([]);
    }
  }
  // Define openEditDialog inside the component

  useEffect(() => {
    // When the debounced search term changes, fetch services
    if (debouncedSearch.trim() !== "") {
      fetchServices(1, debouncedSearch);
    } else {
      fetchServices(1); // fetch default services if search is empty
    }
  }, [debouncedSearch]);


  // Define createService inside the component
  async function createService(formData: FormData) {
    try {
      const token = localStorage.getItem("token");
      console.log(token);

      const res = await fetch(`${BACKEND_URL}api/services`, {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: formData,
      });

      if (!res.ok) {
        // Read response text (not json) to see error page or message
        const text = await res.text();
        console.error("Create service failed response text:", text);
        throw new Error(`Failed to create service, status: ${res.status}`);
      }

      return await res.json();
    } catch (error) {
      console.error("Create service error:", error);
      throw error;
    }
  }


  useEffect(() => {
    fetchServices();
  }, []);

  async function handleCreateService() {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      if (selectedImage) formData.append("image", selectedImage);

      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(key, value.name, value.size, value.type);
        } else {
          console.log(key, value);
        }
      }

      const response = await createService(formData);
      console.log("Service Created:", response);
      if (response.success) {
        toast.success(response.message || "Service created successfully!");

        await fetchServices();
      } else {
        toast.error(response.message || "Failed to create service");
      }

      setName("");
      setDescription("");
      setPrice("");
      setSelectedImage(null);

      // Close the dialog
      setIsDialogOpen(false);


      await fetchServices();
    } catch (err) {
      console.error("Error creating service:", err);
    }
  }

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${BACKEND_URL}api/services/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ service_id: id }),
      });

      if (!res.ok) throw new Error("Failed to delete");

      console.log("Deleted successfully");

      // 👇 Efficient state update without re-fetching
      setServices(prev => prev.filter(service => service.id !== id));

      toast.success("Service deleted successfully!");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete service");
    }
  };

  const handleStatusChange = async (newStatus: string, id: number) => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("status", newStatus);
      formData.append("id", id.toString());

      const res = await fetch(`${BACKEND_URL}api/services/status-update`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to update status");

      const response = await res.json();
      console.log("Status update response:", response);

      toast.success("Status updated successfully!");

      // Optional: re-fetch or update state manually
      setServices(prev =>
        prev.map(service =>
          service.id === id ? { ...service, status: newStatus } : service
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
              <Header/>
        

        <main className="flex-1 space-y-6 p-6">

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Services</h1>
              <p className="text-muted-foreground">Manage your service offerings and pricing</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Service
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Service</DialogTitle>
                  <DialogDescription>Create a new service offering for your customers.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      placeholder="Service name"
                      className="col-span-3"
                      value={name}
                      onChange={e => setName(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Service description"
                      className="col-span-3"
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="price" className="text-right">
                      Price
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="0.00"
                      className="col-span-3"
                      value={price}
                      onChange={e => setPrice(e.target.value)}
                    />
                  </div>

                  {/* Image Upload */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="image" className="text-right">
                      Image
                    </Label>
                    <div className="col-span-3">
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files?.[0]) setSelectedImage(e.target.files[0]);
                        }}
                      />
                      {/* Preview */}
                      {selectedImage && (
                        <img
                          src={URL.createObjectURL(selectedImage)}
                          alt="Preview"
                          className="mt-2 h-24 w-24 rounded object-cover border"
                        />
                      )}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleCreateService}>Create Service</Button>
                </DialogFooter>
              </DialogContent>

            </Dialog>
          </div>

          {/* Service Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Services</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{services.length}</div>
                <p className="text-xs text-muted-foreground">
                  {services.filter((s) => s.status === "active").length} active services
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Rating</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.8</div>
                <p className="text-xs text-muted-foreground">Across all services</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">123</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$32,450</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+12%</span> from last month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Services Table */}
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>All Services</CardTitle>
                <CardDescription>Manage your service catalog and pricing</CardDescription>
              </div>

              {/* Search Section */}
              <div className="flex items-center w-full sm:w-auto gap-2">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search services..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && fetchServices(1, searchQuery)}
                  />
                </div>
                <Button onClick={() => fetchServices(1, searchQuery)}>Search</Button>
              </div>
            </CardHeader>

            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Image</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{service.name}</div>
                          <div className="text-sm text-muted-foreground">{service.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>${service.price}</TableCell>

                    
<TableCell>
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button
        variant="outline"
        className="text-xs h-7 px-2 py-0 capitalize"
      >
        {service.status}
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem onClick={() => handleStatusChange("active", service.id)}>
        Active
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => handleStatusChange("inactive", service.id)}>
        Inactive
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</TableCell>


                      <TableCell>
                        <img
                          src={service?.image ? `${BACKEND_URL}${service.image}` : "/placeholder.jpg"}
                          alt={service.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        {/* Actions Dropdown */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => openEditDialog(service)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>View bookings</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(service.id)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>


          {isEditDialogOpen && (
            <EditServiceDialog
              open={isEditDialogOpen}
              onOpenChange={setIsEditDialogOpen}
              service={serviceToEdit}
            />
          )}

          {/* pagination */}

          <div className="flex justify-center items-center space-x-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchServices(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>

            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchServices(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>

        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
