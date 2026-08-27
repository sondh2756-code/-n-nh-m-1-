import TopNavBar from "../components/TopNavBar";
import BottomNavBar from "../components/BottomNavBar";

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col font-body-md text-body-md">
      <TopNavBar />
      <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-gutter py-8 md:py-12 mb-24 md:mb-0">
        {children}
      </main>
      <BottomNavBar />
    </div>
  );
}
