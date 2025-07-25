import { Switch, Route, useLocation } from "wouter";
import Home from "@/pages/Home";
import Booking from "@/pages/Booking";
import DirectBooking from "@/pages/DirectBooking";
import Dashboard from "@/pages/Dashboard";
import Setup from "@/pages/Setup";
import Pricing from "@/pages/Pricing";
import Admin from "@/pages/Admin";
import AdminLogin from "@/pages/AdminLogin";
import IOSTest from "@/pages/IOSTest";

import NotFound from "@/pages/not-found";
import Checkout from "@/pages/checkout";
import PayInvoice from "@/pages/PayInvoice";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { IndustryProvider } from "@/lib/industryContext";
import { ThemeProvider } from "@/lib/themeContext";

function App() {
  const [location] = useLocation();
  const isSetupPage = location === "/setup" || location === "/";
  const isAdminPage = location === "/admin" || location === "/admin-login";


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
            <Route path="/book/:slug" component={DirectBooking} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/setup" component={Setup} />
            <Route path="/pricing" component={Pricing} />
            <Route path="/admin" component={Admin} />
            <Route path="/admin-login" component={AdminLogin} />
            <Route path="/checkout" component={Checkout} />
            <Route path="/pay-invoice" component={PayInvoice} />
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
