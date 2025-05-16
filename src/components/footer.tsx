import { Link } from "react-router-dom";
import { Droplet, Facebook, Instagram, Mail, MapPin, Phone, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 p-2 rounded-full">
                <Droplet className="h-5 w-5 text-primary" />
              </div>
              <span className="font-bold text-lg">BloodHouse</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Kết nối người hiến máu với người cần máu, giúp cứu sống nhiều mạng người mỗi ngày.
            </p>
            <div className="flex items-center space-x-3">
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary text-sm">
                  Về chúng tôi
                </Link>
              </li>
              {/* Các links khác */}
            </ul>
          </div>

          {/* Các cột khác */}
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© 2023 BloodHouse. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
}