"use client";

import { useState } from "react";
import { Search, MapPin, Building2, ChevronRight, Star } from "lucide-react";

const HOSPITALS = [
  {
    id: 1,
    name: "Bệnh viện Bạch Mai",
    location: "78 Giải Phóng, Phương Đình, Đống Đa, Hà Nội",
    type: "Bệnh viện Đa khoa Hạng Đặc biệt",
    rating: 4.8,
    reviews: 12450,
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    name: "Bệnh viện Chợ Rẫy",
    location: "201B Nguyễn Chí Thanh, Phường 12, Quận 5, TP.HCM",
    type: "Bệnh viện Đa khoa Hạng Đặc biệt",
    rating: 4.9,
    reviews: 18320,
    image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    name: "Bệnh viện Đại học Y Dược TP.HCM",
    location: "215 Hồng Bàng, Phường 11, Quận 5, TP.HCM",
    type: "Bệnh viện Đa khoa tuyến Trung ương",
    rating: 4.7,
    reviews: 9840,
    image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 4,
    name: "Bệnh viện Trung ương Huế",
    location: "16 Lê Lợi, Vĩnh Ninh, TP. Huế, Thừa Thiên Huế",
    type: "Bệnh viện Đa khoa Hạng Đặc biệt",
    rating: 4.6,
    reviews: 5200,
    image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 5,
    name: "Bệnh viện Hữu nghị Việt Đức",
    location: "40 Tràng Thi, Hàng Bông, Hoàn Kiếm, Hà Nội",
    type: "Bệnh viện Ngoại khoa Hạng Đặc biệt",
    rating: 4.8,
    reviews: 8900,
    image: "https://images.unsplash.com/photo-1504813184591-01572f98c85f?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 6,
    name: "Bệnh viện Từ Dũ",
    location: "284 Cống Quỳnh, Phạm Ngũ Lão, Quận 1, TP.HCM",
    type: "Bệnh viện Chuyên khoa Sản Phụ khoa",
    rating: 4.7,
    reviews: 15600,
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 7,
    name: "Bệnh viện Nhi Trung ương",
    location: "18/879 La Thành, Láng Thượng, Đống Đa, Hà Nội",
    type: "Bệnh viện Chuyên khoa Nhi tuyến Trung ương",
    rating: 4.6,
    reviews: 7300,
    image: "https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 8,
    name: "Bệnh viện Ung Bướu TP.HCM",
    location: "3 Nơ Trang Long, Phường 7, Bình Thạnh, TP.HCM",
    type: "Bệnh viện Chuyên khoa Hạng 1",
    rating: 4.5,
    reviews: 6200,
    image: "https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 9,
    name: "Hệ thống Bệnh viện Đa khoa Tâm Anh",
    location: "2B Phổ Quang, Phường 2, Tân Bình, TP.HCM",
    type: "Bệnh viện Đa khoa Quốc tế",
    rating: 4.9,
    reviews: 14200,
    image: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 10,
    name: "Bệnh viện Đa khoa Quốc tế Vinmec",
    location: "208 Nguyễn Hữu Cảnh, Phường 22, Bình Thạnh, TP.HCM",
    type: "Bệnh viện Đa khoa Quốc tế",
    rating: 4.8,
    reviews: 11050,
    image: "https://images.unsplash.com/photo-1519494080410-f9aa76cb4283?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 11,
    name: "Trung tâm Y khoa NextGen Care",
    location: "Số 1 Đại lộ Công Nghệ, Quận 1, TP.HCM",
    type: "Phòng khám Đa khoa Cao cấp",
    rating: 5.0,
    reviews: 24500,
    image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=800&q=80"
  }
];

export function HospitalTab() {
  const [search, setSearch] = useState("");

  const filteredHospitals = HOSPITALS.filter(h => 
    h.name.toLowerCase().includes(search.toLowerCase()) || 
    h.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-4 flex items-center justify-center gap-3">
          <Building2 className="w-8 h-8 text-cyan-500" /> Hệ Thống Cơ Sở Y Tế
        </h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Khám phá mạng lưới các bệnh viện, phòng khám lớn và uy tín nhất trên toàn quốc. Đặt lịch nhanh chóng, tiện lợi.
        </p>
      </div>

      <div className="relative max-w-2xl mx-auto mb-12">
        <input 
          type="text" 
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Tìm kiếm bệnh viện, phòng khám, địa chỉ..." 
          className="w-full pl-12 pr-4 py-4 rounded-full border-2 border-slate-200 dark:border-slate-700 outline-none focus:border-cyan-400 dark:focus:border-cyan-500 focus:shadow-md transition-all text-slate-700 dark:text-slate-100 bg-white dark:bg-slate-900 text-lg"
        />
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 dark:text-slate-500" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredHospitals.map(hospital => (
          <div key={hospital.id} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-xl dark:hover:shadow-cyan-900/20 transition-all group flex flex-col cursor-pointer">
            <div className="relative h-48 overflow-hidden">
              <img 
                src={hospital.image} 
                alt={hospital.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute bottom-3 left-3 text-white">
                <span className="bg-cyan-500 text-xs font-bold px-2 py-1 rounded-md mb-1 inline-block">Mạng lưới NextGen</span>
              </div>
            </div>
            
            <div className="p-5 flex flex-col flex-1">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-2">
                {hospital.name}
              </h3>
              
              <div className="flex items-start gap-2 text-slate-500 dark:text-slate-400 text-sm mb-3">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                <p className="line-clamp-2">{hospital.location}</p>
              </div>
              
              <div className="mt-auto">
                <div className="flex items-center gap-1 text-sm font-semibold text-amber-500 mb-4 bg-amber-50 dark:bg-amber-900/30 w-fit px-2 py-1 rounded-lg">
                  <Star className="w-4 h-4 fill-amber-500" /> {hospital.rating} <span className="text-slate-400 dark:text-slate-500 font-normal ml-1">({hospital.reviews.toLocaleString()} đánh giá)</span>
                </div>
                
                <button onClick={() => alert('Chức năng xem chi tiết cơ sở y tế đang được phát triển')} className="w-full py-2.5 rounded-xl border-2 border-cyan-100 dark:border-cyan-900/50 text-cyan-600 dark:text-cyan-400 font-bold hover:bg-cyan-50 dark:hover:bg-cyan-900/30 flex items-center justify-center gap-2 transition-colors">
                  Xem chi tiết <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredHospitals.length === 0 && (
        <div className="text-center py-20 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
          <Building2 className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-600 dark:text-slate-400 mb-2">Không tìm thấy cơ sở y tế</h3>
          <p className="text-slate-500 dark:text-slate-500">Thử tìm kiếm bằng tên bệnh viện hoặc khu vực khác xem sao.</p>
        </div>
      )}
    </div>
  );
}
