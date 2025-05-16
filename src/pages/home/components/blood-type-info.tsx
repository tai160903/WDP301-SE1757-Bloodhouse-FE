import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface BloodTypeInfoProps {
  type: "whole-blood" | "red-cells" | "plasma"
}

export function BloodTypeInfo({ type }: BloodTypeInfoProps) {
  const getCompatibilityData = () => {
    switch (type) {
      case "whole-blood":
        return [
          { type: "A+", canDonateTo: ["A+", "AB+"], canReceiveFrom: ["A+", "A-", "O+", "O-"] },
          { type: "A-", canDonateTo: ["A+", "A-", "AB+", "AB-"], canReceiveFrom: ["A-", "O-"] },
          { type: "B+", canDonateTo: ["B+", "AB+"], canReceiveFrom: ["B+", "B-", "O+", "O-"] },
          { type: "B-", canDonateTo: ["B+", "B-", "AB+", "AB-"], canReceiveFrom: ["B-", "O-"] },
          { type: "AB+", canDonateTo: ["AB+"], canReceiveFrom: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] },
          { type: "AB-", canDonateTo: ["AB+", "AB-"], canReceiveFrom: ["A-", "B-", "AB-", "O-"] },
          { type: "O+", canDonateTo: ["A+", "B+", "AB+", "O+"], canReceiveFrom: ["O+", "O-"] },
          { type: "O-", canDonateTo: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], canReceiveFrom: ["O-"] },
        ]
      case "red-cells":
        return [
          { type: "A+", canDonateTo: ["A+", "AB+"], canReceiveFrom: ["A+", "A-", "O+", "O-"] },
          { type: "A-", canDonateTo: ["A+", "A-", "AB+", "AB-"], canReceiveFrom: ["A-", "O-"] },
          { type: "B+", canDonateTo: ["B+", "AB+"], canReceiveFrom: ["B+", "B-", "O+", "O-"] },
          { type: "B-", canDonateTo: ["B+", "B-", "AB+", "AB-"], canReceiveFrom: ["B-", "O-"] },
          { type: "AB+", canDonateTo: ["AB+"], canReceiveFrom: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] },
          { type: "AB-", canDonateTo: ["AB+", "AB-"], canReceiveFrom: ["A-", "B-", "AB-", "O-"] },
          { type: "O+", canDonateTo: ["A+", "B+", "AB+", "O+"], canReceiveFrom: ["O+", "O-"] },
          { type: "O-", canDonateTo: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], canReceiveFrom: ["O-"] },
        ]
      case "plasma":
        return [
          { type: "A+", canDonateTo: ["A+", "A-", "O+", "O-"], canReceiveFrom: ["A+", "AB+"] },
          { type: "A-", canDonateTo: ["A+", "A-", "O+", "O-"], canReceiveFrom: ["A-", "AB-", "AB+"] },
          { type: "B+", canDonateTo: ["B+", "B-", "O+", "O-"], canReceiveFrom: ["B+", "AB+"] },
          { type: "B-", canDonateTo: ["B+", "B-", "O+", "O-"], canReceiveFrom: ["B-", "AB-", "AB+"] },
          { type: "AB+", canDonateTo: ["A+", "B+", "AB+", "O+", "A-", "B-", "AB-", "O-"], canReceiveFrom: ["AB+"] },
          { type: "AB-", canDonateTo: ["A+", "B+", "AB+", "O+", "A-", "B-", "AB-", "O-"], canReceiveFrom: ["AB-"] },
          { type: "O+", canDonateTo: ["O+", "O-"], canReceiveFrom: ["O+", "A+", "B+", "AB+"] },
          { type: "O-", canDonateTo: ["O-"], canReceiveFrom: ["O-", "A-", "B-", "AB-", "O+", "A+", "B+", "AB+"] },
        ]
    }
  }

  const data = getCompatibilityData()

  return (
    <Card className="shadow-md">
      <CardContent className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Nhóm máu</TableHead>
              <TableHead>Có thể hiến cho</TableHead>
              <TableHead>Có thể nhận từ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.type}>
                <TableCell className="font-medium">{row.type}</TableCell>
                <TableCell>{row.canDonateTo.join(", ")}</TableCell>
                <TableCell>{row.canReceiveFrom.join(", ")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
