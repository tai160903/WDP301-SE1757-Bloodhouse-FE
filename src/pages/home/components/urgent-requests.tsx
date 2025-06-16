// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { ArrowRight, Clock, Droplet, MapPin } from "lucide-react"
// import { Link } from "react-router-dom"

// export function UrgentRequests() {
//   const urgentRequests = [
//     {
//       id: 1,
//       patientName: "Nguyễn V.",
//       bloodType: "O-",
//       location: "Bệnh viện Trung ương",
//       distance: "2.5 km",
//       timePosted: "2 giờ trước",
//       urgency: "Nguy cấp",
//     },
//     {
//       id: 2,
//       patientName: "Trần T.",
//       bloodType: "AB+",
//       location: "Bệnh viện Đa khoa",
//       distance: "4.8 km",
//       timePosted: "5 giờ trước",
//       urgency: "Khẩn cấp",
//     },
//     {
//       id: 3,
//       patientName: "Lê H.",
//       bloodType: "B+",
//       location: "Bệnh viện Cộng đồng",
//       distance: "3.2 km",
//       timePosted: "1 ngày trước",
//       urgency: "Trung bình",
//     },
//   ]

//   return (
//     <section className="container py-16 space-y-8">
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//         <div>
//           <h2 className="text-3xl font-bold tracking-tight text-red-600">Yêu cầu máu khẩn cấp</h2>
//           <p className="text-muted-foreground mt-2">Những bệnh nhân cần hiến máu ngay lập tức</p>
//         </div>
//         <Button variant="outline" asChild>
//           <Link to="/urgent-requests">
//             Xem tất cả yêu cầu <ArrowRight className="ml-2 h-4 w-4" />
//           </Link>
//         </Button>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {urgentRequests.map((request) => (
//           <Card key={request.id} className="card-hover">
//             <CardHeader className="space-y-1">
//               <div className="flex justify-between items-center">
//                 <div className="flex items-center">
//                   <Droplet className="h-5 w-5 text-primary mr-2" />
//                   <span className="text-xl font-bold">{request.bloodType}</span>
//                 </div>
//                 <Badge
//                   variant={
//                     request.urgency === "Nguy cấp"
//                       ? "destructive"
//                       : request.urgency === "Khẩn cấp"
//                         ? "default"
//                         : "outline"
//                   }
//                 >
//                   {request.urgency}
//                 </Badge>
//               </div>
//               <CardTitle>Cho {request.patientName}</CardTitle>
//               <CardDescription className="flex items-center">
//                 <MapPin className="h-4 w-4 mr-1" />
//                 {request.location} ({request.distance})
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="flex items-center text-sm text-muted-foreground">
//                 <Clock className="h-4 w-4 mr-1" />
//                 Đăng {request.timePosted}
//               </div>
//             </CardContent>
//             <CardFooter className="flex justify-between">
//               <Button variant="outline" size="sm" asChild>
//                 <Link to={`/request/${request.id}`}>Xem chi tiết</Link>
//               </Button>
//               <Button size="sm" asChild>
//                 <Link to={`/donate/${request.id}`}>Phản hồi</Link>
//               </Button>
//             </CardFooter>
//           </Card>
//         ))}
//       </div>
//     </section>
//   )
// }
