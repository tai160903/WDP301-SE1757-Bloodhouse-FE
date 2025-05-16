import { Card, CardContent } from "@/components/ui/card"
import { Droplet, Users, Calendar, Award } from "lucide-react"

export function Stats() {
  return (
    <section className="container -mt-12 relative z-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-lg card-hover">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-accent p-4 rounded-full">
              <Droplet className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tổng đơn vị máu</p>
              <p className="text-2xl font-bold">12,458</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg card-hover">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-accent p-4 rounded-full">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Người hiến máu</p>
              <p className="text-2xl font-bold">2,543</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg card-hover">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-accent p-4 rounded-full">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Lịch hẹn tháng này</p>
              <p className="text-2xl font-bold">187</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg card-hover">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-accent p-4 rounded-full">
              <Award className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Mạng sống được cứu</p>
              <p className="text-2xl font-bold">7,374</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
