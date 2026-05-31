export interface Specialty {
  id: string;
  name: string;
  iconName: string;
  doctorCount: number;
}

export interface Doctor {
  id: string;
  fullName: string;
  specialtyName: string;
  avatarUrl: string;
  rating: number;
  slug: string;
}

export interface Testimonial {
  id: string;
  patientName: string;
  content: string;
  rating: number;
}

export interface Article {
  id: string;
  title: string;
  summary: string;
  thumbnailUrl: string;
  publishedAt: string;
  slug: string;
}
