import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Droplet, MapPin, Search, Phone, Mail, Calendar } from "lucide-react"

export function DonorSearch() {
  const [location, setLocation] = useState("")
  const [distance, setDistance] = useState([25])
  const [bloodType, setBloodType] = useState("")
  const [urgentOnly, setUrgentOnly] = useState(false)
  const [searchType, setSearchType] = useState("donors") 
  const [searchPerformed, setSearchPerformed] = useState(false)

  const handleSearch = () => {
    setSearchPerformed(true)
  }

  // Mock data for donors
  const mockDonors = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      bloodType: "O-",
      distance: 2.5,
      lastDonation: "3 tháng trước",
      location: "Quận 1",
      contactEmail: "nguyenvana@example.com",
      contactPhone: "0909090909",
      available: true,
    },
    {
      id: 2,
      name: "Michael Chen",
      bloodType: "A+",
      distance: 4.8,
      lastDonation: "5 tháng trước",
      location: "Westside",
      contactEmail: "m.chen@example.com",
      contactPhone: "555-987-6543",
      available: true,
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      bloodType: "B+",
      distance: 7.2,
      lastDonation: "2 tháng trước",
      location: "Quận 2",
      contactEmail: "e.rodriguez@example.com",
      contactPhone: "555-456-7890",
      available: false,
    },
    {
      id: 4,
      name: "David Kim",
      bloodType: "AB+",
      distance: 10.5,
      lastDonation: "6 tháng trước",
      location: "Quận 3",
      contactEmail: "d.kim@example.com",
      contactPhone: "555-234-5678",
      available: true,
    },
    {
      id: 5,
      name: "Lisa Patel",
      bloodType: "O+",
      distance: 15.3,
      lastDonation: "4 tháng trước",
      location: "Quận 4",
      contactEmail: "l.patel@example.com",
      contactPhone: "555-345-6789",
      available: true,
    },
  ]

  // Mock data for recipients
  const mockRecipients = [
    {
      id: 1,
      name: "Nguyễn Văn B",
      bloodType: "AB-",
      distance: 3.2,
      urgency: "High",
      location: "Quận 5",
      contactEmail: "nguyenvanb@example.com",
      contactPhone: "0909090909",
      neededBy: "Tomorrow",
    },
    {
      id: 2,
      name: "Nguyễn Văn C",
      bloodType: "O+",
      distance: 5.7,
      urgency: "Medium",
      location: "Quận 6",
      contactEmail: "nguyenvanc@example.com",
      contactPhone: "0909090909",
      neededBy: "This week",
    },
    {
      id: 3,
      name: "Nguyễn Văn D",
      bloodType: "B-",
      distance: 8.9,
      urgency: "High",
      location: "Quận 7",
      contactEmail: "nguyenvand@example.com",
      contactPhone: "0909090909",
      neededBy: "Today",
    },
    {
      id: 4,
      name: "Nguyễn Văn E",
      bloodType: "A+",
      distance: 12.4,
      urgency: "Low",
      location: "Quận 8",
      contactEmail: "nguyenvane@example.com",
      contactPhone: "0909090909",
      neededBy: "Next week",
    },
  ]

  // Filter results based on search criteria
  const filteredDonors = mockDonors.filter((donor) => {
    return (
      donor.distance <= distance[0] &&
      (bloodType === "" || donor.bloodType === bloodType) &&
      (!urgentOnly || donor.available)
    )
  })

  const filteredRecipients = mockRecipients.filter((recipient) => {
    return (
      recipient.distance <= distance[0] &&
      (bloodType === "" || recipient.bloodType === bloodType) &&
      (!urgentOnly || recipient.urgency === "High")
    )
  })

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="search-type">Tìm kiếm</Label>
          <Select value={searchType} onValueChange={setSearchType}>
            <SelectTrigger id="search-type" className="mt-1.5">
              <SelectValue placeholder="Chọn loại tìm kiếm" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="donors">Người hiến máu</SelectItem>
              <SelectItem value="recipients">Người cần máu</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="blood-type">Loại máu</Label>
          <Select value={bloodType} onValueChange={setBloodType}>
            <SelectTrigger id="blood-type" className="mt-1.5">
              <SelectValue placeholder="Bất kỳ loại máu" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Bất kỳ</SelectItem>
              <SelectItem value="A+">A+</SelectItem>
              <SelectItem value="A-">A-</SelectItem>
              <SelectItem value="B+">B+</SelectItem>
              <SelectItem value="B-">B-</SelectItem>
              <SelectItem value="AB+">AB+</SelectItem>
              <SelectItem value="AB-">AB-</SelectItem>
              <SelectItem value="O+">O+</SelectItem>
              <SelectItem value="O-">O-</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Vị trí của bạn</Label>
        <Input
          id="location"
          placeholder="Nhập tên thành phố hoặc mã bưu điện"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Khoảng cách tối đa</Label>
          <span className="text-sm font-medium">{distance[0]} km</span>
        </div>
        <Slider min={1} max={100} step={1} value={distance} onValueChange={setDistance} />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>1 km</span>
          <span>50 km</span>
          <span>100 km</span>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="urgent-only" checked={urgentOnly} onCheckedChange={(checked) => setUrgentOnly(!!checked)} />
        <Label
          htmlFor="urgent-only"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {searchType === "donors" ? "Chỉ hiển thị người có thể hiến máu" : "Chỉ hiển thị người cần máu"}
        </Label>
      </div>

      <div className="flex justify-center">
        <Button onClick={handleSearch} disabled={!location}>
          <Search className="mr-2 h-4 w-4" />
          {searchType === "donors" ? "Tìm người hiến máu" : "Tìm người cần máu"}
        </Button>
      </div>

      {searchPerformed && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">
            {searchType === "donors"
              ? `Tìm thấy ${filteredDonors.length} người hiến máu trong khoảng ${distance[0]} km`
              : `Tìm thấy ${filteredRecipients.length} người cần máu trong khoảng ${distance[0]} km`}
          </h3>

          {searchType === "donors" ? (
            filteredDonors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredDonors.map((donor) => (
                  <Card key={donor.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src="/placeholder.svg" alt={donor.name} />
                          <AvatarFallback>
                            {donor.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h4 className="font-medium">{donor.name}</h4>
                            <Badge className="bg-red-50 text-red-700 border-red-200">
                              <Droplet className="mr-1 h-3 w-3" />
                              {donor.bloodType}
                            </Badge>
                          </div>
                          <div className="mt-2 space-y-1 text-sm">
                            <div className="flex items-center text-muted-foreground">
                              <MapPin className="mr-1 h-3 w-3" />
                              {donor.location} ({donor.distance} km away)
                            </div>
                            <div className="flex items-center text-muted-foreground">
                              <Calendar className="mr-1 h-3 w-3" />
                              Last donation: {donor.lastDonation}
                            </div>
                          </div>
                          <div className="mt-4 pt-4 border-t flex justify-between items-center">
                            <div className="flex gap-3">
                              <Button variant="outline" size="sm" className="h-8">
                                <Phone className="mr-1 h-3 w-3" />
                                Contact
                              </Button>
                              <Button variant="outline" size="sm" className="h-8">
                                <Mail className="mr-1 h-3 w-3" />
                                Message
                              </Button>
                            </div>
                            <Badge
                              variant={donor.available ? "outline" : "secondary"}
                              className={donor.available ? "bg-green-50 text-green-700 border-green-200" : ""}
                            >
                              {donor.available ? "Available" : "Unavailable"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center p-8 border rounded-lg">
                <p className="text-muted-foreground">Không tìm thấy người hiến máu phù hợp.</p>
                <p className="mt-2">Thử điều chỉnh tham số tìm kiếm.</p>
              </div>
            )
          ) : filteredRecipients.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredRecipients.map((recipient) => (
                <Card key={recipient.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src="/placeholder.svg" alt={recipient.name} />
                        <AvatarFallback>
                          {recipient.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className="font-medium">{recipient.name}</h4>
                          <Badge className="bg-red-50 text-red-700 border-red-200">
                            <Droplet className="mr-1 h-3 w-3" />
                            {recipient.bloodType}
                          </Badge>
                        </div>
                        <div className="mt-2 space-y-1 text-sm">
                          <div className="flex items-center text-muted-foreground">
                            <MapPin className="mr-1 h-3 w-3" />
                            {recipient.location} ({recipient.distance} km)
                          </div>
                          <div className="flex items-center text-muted-foreground">
                            <Calendar className="mr-1 h-3 w-3" />
                            Needed by: {recipient.neededBy}
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t flex justify-between items-center">
                          <div className="flex gap-3">
                            <Button variant="outline" size="sm" className="h-8">
                              <Phone className="mr-1 h-3 w-3" />
                              Contact
                            </Button>
                            <Button variant="outline" size="sm" className="h-8">
                              <Mail className="mr-1 h-3 w-3" />
                              Message
                            </Button>
                          </div>
                          <Badge
                            variant={recipient.urgency === "High" ? "default" : "outline"}
                            className={
                              recipient.urgency === "High"
                                ? "bg-red-500"
                                : recipient.urgency === "Medium"
                                  ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                  : "bg-blue-50 text-blue-700 border-blue-200"
                            }
                          >
                            {recipient.urgency} Urgency
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center p-8 border rounded-lg">
              <p className="text-muted-foreground">Không tìm thấy người cần máu phù hợp.</p>
              <p className="mt-2">Thử điều chỉnh tham số tìm kiếm.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
