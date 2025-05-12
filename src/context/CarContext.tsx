import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { Car, Brand, brandService, carService } from "../services/api";

interface CarContextType {
  cars: Car[];
  brands: Brand[];
  loading: boolean;
  error: string | null;
  selectedBrandId: string | null;
  setSelectedBrandId: (id: string | null) => void;
  refreshData: () => void;
}

const CarContext = createContext<CarContextType | undefined>(undefined);

export const CarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cars, setCars] = useState<Car[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [carsLoading, setCarsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
  const [dataVersion, setDataVersion] = useState(0);
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setInitialLoading(true);
        const brandsWithCounts = await brandService.getBrandsWithCounts();
        setBrands(brandsWithCounts);

        const allCars = await carService.getAllCars();
        setCars(allCars);

        setError(null);
      } catch (err) {
        setError("Failed to load data. Please try again later.");
      } finally {
        setInitialLoading(false);
      }
    };

    fetchBrands();
  }, [dataVersion]);
  useEffect(() => {
    if (initialLoading) return;

    const fetchCars = async () => {
      try {
        setCarsLoading(true);
        const carsData = selectedBrandId
          ? await carService.getCarsByBrand(selectedBrandId)
          : await carService.getAllCars();

        setCars(carsData);
        setError(null);
      } catch (err) {
        setError("Failed to load cars. Please try again later.");
      } finally {
        setCarsLoading(false);
      }
    };

    fetchCars();
  }, [selectedBrandId, initialLoading]);

  const handleSelectBrand = useCallback((brandId: string | null) => {
    setSelectedBrandId(brandId);
  }, []);

  const refreshData = () => {
    setDataVersion((prev) => prev + 1);
  };
  const loading = initialLoading || carsLoading;

  return (
    <CarContext.Provider
      value={{
        cars,
        brands,
        loading,
        error,
        selectedBrandId,
        setSelectedBrandId: handleSelectBrand,
        refreshData,
      }}
    >
      {children}
    </CarContext.Provider>
  );
};

export const useCars = () => {
  const context = useContext(CarContext);
  if (context === undefined) {
    throw new Error("useCars must be used within a CarProvider");
  }
  return context;
};
