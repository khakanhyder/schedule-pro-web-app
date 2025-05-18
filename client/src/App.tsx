import { Switch, Route, useLocation } from "wouter";
import Home from "@/pages/Home";
import Booking from "@/pages/Booking";
import StylistDashboard from "@/pages/StylistDashboard";
import Setup from "@/pages/Setup";
import NotFound from "@/pages/not-found";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

function App() {
  const [location] = useLocation();
  const isSetupPage = location === "/setup";

  return (
    <div className="flex flex-col min-h-screen">
      {!isSetupPage && <Navbar />}
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/booking" component={Booking} />
          <Route path="/dashboard" component={StylistDashboard} />
          <Route path="/setup" component={Setup} />
          <Route component={NotFound} />
        </Switch>
      </main>
      {!isSetupPage && <Footer />}
    </div>
  );
}

export default App;
