"use client";

import React, { useState, useEffect, useMemo, memo, Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, Transition } from "@headlessui/react";
import {
  Camera, MapPin, Truck, AlertTriangle, CheckCircle, Clock, Users, FileText,
  Bell, Wifi, WifiOff, Star, TrendingUp, Shield, Zap, ChevronRight,
  X, Settings, Activity, Wind, Thermometer, Droplets, Eye, Upload,
  Filter, Search, MessageSquare, Heart, Phone
} from "lucide-react";

// Mock data with enhanced structure
const mockUser = {
  name: "Rajesh Kumar",
  role: "Farmer",
  farmName: "Green Valley Farm",
  location: "Siliguri, West Bengal",
  avatar: "👨‍🌾",
  memberSince: "2022",
  totalClaims: 8,
  approvedClaims: 6,
  rating: 4.8,
  farmArea: "5.2 hectares",
  crops: ["Rice", "Wheat", "Potato"]
};

const mockClaims = [
  { 
    id: 1, 
    type: "Crop Damage", 
    status: "approved", 
    amount: "₹25,000", 
    date: "2024-01-15",
    description: "Hail damage to rice crop",
    photos: 3,
    progress: 100
  },
  { 
    id: 2, 
    type: "Weather Loss", 
    status: "pending", 
    amount: "₹18,500", 
    date: "2024-01-20",
    description: "Flood damage assessment",
    photos: 5,
    progress: 60
  },
  { 
    id: 3, 
    type: "Pest Damage", 
    status: "processing", 
    amount: "₹12,000", 
    date: "2024-01-25",
    description: "Locust swarm damage to wheat",
    photos: 2,
    progress: 30
  }
];

const mockTrucks = [
  { 
    id: 1, 
    driver: "Amit Singh", 
    driverRating: 4.9,
    status: "en-route", 
    eta: "2 hours", 
    location: "Darjeeling Road",
    cargo: "Fertilizers",
    phone: "+91 98765 43210"
  },
  { 
    id: 2, 
    driver: "Priya Sharma", 
    driverRating: 4.7,
    status: "delivered", 
    eta: "Delivered", 
    location: "Your Farm",
    cargo: "Seeds",
    phone: "+91 98765 43211"
  }
];

const mockWeatherAlert = {
  type: "Heavy Rain Warning",
  description: "Expected 50-70mm rainfall in next 24 hours",
  severity: "moderate",
  validUntil: "2024-01-28 18:00",
  temperature: "24°C",
  humidity: "78%",
  windSpeed: "12 km/h"
};

const mockEquipment = [
  { 
    id: 1,
    name: "John Deere 5075E Tractor", 
    price: "₹2,500/day", 
    distance: "3.2km", 
    available: true,
    rating: 4.8,
    reviews: 24,
    owner: "Suresh Equipment Rental",
    features: ["GPS Enabled", "AC Cabin", "Power Steering"]
  },
  { 
    id: 2,
    name: "Mahindra Arjun 605 DI", 
    price: "₹4,000/day", 
    distance: "5.8km", 
    available: true,
    rating: 4.6,
    reviews: 18,
    owner: "Rural Machinery Co.",
    features: ["Heavy Duty", "4WD", "Hydraulic Lift"]
  },
  { 
    id: 3,
    name: "Sprayer Equipment Pro", 
    price: "₹800/day", 
    distance: "1.5km", 
    available: false,
    rating: 4.3,
    reviews: 12,
    owner: "AgriTools Rental",
    features: ["Precision Spray", "Tank 500L", "Self Propelled"]
  }
];

const mockWeatherForecast = [
  { day: "Today", temp: "25°C", condition: "Rainy", icon: "🌧️" },
  { day: "Tomorrow", temp: "27°C", condition: "Cloudy", icon: "☁️" },
  { day: "Day After", temp: "28°C", condition: "Sunny", icon: "☀️" }
];

// Multilingual support
const translations = {
  en: {
    welcome: "Welcome to AgriTrust Connect",
    fileClaim: "File New Claim",
    dashboard: "Dashboard",
    mapView: "Map View",
    equipment: "Equipment",
    activeClaims: "Active Claims",
    deliveries: "Deliveries",
    farmArea: "Farm Area",
    successRate: "Success Rate",
    recentClaims: "Recent Claims",
    truckDeliveries: "Live Deliveries",
    equipmentRental: "Equipment Rental",
    weatherForecast: "Weather Forecast",
    search: "Search",
    noResults: "No results found",
    cancel: "Cancel",
    submit: "Submit Claim",
    feedback: "Provide Feedback",
    pendingSync: "Pending Sync",
    cachedData: "Some data will sync when connection is restored"
  },
  hi: {
    welcome: "एग्रीट्रस्ट कनेक्ट में आपका स्वागत है",
    fileClaim: "नया दावा दर्ज करें",
    dashboard: "डैशबोर्ड",
    mapView: "मानचित्र दृश्य",
    equipment: "उपकरण",
    activeClaims: "सक्रिय दावे",
    deliveries: "वितरण",
    farmArea: "खेत का क्षेत्र",
    successRate: "सफलता दर",
    recentClaims: "हाल के दावे",
    truckDeliveries: "लाइव डेलिवरी",
    equipmentRental: "उपकरण किराया",
    weatherForecast: "मौसम पूर्वानुमान",
    search: "खोज",
    noResults: "कोई परिणाम नहीं मिला",
    cancel: "रद्द करें",
    submit: "दावा जमा करें",
    feedback: "प्रतिक्रिया दें",
    pendingSync: "लंबित सिंक",
    cachedData: "कनेक्शन बहाल होने पर कुछ डेटा सिंक होगा"
  }
};

const AgriTrustDemo = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [syncStatus, setSyncStatus] = useState("synced");
  const [language, setLanguage] = useState<keyof typeof translations>("en");
  type ToastType = "success" | "error" | "info";
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [claimSearch, setClaimSearch] = useState("");
  const [truckSearch, setTruckSearch] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  type TranslationKeys = keyof typeof translations["en"];

  const t = (key: TranslationKeys): string =>
    translations[language]?.[key] || translations.en[key] || key;

  // Simulate offline/online status with better UX
  useEffect(() => {
    const interval = setInterval(() => {
      const online = Math.random() > 0.1;
      setIsOnline(online);
      setSyncStatus(online ? "synced" : "pending");
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const showToast = (message: string, type: ToastType = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const StatusBadge = memo(({ status, children }: { status: string; children: React.ReactNode }) => {
    const styles = {
      approved: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-lg shadow-emerald-500/20",
      pending: "bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-lg shadow-amber-500/20",
      processing: "bg-blue-500/20 text-blue-300 border-blue-500/40 shadow-lg shadow-blue-500/20",
      "en-route": "bg-orange-500/20 text-orange-300 border-orange-500/40 shadow-lg shadow-orange-500/20",
      delivered: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-lg shadow-emerald-500/20"
    };
    const cls = (styles as any)[status] ?? "";

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-sm ${cls}`}>
        {children}
      </span>
    );
  });

  type StatColor = 'emerald' | 'blue' | 'purple' | 'orange';
  const StatCard = memo(({ icon: Icon, title, value, trend, color = "emerald" }: { icon: React.ComponentType<any>; title: string; value: string; trend?: string; color?: StatColor }) => {
    const colorClasses: Record<StatColor, string> = {
      emerald: "from-emerald-600 to-green-600",
      blue: "from-blue-600 to-cyan-600",
      purple: "from-purple-600 to-pink-600",
      orange: "from-orange-600 to-amber-600"
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.3 }}
        className="group bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm border border-gray-700/60 rounded-2xl p-6 hover:border-gray-600/60 transition-all duration-300 shadow-xl hover:shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <div className={`p-3 rounded-xl bg-gradient-to-r ${colorClasses[color]} shadow-lg`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          {trend && (
            <div className="flex items-center text-emerald-400">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">+{trend}%</span>
            </div>
          )}
        </div>
        <div className="mt-4">
          <h3 className="text-gray-300 text-sm font-medium">{title}</h3>
          <p className="text-white text-2xl font-bold mt-1">{value}</p>
        </div>
      </motion.div>
    );
  });

  const ClaimFormModal = memo(() => (
    <Transition appear show={showClaimForm} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => setShowClaimForm(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-sm border border-gray-700/60 p-8 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title className="text-2xl font-bold text-white">{t("fileClaim")}</Dialog.Title>
                  <button 
                    onClick={() => setShowClaimForm(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="text-gray-300 text-sm font-medium block mb-2">Claim Type</label>
                    <select className="w-full bg-gray-900/60 border border-gray-600/50 rounded-xl p-3 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all">
                      <option>Crop Damage</option>
                      <option>Weather Loss</option>
                      <option>Pest Damage</option>
                      <option>Equipment Failure</option>
                      <option>Natural Disaster</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-gray-300 text-sm font-medium block mb-2">Affected Area</label>
                    <div className="grid grid-cols-2 gap-4">
                      <input 
                        type="number" 
                        placeholder="Area (hectares)"
                        className="bg-gray-900/60 border border-gray-600/50 rounded-xl p-3 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                      />
                      <input 
                        type="text" 
                        placeholder="Crop Type"
                        className="bg-gray-900/60 border border-gray-600/50 rounded-xl p-3 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-gray-300 text-sm font-medium block mb-2">Description</label>
                    <textarea 
                      className="w-full bg-gray-900/60 border border-gray-600/50 rounded-xl p-3 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all" 
                      rows={3}
                      placeholder="Describe the damage in detail..."
                    />
                  </div>
                  
                  <div>
                    <label className="text-gray-300 text-sm font-medium block mb-2">Evidence</label>
                    <div className="border-2 border-dashed border-gray-600/50 rounded-xl p-6 text-center hover:border-emerald-500/50 transition-colors bg-gray-900/30">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm mb-2">Drop photos here or click to upload</p>
                      <button className="bg-gray-700/50 hover:bg-gray-600/50 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 mx-auto transition-colors">
                        <Camera className="h-4 w-4" />
                        Take Photo
                      </button>
                    </div>
                    {!isOnline && (
                      <p className="text-amber-400 text-xs mt-2 flex items-center gap-1">
                        <WifiOff className="h-3 w-3" />
                        Photos will sync when online
                      </p>
                    )}
                  </div>
                  
                  <div className="bg-emerald-900/30 border border-emerald-500/40 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-emerald-400" />
                      <span className="text-emerald-300">Location verified within farm boundary</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm mt-1">
                      <MapPin className="h-4 w-4 text-emerald-400" />
                      <span className="text-emerald-300">GPS: 26.7271° N, 88.3953° E</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4 mt-8">
                  <button 
                    onClick={() => setShowClaimForm(false)}
                    className="flex-1 bg-gray-700/60 hover:bg-gray-600/60 text-white py-3 rounded-xl font-medium transition-all"
                    disabled={isSubmitting}
                  >
                    {t("cancel")}
                  </button>
                  <button 
                    onClick={() => {
                      setIsSubmitting(true);
                      setTimeout(() => {
                        setIsSubmitting(false);
                        setShowClaimForm(false);
                        const message = isOnline 
                          ? "✅ Claim submitted successfully! You'll receive updates via SMS and app notifications."
                          : "💾 Claim saved offline! Will be submitted automatically when connection is restored.";
                        showToast(message);
                      }, 1500);
                    }}
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white py-3 rounded-xl font-semibold transition-all shadow-lg disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : t("submit")}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  ));

  const FeedbackModal = memo(() => (
    <Transition appear show={showFeedback} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => setShowFeedback(false)}>
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-sm border border-gray-700/60 p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <Dialog.Title className="text-xl font-bold text-white">{t("feedback")}</Dialog.Title>
                  <button onClick={() => setShowFeedback(false)} className="text-gray-400 hover:text-white transition-colors">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <textarea placeholder="Your feedback..." className="w-full p-3 rounded-xl bg-gray-900/60 text-white border border-gray-600/50 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all" rows="4" />
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setShowFeedback(false)} className="flex-1 bg-gray-700/60 hover:bg-gray-600/60 text-white py-2 rounded-xl transition-all">{t("cancel")}</button>
                  <button onClick={() => { setShowFeedback(false); showToast("Feedback submitted!"); }} className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white py-2 rounded-xl font-semibold transition-all">{t("submit")}</button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  ));

  const DashboardView = memo(() => {
    const filteredClaims = useMemo(() => 
      mockClaims.filter(claim => 
        claim.type.toLowerCase().includes(claimSearch.toLowerCase()) ||
        claim.status.toLowerCase().includes(claimSearch.toLowerCase())
      ), [claimSearch]
    );

    const filteredTrucks = useMemo(() =>
      mockTrucks.filter(truck => 
        truck.driver.toLowerCase().includes(truckSearch.toLowerCase()) ||
        truck.location.toLowerCase().includes(truckSearch.toLowerCase())
      ), [truckSearch]
    );

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="space-y-8"
      >
        {/* Enhanced Weather Alert */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-gradient-to-r from-orange-900/40 to-red-900/40 backdrop-blur-sm border border-orange-500/40 rounded-2xl p-6 shadow-2xl shadow-orange-500/10"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-orange-500/20 rounded-xl">
              <AlertTriangle className="h-6 w-6 text-orange-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-orange-200 font-semibold text-lg">{mockWeatherAlert.type}</h3>
                <span className="text-orange-400 text-sm bg-orange-500/20 px-2 py-1 rounded-full">Active</span>
              </div>
              <p className="text-orange-300 mt-1">{mockWeatherAlert.description}</p>
              
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <Thermometer className="h-4 w-4 text-orange-400" />
                  <span className="text-orange-200 text-sm">{mockWeatherAlert.temperature}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-orange-400" />
                  <span className="text-orange-200 text-sm">{mockWeatherAlert.humidity}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Wind className="h-4 w-4 text-orange-400" />
                  <span className="text-orange-200 text-sm">{mockWeatherAlert.windSpeed}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Weather Forecast */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm border border-gray-700/60 rounded-2xl p-6 shadow-2xl"
        >
          <h3 className="text-white text-xl font-bold mb-6">{t("weatherForecast")}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {mockWeatherForecast.map((forecast, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-gray-900/70 rounded-xl p-4 text-center hover:bg-gray-900/90 transition-colors"
              >
                <p className="text-white font-medium">{forecast.day}</p>
                <div className="text-3xl my-2">{forecast.icon}</div>
                <p className="text-emerald-400 text-lg font-bold">{forecast.temp}</p>
                <p className="text-gray-300 text-sm">{forecast.condition}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Enhanced Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard icon={FileText} title={t("activeClaims")} value="3" trend="12" color="emerald" />
          <StatCard icon={Truck} title={t("deliveries")} value="2" trend="8" color="blue" />
          <StatCard icon={MapPin} title={t("farmArea")} value="5.2ha" color="purple" />
          <StatCard icon={Shield} title={t("successRate")} value="97%" trend="5" color="orange" />
        </div>

        {/* Enhanced File Claim CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-gradient-to-r from-emerald-900/50 to-green-900/50 backdrop-blur-sm border border-emerald-500/40 rounded-2xl p-8 shadow-2xl shadow-emerald-500/10"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-emerald-200 text-2xl font-bold mb-2">Need to File a Claim?</h3>
              <p className="text-emerald-300 mb-6">Quick and easy claim filing with offline support and AI-assisted damage assessment</p>
              <div className="flex items-center gap-6 text-sm text-emerald-400">
                <div className="flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  <span>Photo Upload</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>GPS Verification</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  <span>Instant Processing</span>
                </div>
              </div>
            </div>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowClaimForm(true)}
              className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center gap-2"
            >
              {t("fileClaim")}
              <ChevronRight className="h-5 w-5" />
            </motion.button>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Enhanced Recent Claims */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm border border-gray-700/60 rounded-2xl p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white text-xl font-bold">{t("recentClaims")}</h3>
              <button className="text-emerald-400 hover:text-emerald-300 text-sm font-medium">
                View All
              </button>
            </div>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={t("search")}
                  value={claimSearch}
                  onChange={(e) => setClaimSearch(e.target.value)}
                  className="w-full p-3 pl-10 rounded-xl bg-gray-900/60 text-white border border-gray-600/50 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                />
              </div>
            </div>
            <div className="space-y-4">
              {filteredClaims.length > 0 ? (
                filteredClaims.map((claim) => (
                  <motion.div
                    key={claim.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className="bg-gray-900/70 backdrop-blur-sm border border-gray-700/40 rounded-xl p-4 hover:border-gray-600/60 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-white font-semibold">{claim.type}</h4>
                          <StatusBadge status={claim.status}>
                            {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                          </StatusBadge>
                        </div>
                        <p className="text-gray-400 text-sm mb-2">{claim.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                          <span>{claim.date}</span>
                          <span>📷 {claim.photos} photos</span>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>Progress</span>
                            <span>{claim.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-700/60 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-emerald-500 to-green-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${claim.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-emerald-400 font-bold text-lg">{claim.amount}</p>
                      </div>
                    </div>
                                    </motion.div>
                ))
              ) : (
                <p className="text-gray-400 text-center">{t("noResults")}</p>
              )}
            </div>
          </motion.div>

          {/* Enhanced Live Deliveries */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm border border-gray-700/60 rounded-2xl p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white text-xl font-bold">{t("truckDeliveries")}</h3>
              <button className="text-emerald-400 hover:text-emerald-300 text-sm font-medium">
                Track All
              </button>
            </div>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={t("search")}
                  value={truckSearch}
                  onChange={(e) => setTruckSearch(e.target.value)}
                  className="w-full p-3 pl-10 rounded-xl bg-gray-900/60 text-white border border-gray-600/50 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                />
              </div>
            </div>
            <div className="space-y-4">
              {filteredTrucks.length > 0 ? (
                filteredTrucks.map((truck) => (
                  <motion.div
                    key={truck.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className="bg-gray-900/70 backdrop-blur-sm border border-gray-700/40 rounded-xl p-4 hover:border-gray-600/60 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-white font-semibold">{truck.driver}</h4>
                          <StatusBadge status={truck.status}>
                            {truck.status.charAt(0).toUpperCase() + truck.status.slice(1)}
                          </StatusBadge>
                        </div>
                        <p className="text-gray-400 text-sm mb-2">{truck.cargo}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {truck.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {truck.eta}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Star className="h-4 w-4 text-yellow-400" />
                          <span className="text-gray-300">{truck.driverRating}/5</span>
                          <a href={`tel:${truck.phone}`} className="ml-auto text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            Contact
                          </a>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-gray-400 text-center">{t("noResults")}</p>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  });

  const MapView = memo(() => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm border border-gray-700/60 rounded-2xl p-6 shadow-2xl">
        <h3 className="text-white text-xl font-bold mb-6">{t("mapView")}</h3>
        <div className="h-[400px] bg-gray-900/70 rounded-xl flex items-center justify-center">
          <p className="text-gray-400">Interactive Map Placeholder (Farm Boundaries, Truck Locations, Weather Overlay)</p>
        </div>
        <div className="mt-4 flex gap-4">
          <button className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white py-3 rounded-xl font-semibold transition-all shadow-lg">
            <MapPin className="inline-block h-5 w-5 mr-2" />
            Show Farm Boundaries
          </button>
          <button className="flex-1 bg-gray-700/60 hover:bg-gray-600/60 text-white py-3 rounded-xl font-semibold transition-all">
            <Filter className="inline-block h-5 w-5 mr-2" />
            Filter Layers
          </button>
        </div>
      </div>
    </motion.div>
  ));

  const EquipmentView = memo(() => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm border border-gray-700/60 rounded-2xl p-6 shadow-2xl">
        <h3 className="text-white text-xl font-bold mb-6">{t("equipmentRental")}</h3>
        <div className="space-y-4">
          {mockEquipment.map((equip) => (
            <motion.div
              key={equip.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-gray-900/70 backdrop-blur-sm border border-gray-700/40 rounded-xl p-4 hover:border-gray-600/60 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white font-semibold">{equip.name}</h4>
                    <span className={`text-sm font-medium px-3 py-1 rounded-full ${equip.available ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>
                      {equip.available ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-2">{equip.owner}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {equip.distance}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400" />
                      {equip.rating} ({equip.reviews} reviews)
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {equip.features.map((feature, i) => (
                      <span key={i} className="text-xs bg-gray-800/60 text-gray-300 px-2 py-1 rounded-full">
                        {feature}
                      </span>
                    ))}
                  </div>
                  <button className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50"
                    disabled={!equip.available}
                  >
                    Rent Now - {equip.price}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  ));

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white font-sans">
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-900/95 to-gray-800/95 backdrop-blur-sm border-b border-gray-700/60 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-3xl">{mockUser.avatar}</div>
            <div>
              <h1 className="text-xl font-bold">{mockUser.name}</h1>
              <p className="text-sm text-gray-400">{mockUser.farmName} • {mockUser.location}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              {isOnline ? (
                <Wifi className="h-5 w-5 text-emerald-400" />
              ) : (
                <WifiOff className="h-5 w-5 text-amber-400" />
              )}
              <span className={isOnline ? 'text-emerald-400' : 'text-amber-400'}>
                {isOnline ? 'Online' : t('pendingSync')}
              </span>
            </div>
            <button 
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="text-gray-400 hover:text-white transition-colors"
            >
              {language === 'en' ? 'हिन्दी' : 'English'}
            </button>
            <button 
              onClick={() => setShowFeedback(true)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <MessageSquare className="h-5 w-5" />
            </button>
            <button className="text-gray-400 hover:text-white transition-colors">
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex gap-4 border-b border-gray-700/60">
          {['dashboard', 'mapView', 'equipment'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 px-1 font-medium text-sm transition-colors ${
                activeTab === tab
                  ? 'text-emerald-400 border-b-2 border-emerald-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {t(tab)}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && <DashboardView key="dashboard" />}
          {activeTab === 'mapView' && <MapView key="mapView" />}
          {activeTab === 'equipment' && <EquipmentView key="equipment" />}
        </AnimatePresence>
      </main>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-4 right-4 max-w-sm p-4 rounded-xl shadow-2xl border flex items-center gap-2 ${
              toast.type === 'success'
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-200'
                : 'bg-amber-500/20 border-amber-500/40 text-amber-200'
            }`}
          >
            <CheckCircle className="h-5 w-5" />
            <p>{toast.message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <ClaimFormModal />
      <FeedbackModal />
    </div>
  );
};

export default AgriTrustDemo;