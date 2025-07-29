"use client"

import { useState } from "react"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  MoreHorizontal,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  Download,
  Filter,
  TrendingUp,
} from "lucide-react"
import { handleLogout } from "@/utils/auth"

const sidebarItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Services", url: "/services", icon: Package },
  { title: "Bookings", url: "/bookings", icon: Calendar },
  { title: "Customers", url: "/customers", icon: Users },
  { title: "Payments", url: "/payments", icon: CreditCard, active: true },
  { title: "Inventory", url: "/inventory", icon: Warehouse },
  { title: "Reports", url: "/reports", icon: BookOpen },
  { title: "Settings", url: "/settings", icon: Settings },
]

function AppSidebar() {
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
                    <AvatarImage src="/placeholder.svg?height=24&width=24" />
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

export default function PaymentsPage() {
  const [payments, setPayments] = useState([
    {
      id: "PAY001",
      bookingId: "BK001",
      customer: "Alice Johnson",
      service: "Premium Car Wash",
      amount: 89.99,
      method: "Credit Card",
      status: "completed",
      date: "2024-01-15",
      stripeId: "pi_1234567890",
      fee: 2.89,
    },
    {
      id: "PAY002",
      bookingId: "BK002",
      customer: "Bob Smith",
      service: "Home Cleaning",
      amount: 149.99,
      method: "PayPal",
      status: "pending",
      date: "2024-01-15",
      stripeId: "pi_0987654321",
      fee: 4.35,
    },
    {
      id: "PAY003",
      bookingId: "BK003",
      customer: "Carol Davis",
      service: "Garden Maintenance",
      amount: 199.99,
      method: "Bank Transfer",
      status: "completed",
      date: "2024-01-14",
      stripeId: "pi_1122334455",
      fee: 5.99,
    },
    {
      id: "PAY004",
      bookingId: "BK004",
      customer: "David Wilson",
      service: "Pet Grooming",
      amount: 79.99,
      method: "Credit Card",
      status: "failed",
      date: "2024-01-13",
      stripeId: "pi_5566778899",
      fee: 2.32,
    },
  ])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "refunded":
        return <AlertCircle className="h-4 w-4 text-blue-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "default"
      case "pending":
        return "outline"
      case "failed":
        return "destructive"
      case "refunded":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex flex-1 items-center gap-2">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search payments..." className="pl-8" />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="@johndoe" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">John Doe</p>
                    <p className="text-xs leading-none text-muted-foreground">john@example.com</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={()=>handleLogout()}>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 space-y-6 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
              <p className="text-muted-foreground">Track payments, process refunds, and manage Stripe integration</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Process Payment
              </Button>
            </div>
          </div>

          {/* Payment Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  $
                  {payments
                    .filter((p) => p.status === "completed")
                    .reduce((sum, p) => sum + p.amount, 0)
                    .toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground flex items-center">
                  <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                  <span className="text-green-600">+12.5%</span> from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Successful Payments</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{payments.filter((p) => p.status === "completed").length}</div>
                <p className="text-xs text-muted-foreground">
                  {((payments.filter((p) => p.status === "completed").length / payments.length) * 100).toFixed(1)}%
                  success rate
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
                <Clock className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{payments.filter((p) => p.status === "pending").length}</div>
                <p className="text-xs text-muted-foreground">
                  $
                  {payments
                    .filter((p) => p.status === "pending")
                    .reduce((sum, p) => sum + p.amount, 0)
                    .toFixed(2)}{" "}
                  pending
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Processing Fees</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${payments.reduce((sum, p) => sum + p.fee, 0).toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Stripe & payment fees</p>
              </CardContent>
            </Card>
          </div>

          {/* Payment Management */}
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All Payments</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="failed">Failed</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Payment History</CardTitle>
                  <CardDescription>Complete transaction history and payment details</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Payment ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell className="font-medium">{payment.id}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>
                                  {payment.customer
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{payment.customer}</div>
                                <div className="text-sm text-muted-foreground">Booking: {payment.bookingId}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{payment.service}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">${payment.amount}</div>
                              <div className="text-sm text-muted-foreground">Fee: ${payment.fee}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{payment.method}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(payment.status)}
                              <Badge variant={getStatusVariant(payment.status)}>{payment.status}</Badge>
                            </div>
                          </TableCell>
                          <TableCell>{payment.date}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>View details</DropdownMenuItem>
                                <DropdownMenuItem>View in Stripe</DropdownMenuItem>
                                <DropdownMenuItem>Send receipt</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {payment.status === "completed" && (
                                  <DropdownMenuItem className="text-red-600">Process refund</DropdownMenuItem>
                                )}
                                {payment.status === "failed" && <DropdownMenuItem>Retry payment</DropdownMenuItem>}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Completed Payments</CardTitle>
                  <CardDescription>Successfully processed payments and transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {payments
                      .filter((p) => p.status === "completed")
                      .map((payment) => (
                        <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <div>
                              <p className="font-medium">{payment.customer}</p>
                              <p className="text-sm text-muted-foreground">{payment.service}</p>
                              <p className="text-xs text-muted-foreground">
                                {payment.method} • {payment.date}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-green-600">${payment.amount}</p>
                            <p className="text-xs text-muted-foreground">Fee: ${payment.fee}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pending" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Payments</CardTitle>
                  <CardDescription>Payments awaiting processing or confirmation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {payments
                      .filter((p) => p.status === "pending")
                      .map((payment) => (
                        <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <Clock className="h-5 w-5 text-yellow-500" />
                            <div>
                              <p className="font-medium">{payment.customer}</p>
                              <p className="text-sm text-muted-foreground">{payment.service}</p>
                              <p className="text-xs text-muted-foreground">
                                {payment.method} • {payment.date}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className="font-medium">${payment.amount}</p>
                              <p className="text-xs text-muted-foreground">Processing...</p>
                            </div>
                            <Button size="sm" variant="outline">
                              Check Status
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="failed" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Failed Payments</CardTitle>
                  <CardDescription>Payments that failed processing and need attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {payments
                      .filter((p) => p.status === "failed")
                      .map((payment) => (
                        <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <XCircle className="h-5 w-5 text-red-500" />
                            <div>
                              <p className="font-medium">{payment.customer}</p>
                              <p className="text-sm text-muted-foreground">{payment.service}</p>
                              <p className="text-xs text-muted-foreground">
                                {payment.method} • {payment.date}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className="font-medium text-red-600">${payment.amount}</p>
                              <p className="text-xs text-muted-foreground">Payment failed</p>
                            </div>
                            <Button size="sm">Retry Payment</Button>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Stripe Integration Status */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Integration</CardTitle>
              <CardDescription>Stripe payment processing status and configuration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="font-medium">Stripe Connected</span>
                    </div>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="font-medium">Webhooks Configured</span>
                    </div>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="font-medium">SSL Certificate</span>
                    </div>
                    <Badge variant="default">Valid</Badge>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Processing Fee</span>
                    <span className="font-medium">2.9% + $0.30</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Payout Schedule</span>
                    <span className="font-medium">Daily</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Next Payout</span>
                    <span className="font-medium">Tomorrow</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
