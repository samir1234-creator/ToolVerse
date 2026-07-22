import { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { BottomNav } from '@/components/ui/BottomNav';
import { Snackbar } from '@/components/ui/Snackbar';
import { SplashScreen } from '@/components/ui/SplashScreen';
import { useTheme } from '@/hooks/useTheme';

import Home from '@/pages/Home';
import Categories from '@/pages/Categories';
import CategoryDetail from '@/pages/CategoryDetail';
import Favorites from '@/pages/Favorites';
import Settings from '@/pages/Settings';
import SearchPage from '@/pages/Search';
import {
  BasicCalculatorTool,
  ScientificCalculatorTool,
  CoinFlipTool,
  DiceRollerTool,
  CompassTool,
  FormulaCalculatorTool,
  UnitConverterTool,
  DevToolsRunner,
  TextToolsRunner,
  MorseCodeTool,
  CurrencyConverterTool,
  CryptoTrackerTool,
  UnitPriceTool,
  LoanPayoffTool,
  Rule72Tool,
  StopwatchTool,
  LoanComparisonTool,
  SalaryToHourlyTool,
  FuelTripCostTool,
  PercentageChangeTool,
  SalesTaxCalculatorTool,
  AgeDifferenceTool,
  BodyFatCalculatorTool,
  TimeDurationTool,
  LoremIpsumTool,
  TextCleanerTool,
} from '@/tools';
import { useHardwareBackButton } from '@/hooks/useHardwareBackButton';

function AnimatedRoutes() {
  const location = useLocation();
  useHardwareBackButton(); // Register Capacitor back button handler

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/category/:id" element={<CategoryDetail />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/search" element={<SearchPage />} />

        {/* Dedicated Calculator Routes */}
        <Route path="/calculator/basic" element={<BasicCalculatorTool />} />
        <Route path="/calculator/scientific" element={<ScientificCalculatorTool />} />
        <Route path="/calculator/coin-flip" element={<CoinFlipTool />} />
        <Route path="/calculator/dice-roller" element={<DiceRollerTool />} />
        <Route path="/calculator/compass" element={<CompassTool />} />
        <Route path="/calculator/currency" element={<CurrencyConverterTool />} />
        <Route path="/calculator/crypto" element={<CryptoTrackerTool />} />
        <Route path="/calculator/unit-price" element={<UnitPriceTool />} />
        <Route path="/calculator/loan-payoff" element={<LoanPayoffTool />} />
        <Route path="/calculator/rule-of-72" element={<Rule72Tool />} />
        <Route path="/calculator/stopwatch" element={<StopwatchTool />} />
        <Route path="/calculator/loan-comparison" element={<LoanComparisonTool />} />
        <Route path="/calculator/salary-hourly" element={<SalaryToHourlyTool />} />
        <Route path="/calculator/fuel-trip-cost" element={<FuelTripCostTool />} />
        <Route path="/calculator/percentage-change" element={<PercentageChangeTool />} />
        <Route path="/calculator/sales-tax" element={<SalesTaxCalculatorTool />} />
        <Route path="/calculator/age-difference" element={<AgeDifferenceTool />} />
        <Route path="/calculator/body-fat" element={<BodyFatCalculatorTool />} />
        <Route path="/calculator/time-duration" element={<TimeDurationTool />} />
        <Route path="/calculator/:id" element={<FormulaCalculatorTool />} />

        {/* Converters & DevTools */}
        <Route path="/converter/:categoryId" element={<UnitConverterTool />} />
        <Route path="/devtool/:id" element={<DevToolsRunner />} />

        {/* Text Tools */}
        <Route path="/texttool/morse-code" element={<MorseCodeTool />} />
        <Route path="/texttool/lorem-ipsum" element={<LoremIpsumTool />} />
        <Route path="/texttool/text-cleaner" element={<TextCleanerTool />} />
        <Route path="/texttool/:id" element={<TextToolsRunner />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  useTheme();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), 2200);
    return () => clearTimeout(t);
  }, []);

  return (
    <HashRouter>
      <div className="min-h-screen gradient-mesh">
        <AnimatedRoutes />
        <BottomNav />
        <Snackbar />
        <AnimatePresence>{showSplash && <SplashScreen />}</AnimatePresence>
      </div>
    </HashRouter>
  );
}
