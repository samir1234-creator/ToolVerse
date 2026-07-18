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
import CalculatorPage from '@/pages/calculators/CalculatorPage';
import BasicCalculator from '@/pages/calculators/BasicCalculator';
import ScientificCalculator from '@/pages/calculators/ScientificCalculator';
import CoinFlipTool from '@/pages/calculators/CoinFlipTool';
import DiceRollerTool from '@/pages/calculators/DiceRollerTool';
import CompassTool from '@/pages/calculators/CompassTool';
import ConverterPage from '@/pages/converters/ConverterPage';
import DevToolPage from '@/pages/devtools/DevToolPage';
import TextToolsPage from '@/pages/texttools/TextToolsPage';
import MorseCodeTool from '@/pages/texttools/MorseCodeTool';
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
        <Route path="/calculator/basic" element={<BasicCalculator />} />
        <Route path="/calculator/scientific" element={<ScientificCalculator />} />
        <Route path="/calculator/coin-flip" element={<CoinFlipTool />} />
        <Route path="/calculator/dice-roller" element={<DiceRollerTool />} />
        <Route path="/calculator/compass" element={<CompassTool />} />
        <Route path="/calculator/:id" element={<CalculatorPage />} />
        <Route path="/converter/:categoryId" element={<ConverterPage />} />
        <Route path="/devtool/:id" element={<DevToolPage />} />
        <Route path="/texttool/morse-code" element={<MorseCodeTool />} />
        <Route path="/texttool/:id" element={<TextToolsPage />} />
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
