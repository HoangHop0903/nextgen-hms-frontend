import { useQuery } from "@tanstack/react-query";
import { Specialty, Doctor, Testimonial, Article } from "@/types/home.types";
import { api } from "@/lib/api/axios";

export const useSpecialties = () => {
  return useQuery<Specialty[]>({
    queryKey: ['landing', 'specialties'],
    queryFn: () => api.get('/specialties').then(res => res.data),
  });
};

export const useFeaturedDoctors = () => {
  return useQuery<Doctor[]>({
    queryKey: ['landing', 'featured-doctors'],
    queryFn: () => api.get('/doctors/featured').then(res => res.data),
  });
};

