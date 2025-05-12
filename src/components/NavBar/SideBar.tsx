import React, { useState } from "react";
import { Box, Text, NavLink, Group, Badge, ScrollArea } from "@mantine/core";
import { useCars } from "../../context/CarContext";
import { IconCar, IconComponents } from "@tabler/icons-react";

interface SideBarProps {
  isMobileDrawer?: boolean;
  onCloseMobileDrawer?: () => void;
  onSectionChange?: (section: string, brandFilter?: string | null) => void;
}

const SideBar: React.FC<SideBarProps> = ({
  isMobileDrawer = false,
  onCloseMobileDrawer,
  onSectionChange,
}) => {
  const { brands, selectedBrandId, setSelectedBrandId } = useCars();
  const [activeSection, setActiveSection] = useState<string>("cars");
  const switchToCarPartsSection = () => {
    setActiveSection("parts");

    if (onSectionChange) {
      onSectionChange("parts", null);
    }

    if (isMobileDrawer && onCloseMobileDrawer) {
      onCloseMobileDrawer();
    }
  };
  const switchToCarsSection = () => {
    setActiveSection("cars");

    if (onSectionChange) {
      onSectionChange("cars", null);
    }

    if (isMobileDrawer && onCloseMobileDrawer) {
      onCloseMobileDrawer();
    }
  };
  const selectBrand = (brandId: string | null) => {
    if (setSelectedBrandId) {
      setSelectedBrandId(brandId);
    }

    if (onSectionChange) {
      onSectionChange("cars", brandId);
    }

    if (isMobileDrawer && onCloseMobileDrawer) {
      onCloseMobileDrawer();
    }
  };

  return (
    <div
      className={`h-full ${!isMobileDrawer ? "w-64" : "w-full"}`}
      style={{
        backgroundColor: "var(--mantine-color-dark-7)",
        borderRight: "1px solid var(--mantine-color-dark-4)",
      }}
    >
      <ScrollArea className="h-full">
        <Box p="md">
          <Text
            fw={700}
            fz="lg"
            mb="md"
            style={{ color: "var(--mantine-color-gray-0)" }}
          >
            Categories
          </Text>

          <NavLink
            label={
              <Group justify="space-between">
                <Text>Cars</Text>
                <IconCar size={16} />
              </Group>
            }
            variant="light"
            active={activeSection === "cars"}
            onClick={switchToCarsSection}
            color="violet"
            mb="md"
          />

          <NavLink
            label={
              <Group justify="space-between">
                <Text>Car Parts</Text>
                <IconComponents size={16} />
              </Group>
            }
            variant="light"
            active={activeSection === "parts"}
            onClick={switchToCarPartsSection}
            color="violet"
            mb="md"
          />

          {activeSection === "cars" && (
            <>
              <Text
                fw={600}
                fz="sm"
                mb="md"
                mt="xl"
                style={{ color: "var(--mantine-color-gray-3)" }}
              >
                Car Brands
              </Text>

              <NavLink
                label={
                  <Group justify="space-between">
                    <Text>All Cars</Text>{" "}
                    <Badge size="md" color="violet" variant="light" radius="sm">
                      {brands.reduce((acc, brand) => {
                        const countToAdd =
                          typeof brand.count === "number" ? brand.count : 0;
                        return acc + countToAdd;
                      }, 0)}
                    </Badge>
                  </Group>
                }
                variant="light"
                active={!selectedBrandId}
                onClick={() => selectBrand(null)}
                mb="md"
                color="violet"
              />

              {brands.map((brand) => (
                <NavLink
                  key={brand.id}
                  label={
                    <Group justify="space-between">
                      <Text>{brand.label}</Text>
                      <Badge
                        size="md"
                        color="violet"
                        variant="light"
                        radius="sm"
                      >
                        {brand.count || 0}
                      </Badge>
                    </Group>
                  }
                  variant="light"
                  active={selectedBrandId === brand.id.toString()}
                  onClick={() => selectBrand(brand.id.toString())}
                  mb="xs"
                  color="violet"
                />
              ))}
            </>
          )}
        </Box>
      </ScrollArea>
    </div>
  );
};

export default SideBar;
