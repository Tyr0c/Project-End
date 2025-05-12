import React, { ReactNode, useState } from "react";
import SideBar from "../components/NavBar/SideBar";
import NavBar from "../components/NavBar/NavBar";
import { Button, Drawer } from "@mantine/core";
import { IconMenu2 } from "@tabler/icons-react";
import { useViewportSize } from "../hooks/useViewportSize";

interface MainLayoutProps {
  children: ReactNode;
}

interface HomePageChildProps {
  handleSectionChange?: (section: string, brandFilter: string | null) => void;
  initialSection?: string;
  initialBrandFilter?: string | null;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isMobile } = useViewportSize();
  const [activeSection, setActiveSection] = useState<string>("cars");
  const [activeBrandFilter, setActiveBrandFilter] = useState<string | null>(
    null
  );
  const handleSectionChange = (
    section: string,
    brandFilter: string | null = null
  ) => {
    setActiveSection(section);
    setActiveBrandFilter(brandFilter);

    if (React.isValidElement<HomePageChildProps>(children)) {
      if (typeof children.props.handleSectionChange === "function") {
        children.props.handleSectionChange(section, brandFilter);
      }
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <NavBar
        sidebarButton={
          isMobile && (
            <Button
              variant="subtle"
              onClick={() => setSidebarOpen(true)}
              size="sm"
              p={6}
              className="mr-2"
              style={{
                borderRadius: "50%",
                width: 40,
                height: 40,
                backgroundColor: "var(--mantine-color-dark-5)",
                minWidth: "unset",
              }}
            >
              <IconMenu2 size={24} />
            </Button>
          )
        }
      />      <div className="flex flex-row flex-1 overflow-hidden">
        {!isMobile && <SideBar onSectionChange={handleSectionChange} />}

        <Drawer
          opened={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          title="Browse Categories"
          padding="md"
          size="xs"
          position="left"
        >
          <SideBar
            isMobileDrawer={true}
            onCloseMobileDrawer={() => setSidebarOpen(false)}
            onSectionChange={handleSectionChange}
          />
        </Drawer>

        <main className="flex-1 overflow-auto">
          {React.isValidElement<HomePageChildProps>(children)
            ? React.cloneElement(children, {
                handleSectionChange: handleSectionChange,
                initialSection: activeSection,
                initialBrandFilter: activeBrandFilter,
              })
            : children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
