import { Droplet } from "lucide-react"
import { Link } from "react-router-dom"

export function Footer() {
  return (
    <footer className="bg-accent py-12">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Droplet className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">BloodHouse</span>
            </div>
            <p className="text-muted-foreground">
              Kết nối người hiến máu với những người cần, cứu sống mạng người qua mỗi giọt máu hiến tặng.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link to="/donate" className="text-muted-foreground hover:text-primary transition-colors">
                  Hiến máu
                </Link>
              </li>
              <li>
                <Link to="/request" className="text-muted-foreground hover:text-primary transition-colors">
                  Yêu cầu máu
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-muted-foreground hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-muted-foreground hover:text-primary transition-colors">
                  Câu hỏi thường gặp
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-4">Tài nguyên</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/education" className="text-muted-foreground hover:text-primary transition-colors">
                  Thông tin nhóm máu
                </Link>
              </li>
              <li>
                <Link to="/eligibility" className="text-muted-foreground hover:text-primary transition-colors">
                  Điều kiện hiến máu
                </Link>
              </li>
              <li>
                <Link to="/process" className="text-muted-foreground hover:text-primary transition-colors">
                  Quy trình hiến máu
                </Link>
              </li>
              <li>
                <Link to="/locations" className="text-muted-foreground hover:text-primary transition-colors">
                  Trung tâm hiến máu
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-4">Liên hệ</h3>
            <address className="not-italic space-y-2 text-muted-foreground">
              <p>123 Đường Nguyễn Văn Linh</p>
              <p>Quận 7, TP. Hồ Chí Minh</p>
              <p>Email: info@huyetket.vn</p>
              <p>Điện thoại: (028) 1234 5678</p>
            </address>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} BloodHouse. Tất cả quyền được bảo lưu.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Điều khoản sử dụng
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Chính sách bảo mật
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Liên hệ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
