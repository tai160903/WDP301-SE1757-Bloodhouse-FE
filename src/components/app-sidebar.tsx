import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarTrigger,
    SidebarSeparator,
  } from "./ui/sidebar"
  import {
    BarChart3,
    Calendar,
    Droplet,
    FileText,
    Heart,
    Home,
    LogOut,
    MapPin,
    Search,
    Settings,
    User,
    Users,
    BookOpen,
    Bell,
    HelpCircle,
    ClipboardList,
    Activity,
    Layers,
    UserCheck,
    AlertCircle,
    ShieldCheck,
  } from "lucide-react"
  import { Link } from "react-router-dom"
  import { Button } from "./ui/button"
  import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "./ui/dropdown-menu"
  import { Badge } from "./ui/badge"

export function AppSidebar() {
  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader className="flex items-center p-4">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-2 rounded-full">
            <Droplet className="h-6 w-6 text-primary" />
          </div>
          <span className="font-bold text-lg">BloodHouse</span>
        </div>
        <SidebarTrigger className="ml-auto md:hidden" />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Chính</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/" className="flex items-center gap-2">
                    <Home className="h-4 w-4 shrink-0" />
                    <span>Trang chủ</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/donate" className="flex items-center gap-2">
                    <Heart className="h-4 w-4 shrink-0 text-red-500" />
                    <span>Hiến máu</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Các menu items khác tương tự, thay href bằng to */}
              
              {/* ... */}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Các SidebarGroup khác */}
        
        {/* ... */}
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="p-0 hover:bg-transparent">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/images/avatar.jpg" alt="@johndoe" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center gap-2 cursor-pointer">
                    <User className="h-4 w-4" />
                    <span>Hồ sơ</span>
                  </Link>
                </DropdownMenuItem>
                {/* Các dropdown menu items khác */}
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="hidden md:block">
              <p className="text-sm font-medium">Nguyễn Văn A</p>
              <p className="text-xs text-muted-foreground">Người hiến máu</p>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}