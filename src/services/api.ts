import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface Car {
  id: number;
  brand_id: number;
  model: string;
  year: number;
  price: number;
  image?: string;
  images?: string[];
  fuel_type?: string;
  transmission?: string;
  doors?: number;
  power?: number;
  total_weight?: number;
  trunk_capacity?: number;
  color?: string;
  description?: string;
  brand_label?: string;
  status?: 'not approved' | 'approved';
}

export interface CarPart {
  id: number;
  name: string;
  car_model: string;
  price: number;
  description: string;
  image?: string;
}

export interface Brand {
  id: number;
  name?: string;
  label: string;
  count?: number;
}

export interface BrandWithCount extends Brand {
  count: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
  isAdmin?: boolean;
  status?: 'active' | 'inactive';
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export const carService = {
  getAllCars: async (): Promise<Car[]> => {
    const response = await api.get('/cars');
    return response.data;
  },

  getCarsByBrand: async (brandId: string | number): Promise<Car[]> => {
    const response = await api.get(`/cars?brand_id=${brandId.toString()}`);
    return response.data;
  },

  getCarById: async (carId: number | string): Promise<Car> => {
    const response = await api.get(`/cars/${carId.toString()}`);
    return response.data;
  },

  createCar: async (carData: Omit<Car, 'id'>): Promise<Car> => {
    const response = await api.post('/cars', carData);
    return response.data;
  },
  updateCar: async (carId: number, carData: Partial<Car>): Promise<Car> => {
    try {
      const response = await api.put(`/cars/${carId.toString()}`, carData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  deleteCar: async (carId: number | string): Promise<void> => {
    try {
      const id = carId.toString();
      await api.delete(`/cars/${id}`);
    } catch (error: any) {
      throw error;
    }
  },
  getApprovedCars: async (): Promise<Car[]> => {
    try {
      const response = await api.get('/cars?status=approved');
      const approvedCars = response.data.filter((car: Car) => car.status === 'approved');
      return approvedCars;
    } catch (error) {
      throw error;
    }
  },
  getApprovedCarsByBrand: async (brandId: string | number): Promise<Car[]> => {
    try {
      const response = await api.get(`/cars?brand_id=${brandId.toString()}&status=approved`);
      const approvedCars = response.data.filter((car: Car) => car.status === 'approved');
      return approvedCars;
    } catch (error) {
      throw error;
    }
  },
};

export const partService = {
  getAllParts: async (): Promise<CarPart[]> => {
    const response = await api.get('/parts');
    return response.data;
  },

  getPartById: async (partId: number): Promise<CarPart> => {
    const response = await api.get(`/parts/${partId}`);
    return response.data;
  },

  createPart: async (partData: Omit<CarPart, 'id'>): Promise<CarPart> => {
    const response = await api.post('/parts', partData);
    return response.data;
  },
  updatePart: async (partId: string, partData: Partial<CarPart>): Promise<CarPart> => {
    try {
      const response = await api.put(`/parts/${partId}`, partData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deletePart: async (partId: string): Promise<void> => {
    try {
      await api.delete(`/parts/${partId}`);
    } catch (error) {
      throw error;
    }
  }
};

export const brandService = {
  getAllBrands: async (): Promise<Brand[]> => {
    const response = await api.get('/brands');
    return response.data;
  },
  getBrandsWithCounts: async (): Promise<BrandWithCount[]> => {
    const brandsResponse = await api.get('/brands');
    const brands: Brand[] = brandsResponse.data;

    const brandsWithCounts = await Promise.all(
      brands.map(async (brand) => {
        try {
          const carsResponse = await api.get(`/cars?brand_id=${brand.id.toString()}&status=approved`);
          const cars: Car[] = carsResponse.data;
          const approvedCars = cars.filter(car => car.status === 'approved');
          return {
            ...brand,
            label: brand.name || brand.label,
            count: approvedCars.length
          };
        } catch (error) {
          return {
            ...brand,
            label: brand.name || brand.label,
            count: 0
          };
        }
      })
    );

    return brandsWithCounts;
  }
};

export const authService = {
  register: async (data: RegisterData): Promise<any> => {
    const response = await api.post('/register', data);
    return response.data;
  },
  
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post('/login', data);
    const { token, user } = response.data;
    
    if (token) {
      localStorage.setItem('token', token);
      
      if (user) {
        if (user.role === 'admin' || user.isAdmin === true) {
          localStorage.setItem('isAdmin', 'true');
        } else {
          localStorage.setItem('isAdmin', 'false');
        }
      } else {
        localStorage.setItem('isAdmin', 'false');
      }
      
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      window.dispatchEvent(new Event('auth-change'));
    }
    
    return response.data;
  },
  
  logout: async (): Promise<any> => {
    try {
      const response = await api.post('/logout');
      localStorage.removeItem('token');
      localStorage.removeItem('isAdmin');
      delete api.defaults.headers.common.Authorization;
      window.dispatchEvent(new Event('auth-change'));
      return response.data;
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('isAdmin');
      delete api.defaults.headers.common.Authorization;
      window.dispatchEvent(new Event('auth-change'));
      throw error;
    }
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },
  
  initAuth: (): void => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    }
  },

  getCurrentUser: (): User | null => {
    try {
      const userInfoEncoded = localStorage.getItem('userInfo');
      if (!userInfoEncoded) return null;
      
      const userInfo = JSON.parse(atob(userInfoEncoded));
      
      if (!userInfo.timestamp) {
        authService.logout();
        return null;
      }
      
      return {
        id: userInfo.id,
        name: userInfo.name,
        email: userInfo.email || "",
        isAdmin: !!userInfo.isAdmin
      };
    } catch (error) {
      return null;
    }
  },
  
  isAdmin: (): boolean => {
    return localStorage.getItem('isAdmin') === 'true';
  }
};

export const userService = {
  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get('/users');
    return response.data;
  },

  getUserById: async (userId: number): Promise<User> => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  updateUser: async (id: number, userData: Partial<User>): Promise<User> => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id: number): Promise<void> => {
    await api.delete(`/users/${id}`);
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/user/profile');
    return response.data;
  },

  toggleAdminRights: async (id: number, isAdmin: boolean): Promise<User> => {
    const response = await api.patch(`/users/${id}/admin`, { isAdmin });
    return response.data;
  }
};

export default api;
