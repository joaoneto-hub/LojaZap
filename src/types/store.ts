export interface StoreImage {
  url: string;
  path: string;
  alt?: string;
}

export interface StoreSettings {
  id: string;
  userId: string;
  name: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  openingTime: string;
  closingTime: string;
  workingDays: string[];
  logo?: StoreImage;
  bannerImage?: StoreImage;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateStoreSettingsData {
  name: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  openingTime: string;
  closingTime: string;
  workingDays: string[];
  logo?: StoreImage;
  bannerImage?: StoreImage;
}

export interface UpdateStoreSettingsData {
  id: string;
  name?: string;
  description?: string;
  phone?: string;
  email?: string;
  address?: string;
  openingTime?: string;
  closingTime?: string;
  workingDays?: string[];
  logo?: StoreImage;
  bannerImage?: StoreImage;
}
