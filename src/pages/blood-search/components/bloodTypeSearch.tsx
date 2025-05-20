import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Droplet, Search } from "lucide-react"

export function BloodTypeSearch() {
  const [bloodType, setBloodType] = useState<string>("")
  const [rhFactor, setRhFactor] = useState<string>("")
  const [componentType, setComponentType] = useState<string>("whole-blood")
  const [searchPerformed, setSearchPerformed] = useState(false)

  const handleSearch = () => {
    if (bloodType && rhFactor) {
      setSearchPerformed(true)
    }
  }

  // Get compatibility data based on blood type, Rh factor, and component type
  const getCompatibilityData = () => {
    const fullBloodType = `${bloodType}${rhFactor}`

    // Whole Blood Compatibility
    if (componentType === "whole-blood") {
      switch (fullBloodType) {
        case "A+":
          return {
            canDonateTo: ["A+", "AB+"],
            canReceiveFrom: ["A+", "A-", "O+", "O-"],
          }
        case "A-":
          return {
            canDonateTo: ["A+", "A-", "AB+", "AB-"],
            canReceiveFrom: ["A-", "O-"],
          }
        case "B+":
          return {
            canDonateTo: ["B+", "AB+"],
            canReceiveFrom: ["B+", "B-", "O+", "O-"],
          }
        case "B-":
          return {
            canDonateTo: ["B+", "B-", "AB+", "AB-"],
            canReceiveFrom: ["B-", "O-"],
          }
        case "AB+":
          return {
            canDonateTo: ["AB+"],
            canReceiveFrom: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
          }
        case "AB-":
          return {
            canDonateTo: ["AB+", "AB-"],
            canReceiveFrom: ["A-", "B-", "AB-", "O-"],
          }
        case "O+":
          return {
            canDonateTo: ["A+", "B+", "AB+", "O+"],
            canReceiveFrom: ["O+", "O-"],
          }
        case "O-":
          return {
            canDonateTo: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
            canReceiveFrom: ["O-"],
          }
        default:
          return {
            canDonateTo: [],
            canReceiveFrom: [],
          }
      }
    }

    // Red Blood Cells Compatibility (same as whole blood)
    if (componentType === "red-cells") {
      switch (fullBloodType) {
        case "A+":
          return {
            canDonateTo: ["A+", "AB+"],
            canReceiveFrom: ["A+", "A-", "O+", "O-"],
          }
        case "A-":
          return {
            canDonateTo: ["A+", "A-", "AB+", "AB-"],
            canReceiveFrom: ["A-", "O-"],
          }
        case "B+":
          return {
            canDonateTo: ["B+", "AB+"],
            canReceiveFrom: ["B+", "B-", "O+", "O-"],
          }
        case "B-":
          return {
            canDonateTo: ["B+", "B-", "AB+", "AB-"],
            canReceiveFrom: ["B-", "O-"],
          }
        case "AB+":
          return {
            canDonateTo: ["AB+"],
            canReceiveFrom: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
          }
        case "AB-":
          return {
            canDonateTo: ["AB+", "AB-"],
            canReceiveFrom: ["A-", "B-", "AB-", "O-"],
          }
        case "O+":
          return {
            canDonateTo: ["A+", "B+", "AB+", "O+"],
            canReceiveFrom: ["O+", "O-"],
          }
        case "O-":
          return {
            canDonateTo: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
            canReceiveFrom: ["O-"],
          }
        default:
          return {
            canDonateTo: [],
            canReceiveFrom: [],
          }
      }
    }

    // Plasma Compatibility (opposite of whole blood)
    if (componentType === "plasma") {
      switch (fullBloodType) {
        case "A+":
          return {
            canDonateTo: ["A+", "A-", "O+", "O-"],
            canReceiveFrom: ["A+", "AB+"],
          }
        case "A-":
          return {
            canDonateTo: ["A+", "A-", "O+", "O-"],
            canReceiveFrom: ["A-", "AB-", "AB+"],
          }
        case "B+":
          return {
            canDonateTo: ["B+", "B-", "O+", "O-"],
            canReceiveFrom: ["B+", "AB+"],
          }
        case "B-":
          return {
            canDonateTo: ["B+", "B-", "O+", "O-"],
            canReceiveFrom: ["B-", "AB-", "AB+"],
          }
        case "AB+":
          return {
            canDonateTo: ["A+", "B+", "AB+", "O+", "A-", "B-", "AB-", "O-"],
            canReceiveFrom: ["AB+"],
          }
        case "AB-":
          return {
            canDonateTo: ["A+", "B+", "AB+", "O+", "A-", "B-", "AB-", "O-"],
            canReceiveFrom: ["AB-"],
          }
        case "O+":
          return {
            canDonateTo: ["O+", "O-"],
            canReceiveFrom: ["O+", "A+", "B+", "AB+"],
          }
        case "O-":
          return {
            canDonateTo: ["O-"],
            canReceiveFrom: ["O-", "A-", "B-", "AB-", "O+", "A+", "B+", "AB+"],
          }
        default:
          return {
            canDonateTo: [],
            canReceiveFrom: [],
          }
      }
    }

    // Platelets Compatibility
    if (componentType === "platelets") {
      switch (fullBloodType) {
        case "A+":
          return {
            canDonateTo: ["A+", "AB+", "B+", "O+"],
            canReceiveFrom: ["A+", "A-"],
          }
        case "A-":
          return {
            canDonateTo: ["A+", "AB+", "B+", "O+", "A-", "AB-", "B-", "O-"],
            canReceiveFrom: ["A-"],
          }
        case "B+":
          return {
            canDonateTo: ["B+", "AB+", "A+", "O+"],
            canReceiveFrom: ["B+", "B-"],
          }
        case "B-":
          return {
            canDonateTo: ["B+", "AB+", "A+", "O+", "B-", "AB-", "A-", "O-"],
            canReceiveFrom: ["B-"],
          }
        case "AB+":
          return {
            canDonateTo: ["AB+", "A+", "B+", "O+"],
            canReceiveFrom: ["AB+", "AB-", "A+", "A-", "B+", "B-"],
          }
        case "AB-":
          return {
            canDonateTo: ["AB+", "A+", "B+", "O+", "AB-", "A-", "B-", "O-"],
            canReceiveFrom: ["AB-", "A-", "B-"],
          }
        case "O+":
          return {
            canDonateTo: ["O+", "A+", "B+", "AB+"],
            canReceiveFrom: ["O+", "O-"],
          }
        case "O-":
          return {
            canDonateTo: ["O+", "A+", "B+", "AB+", "O-", "A-", "B-", "AB-"],
            canReceiveFrom: ["O-"],
          }
        default:
          return {
            canDonateTo: [],
            canReceiveFrom: [],
          }
      }
    }

    return {
      canDonateTo: [],
      canReceiveFrom: [],
    }
  }

  const compatibilityData = getCompatibilityData()

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="blood-type">Loại máu</Label>
          <Select value={bloodType} onValueChange={setBloodType}>
            <SelectTrigger id="blood-type" className="mt-1.5">
              <SelectValue placeholder="Chọn loại máu" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A">A</SelectItem>
              <SelectItem value="B">B</SelectItem>
              <SelectItem value="AB">AB</SelectItem>
              <SelectItem value="O">O</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="rh-factor">Rh Factor</Label>
          <Select value={rhFactor} onValueChange={setRhFactor}>
            <SelectTrigger id="rh-factor" className="mt-1.5">
              <SelectValue placeholder="Chọn Rh factor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="+">Dương (+)</SelectItem>
              <SelectItem value="-">Âm (-)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Thành phần máu</Label>
          <RadioGroup value={componentType} onValueChange={setComponentType} className="grid grid-cols-2 gap-2 mt-1.5">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="whole-blood" id="whole-blood" />
              <Label htmlFor="whole-blood">Máu toàn thân</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="red-cells" id="red-cells" />
              <Label htmlFor="red-cells">Máu hồng cầu</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="plasma" id="plasma" />
              <Label htmlFor="plasma">Tiểu cầu</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="platelets" id="platelets" />
              <Label htmlFor="platelets">Huyết tương</Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <div className="flex justify-center">
        <Button onClick={handleSearch} disabled={!bloodType || !rhFactor}>
          <Search className="mr-2 h-4 w-4" />
          Tìm kiếm loại máu phù hợp
        </Button>
      </div>

      {searchPerformed && (
        <div className="space-y-6">
          <div className="flex justify-center">
            <Badge className="text-lg py-2 px-4 bg-red-50 border-red-200 text-red-700">
              <Droplet className="mr-2 h-5 w-5" />
              Blood Type: {bloodType}
              {rhFactor}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Có thể hiến máu cho</h3>
                {compatibilityData.canDonateTo.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {compatibilityData.canDonateTo.map((type) => (
                      <Badge key={type} variant="outline" className="text-base py-1 px-3">
                        <Droplet className="mr-1 h-4 w-4 text-red-600" />
                        {type}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Vui lòng chọn loại máu và thành phần.</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Có thể nhận máu từ</h3>
                {compatibilityData.canReceiveFrom.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {compatibilityData.canReceiveFrom.map((type) => (
                      <Badge key={type} variant="outline" className="text-base py-1 px-3">
                        <Droplet className="mr-1 h-4 w-4 text-red-600" />
                        {type}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Vui lòng chọn loại máu và thành phần.</p>
                )}
              </CardContent>
            </Card>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Loại máu</TableHead>
                <TableHead>Có thể hiến máu cho</TableHead>
                <TableHead>Có thể nhận máu từ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((type) => {
                const [abo, rh] = [type.slice(0, -1), type.slice(-1)]
                const data = getCompatibilityDataForType(abo, rh, componentType)

                return (
                  <TableRow key={type} className={type === bloodType + rhFactor ? "bg-red-50" : ""}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <Droplet className="mr-1 h-4 w-4 text-red-600" />
                        {type}
                      </div>
                    </TableCell>
                    <TableCell>{data.canDonateTo.join(", ")}</TableCell>
                    <TableCell>{data.canReceiveFrom.join(", ")}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}

// Helper function to get compatibility data for the table
function getCompatibilityDataForType(bloodType: string, rhFactor: string, componentType: string) {
  const fullBloodType = `${bloodType}${rhFactor}`

  // Whole Blood Compatibility
  if (componentType === "whole-blood" || componentType === "red-cells") {
    switch (fullBloodType) {
      case "A+":
        return {
          canDonateTo: ["A+", "AB+"],
          canReceiveFrom: ["A+", "A-", "O+", "O-"],
        }
      case "A-":
        return {
          canDonateTo: ["A+", "A-", "AB+", "AB-"],
          canReceiveFrom: ["A-", "O-"],
        }
      case "B+":
        return {
          canDonateTo: ["B+", "AB+"],
          canReceiveFrom: ["B+", "B-", "O+", "O-"],
        }
      case "B-":
        return {
          canDonateTo: ["B+", "B-", "AB+", "AB-"],
          canReceiveFrom: ["B-", "O-"],
        }
      case "AB+":
        return {
          canDonateTo: ["AB+"],
          canReceiveFrom: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
        }
      case "AB-":
        return {
          canDonateTo: ["AB+", "AB-"],
          canReceiveFrom: ["A-", "B-", "AB-", "O-"],
        }
      case "O+":
        return {
          canDonateTo: ["A+", "B+", "AB+", "O+"],
          canReceiveFrom: ["O+", "O-"],
        }
      case "O-":
        return {
          canDonateTo: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
          canReceiveFrom: ["O-"],
        }
      default:
        return {
          canDonateTo: [],
          canReceiveFrom: [],
        }
    }
  }

  // Plasma Compatibility
  if (componentType === "plasma") {
    switch (fullBloodType) {
      case "A+":
        return {
          canDonateTo: ["A+", "A-", "O+", "O-"],
          canReceiveFrom: ["A+", "AB+"],
        }
      case "A-":
        return {
          canDonateTo: ["A+", "A-", "O+", "O-"],
          canReceiveFrom: ["A-", "AB-", "AB+"],
        }
      case "B+":
        return {
          canDonateTo: ["B+", "B-", "O+", "O-"],
          canReceiveFrom: ["B+", "AB+"],
        }
      case "B-":
        return {
          canDonateTo: ["B+", "B-", "O+", "O-"],
          canReceiveFrom: ["B-", "AB-", "AB+"],
        }
      case "AB+":
        return {
          canDonateTo: ["A+", "B+", "AB+", "O+", "A-", "B-", "AB-", "O-"],
          canReceiveFrom: ["AB+"],
        }
      case "AB-":
        return {
          canDonateTo: ["A+", "B+", "AB+", "O+", "A-", "B-", "AB-", "O-"],
          canReceiveFrom: ["AB-"],
        }
      case "O+":
        return {
          canDonateTo: ["O+", "O-"],
          canReceiveFrom: ["O+", "A+", "B+", "AB+"],
        }
      case "O-":
        return {
          canDonateTo: ["O-"],
          canReceiveFrom: ["O-", "A-", "B-", "AB-", "O+", "A+", "B+", "AB+"],
        }
      default:
        return {
          canDonateTo: [],
          canReceiveFrom: [],
        }
    }
  }

  // Platelets Compatibility
  if (componentType === "platelets") {
    switch (fullBloodType) {
      case "A+":
        return {
          canDonateTo: ["A+", "AB+", "B+", "O+"],
          canReceiveFrom: ["A+", "A-"],
        }
      case "A-":
        return {
          canDonateTo: ["A+", "AB+", "B+", "O+", "A-", "AB-", "B-", "O-"],
          canReceiveFrom: ["A-"],
        }
      case "B+":
        return {
          canDonateTo: ["B+", "AB+", "A+", "O+"],
          canReceiveFrom: ["B+", "B-"],
        }
      case "B-":
        return {
          canDonateTo: ["B+", "AB+", "A+", "O+", "B-", "AB-", "A-", "O-"],
          canReceiveFrom: ["B-"],
        }
      case "AB+":
        return {
          canDonateTo: ["AB+", "A+", "B+", "O+"],
          canReceiveFrom: ["AB+", "AB-", "A+", "A-", "B+", "B-"],
        }
      case "AB-":
        return {
          canDonateTo: ["AB+", "A+", "B+", "O+", "AB-", "A-", "B-", "O-"],
          canReceiveFrom: ["AB-", "A-", "B-"],
        }
      case "O+":
        return {
          canDonateTo: ["O+", "A+", "B+", "AB+"],
          canReceiveFrom: ["O+", "O-"],
        }
      case "O-":
        return {
          canDonateTo: ["O+", "A+", "B+", "AB+", "O-", "A-", "B-", "AB-"],
          canReceiveFrom: ["O-"],
        }
      default:
        return {
          canDonateTo: [],
          canReceiveFrom: [],
        }
    }
  }

  return {
    canDonateTo: [],
    canReceiveFrom: [],
  }
}
