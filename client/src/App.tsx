import { Switch, Route, useLocation } from "wouter";
import Home from "@/pages/Home";
import Booking from "@/pages/Booking";
import Dashboard from "@/pages/Dashboard";
import Setup from "@/pages/Setup";
import Pricing from "@/pages/Pricing";
import AdminDashboard from "@/pages/AdminDashboard";
import IOSTest from "@/pages/IOSTest";

import NotFound from "@/pages/not-found";
import Checkout from "@/pages/checkout";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { IndustryProvider } from "@/lib/industryContext";
import { ThemeProvider } from "@/lib/themeContext";

function App() {
  const [location] = useLocation();
  const isSetupPage = location === "/setup" || location === "/";
  const isAdminPage = location === "/admin";


  return (
    <ThemeProvider>
      <IndustryProvider>
        <div className="flex flex-col min-h-screen theme-bg">
          {!isSetupPage && !isAdminPage && <Navbar />}
          <main className="flex-grow">
          <Switch>
            <Route path="/" component={Setup} />
            <Route path="/home" component={Home} />
            <Route path="/booking" component={Booking} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/setup" component={Setup} />
            <Route path="/pricing" component={Pricing} />
            <Route path="/admin" component={AdminDashboard} />
            <Route path="/checkout" component={Checkout} />
            <Route path="/ios-test" component={IOSTest} />

            <Route component={NotFound} />
          </Switch>
          </main>
          {!isSetupPage && !isAdminPage && <Footer />}
        </div>
      </IndustryProvider>
    </ThemeProvider>
  );
}

export default App;
