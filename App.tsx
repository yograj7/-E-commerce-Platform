
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Package, 
  ShoppingCart, 
  LayoutDashboard, 
  History, 
  Plus, 
  Trash2, 
  CheckCircle, 
  Search,
  LogOut,
  User as UserIcon,
  ShoppingBag,
  TrendingUp,
  BrainCircuit,
  Settings,
  Menu,
  X,
  ChevronRight,
  Star,
  Zap,
  Tag,
  Clock,
  Heart,
  Truck,
  ArrowLeft,
  ShieldCheck,
  RotateCcw,
  Crown,
  CreditCard,
  MapPin,
  Mail,
  Sparkles,
  Share2,
  BarChart3,
  Layers,
  Image as ImageIcon,
  Edit3,
  DollarSign,
  Phone,
  Wallet,
  Smartphone,
  ArrowRight,
  Grid,
  Shield
} from 'lucide-react';
import { 
  Category, 
  Product, 
  Order, 
  User, 
  CartItem, 
  OrderStatus 
} from './types';
import { INITIAL_PRODUCTS, MOCK_ADMIN, MOCK_CUSTOMER } from './constants';
import { getSalesInsights, getAIProductRecommendations } from './services/geminiService';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';

// --- Utility Functions ---

const handleShareProduct = async (product: Product) => {
  const shareData = {
    title: `Check out ${product.name} on Maharaj Wholesale!`,
    text: `${product.brand} - ${product.name}. Royal price: ₹${product.price.toLocaleString()}.`,
    url: `${window.location.origin}?product=${product.id}`
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(shareData.url);
      alert('Imperial link copied to clipboard!');
    }
  } catch (err) {
    console.error('Share failed:', err);
  }
};

// --- Premium UI Components ---

const CategoryChip: React.FC<{ icon: string, label: string, isActive: boolean, onClick: () => void }> = ({ icon, label, isActive, onClick }) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-center gap-3 group min-w-[100px] transition-all"
  >
    <div className={`w-20 h-20 rounded-[1.75rem] flex items-center justify-center text-3xl shadow-sm border-2 transition-all duration-300 transform ${
      isActive 
        ? 'bg-amber-500 border-slate-900 scale-110 shadow-amber-200 shadow-xl -translate-y-1' 
        : 'bg-white border-slate-100 group-hover:border-amber-300 group-hover:bg-amber-50/50 group-hover:-translate-y-1 shadow-inner'
    }`}>
      {icon}
    </div>
    <span className={`text-[12px] font-black tracking-widest uppercase transition-colors ${
      isActive ? 'text-amber-600' : 'text-slate-500 group-hover:text-amber-500'
    }`}>
      {label}
    </span>
  </button>
);

const MaharajProductCard: React.FC<{ 
  product: Product, 
  onAddToCart: () => void,
  onBuyNow: () => void,
  onViewDetails: () => void,
  isAI?: boolean 
}> = ({ product, onAddToCart, onBuyNow, onViewDetails, isAI }) => {
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <div 
      onClick={onViewDetails}
      className="bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition-all group flex flex-col relative h-full cursor-pointer"
    >
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
        <button 
          onClick={(e) => { e.stopPropagation(); }}
          className="p-2 rounded-xl bg-white/90 backdrop-blur-sm text-slate-300 hover:text-rose-500 transition-all shadow-sm border border-slate-50"
        >
          <Heart size={14} />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); handleShareProduct(product); }}
          className="p-2 rounded-xl bg-white/90 backdrop-blur-sm text-slate-400 hover:text-amber-600 transition-all shadow-sm border border-slate-50"
          title="Share Product"
        >
          <Share2 size={14} />
        </button>
      </div>

      {isAI && (
        <div className="absolute top-3 left-3 z-10 bg-slate-900 text-amber-400 text-[9px] font-black px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-lg border border-amber-400/20">
          <Sparkles size={8} /> Recommended
        </div>
      )}

      <div className="aspect-[3/4] overflow-hidden bg-slate-50 relative">
        <img 
          src={product.images[0]} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-[9px] font-black text-amber-600 uppercase tracking-[0.1em]">{product.brand}</p>
        </div>
        
        <h3 className="text-sm font-bold text-slate-800 line-clamp-1 mb-2 leading-tight transition-colors">
          {product.name}
        </h3>

        <div className="mt-auto">
          <div className="flex items-end gap-2 mb-2">
            <span className="text-lg font-black text-slate-900 tracking-tighter">₹{product.price.toLocaleString()}</span>
            <span className="text-[10px] text-slate-300 line-through font-bold pb-0.5">₹{product.originalPrice.toLocaleString()}</span>
            <span className="text-[9px] font-black text-emerald-500 mb-0.5">{discount}% OFF</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-2">
          <button 
            onClick={(e) => { e.stopPropagation(); onAddToCart(); }}
            className="text-[9px] font-black py-2.5 border border-slate-200 rounded-lg text-slate-600 bg-white hover:bg-slate-50 transition-colors uppercase tracking-widest"
          >
            Add
          </button>
          <button 
            className="text-[9px] font-black py-2.5 bg-amber-500 rounded-lg text-slate-900 hover:bg-amber-600 transition-colors uppercase tracking-widest"
            onClick={(e) => { e.stopPropagation(); onBuyNow(); }}
          >
            Buy
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('marketplace');
  const [adminSubTab, setAdminSubTab] = useState<'overview' | 'inventory' | 'categories'>('overview');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [aiInsights, setAiInsights] = useState<string>('');

  // Checkout Steps State
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'address' | 'payment'>('cart');
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    phone: '',
    addressLine: '',
    city: '',
    pincode: ''
  });
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi' | 'card'>('cod');
  
  // Admin Form State
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [formDiscount, setFormDiscount] = useState(0);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    brand: '',
    category: Category.SHOES,
    price: 0,
    originalPrice: 0,
    description: '',
    images: [''],
    stock: 50,
    rating: 4.5,
    reviews: 0
  });

  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedProducts = localStorage.getItem('maharaj_products');
    const savedOrders = localStorage.getItem('maharaj_orders');
    
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      setProducts(INITIAL_PRODUCTS);
      localStorage.setItem('maharaj_products', JSON.stringify(INITIAL_PRODUCTS));
    }
    if (savedOrders) setOrders(JSON.parse(savedOrders));

    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    localStorage.setItem('maharaj_products', JSON.stringify(products));
    localStorage.setItem('maharaj_orders', JSON.stringify(orders));
  }, [products, orders]);

  useEffect(() => {
    if (user?.role === 'CUSTOMER' && activeTab === 'marketplace') {
      const fetchRecommendations = async () => {
        const lastCategory = orders[0]?.items[0]?.product.category || 'Shoes';
        const ids = await getAIProductRecommendations(lastCategory, products);
        const recommendedProducts = products.filter(p => ids.includes(p.id));
        setRecommendations(recommendedProducts);
      };
      fetchRecommendations();
    }
    
    if (user?.role === 'ADMIN' && activeTab === 'dashboard' && adminSubTab === 'overview') {
      getSalesInsights(orders).then(setAiInsights);
    }
  }, [user, activeTab, orders, products, adminSubTab]);

  useEffect(() => {
    if (newProduct.originalPrice) {
      const calculatedPrice = Math.round(newProduct.originalPrice * (1 - formDiscount / 100));
      setNewProduct(prev => ({ ...prev, price: calculatedPrice }));
    }
  }, [formDiscount, newProduct.originalPrice]);

  const navigateTo = (tab: string) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
    setSelectedProduct(null);
    setIsAddingProduct(false);
    setCheckoutStep('cart');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleBuyNow = (product: Product) => {
    handleAddToCart(product);
    navigateTo('cart');
    setCheckoutStep('address');
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const handlePlaceOrder = () => {
    if (cart.length === 0) return;
    if (!shippingAddress.fullName || !shippingAddress.addressLine || !shippingAddress.pincode) {
      alert("Please enter a valid royal address.");
      return;
    }

    const fullAddress = `${shippingAddress.addressLine}, ${shippingAddress.city} - ${shippingAddress.pincode}. Recipient: ${shippingAddress.fullName} (${shippingAddress.phone})`;

    const newOrder: Order = {
      id: `MJR-${Date.now().toString().slice(-6)}`,
      userId: user?.id || 'guest',
      items: [...cart],
      totalAmount: cartTotal,
      status: OrderStatus.PENDING,
      createdAt: new Date().toISOString(),
      shippingAddress: fullAddress
    };
    setOrders([newOrder, ...orders]);
    setCart([]);
    setCheckoutStep('cart');
    navigateTo('orders');
    alert('Order placed successfully! Your Maharaj delivery is being prepared.');
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.brand || !newProduct.images?.some(img => img.trim() !== '')) {
      alert('Please fill the royal scrolls completely with at least one portrait.');
      return;
    }
    const product: Product = {
      ...newProduct as Product,
      id: `P-${Date.now()}`,
      images: newProduct.images?.filter(img => img.trim() !== '') || []
    };
    setProducts([product, ...products]);
    setIsAddingProduct(false);
    setFormDiscount(0);
    setNewProduct({
      name: '',
      brand: '',
      category: Category.SHOES,
      price: 0,
      originalPrice: 0,
      description: '',
      images: [''],
      stock: 50,
      rating: 4.5,
      reviews: 0
    });
    alert('Imperial inventory updated.');
  };

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    return products.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  const suggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return products.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.brand.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5);
  }, [products, searchQuery]);

  const cartTotal = useMemo(() => cart.reduce((a, b) => a + (b.product.price * b.quantity), 0), [cart]);

  // Role Selection Logic (Mock Login)
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl w-full max-w-md animate-in zoom-in duration-500 border border-slate-800">
          <div className="flex flex-col items-center mb-12">
            <div className="w-24 h-24 bg-amber-500 rounded-[2rem] flex items-center justify-center text-slate-900 mb-6 shadow-2xl rotate-3">
              <Crown size={48} />
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter text-center uppercase italic">MAHARAJ</h1>
            <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.4em] mt-3">The Royal Wholesale</p>
          </div>
          
          <div className="space-y-6">
            <button 
              onClick={() => { setUser(MOCK_CUSTOMER); navigateTo('marketplace'); }}
              className="w-full bg-slate-50 border border-slate-100 p-8 rounded-3xl flex items-center justify-between group hover:border-amber-500 hover:bg-amber-50/30 transition-all duration-300"
            >
              <div className="flex items-center gap-5">
                <div className="p-4 bg-white rounded-2xl shadow-sm group-hover:bg-amber-500 group-hover:text-white transition-colors">
                  <UserIcon size={24} />
                </div>
                <div className="text-left">
                  <p className="font-black text-slate-800 text-sm uppercase tracking-wider">Citizen Entrance</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Shop The Vault</p>
                </div>
              </div>
              <ChevronRight className="text-slate-300 group-hover:text-amber-600" />
            </button>

            <button 
              onClick={() => { setUser(MOCK_ADMIN); navigateTo('dashboard'); }}
              className="w-full bg-slate-50 border border-slate-100 p-8 rounded-3xl flex items-center justify-between group hover:border-amber-500 hover:bg-amber-50/30 transition-all duration-300"
            >
              <div className="flex items-center gap-5">
                <div className="p-4 bg-white rounded-2xl shadow-sm group-hover:bg-amber-500 group-hover:text-white transition-colors">
                  <Settings size={24} />
                </div>
                <div className="text-left">
                  <p className="font-black text-slate-800 text-sm uppercase tracking-wider">Royal Steward</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Command Center</p>
                </div>
              </div>
              <ChevronRight className="text-slate-300 group-hover:text-amber-600" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfcfd]">
      {/* Sidebar Mobile */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-xl z-50 lg:hidden" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="bg-white w-80 h-full p-10 animate-in slide-in-from-left duration-500 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-16">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-slate-900 shadow-xl">
                  <Crown size={24} />
                </div>
                <span className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">MAHARAJ</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-3 bg-slate-50 rounded-2xl hover:bg-rose-50 hover:text-rose-500 transition-colors"><X size={20} /></button>
            </div>
            <nav className="space-y-8">
              {user.role === 'ADMIN' && (
                <button onClick={() => navigateTo('dashboard')} className="w-full flex items-center gap-5 p-5 rounded-2xl hover:bg-slate-50 font-black text-slate-700 uppercase text-xs tracking-[0.2em] transition-all">
                  <LayoutDashboard size={20} className="text-amber-500" /> Dashboard
                </button>
              )}
              <button onClick={() => navigateTo('marketplace')} className="w-full flex items-center gap-5 p-5 rounded-2xl hover:bg-slate-50 font-black text-slate-700 uppercase text-xs tracking-[0.2em] transition-all">
                <ShoppingBag size={20} className="text-amber-500" /> Market Vault
              </button>
              {user.role === 'CUSTOMER' && (
                <button onClick={() => navigateTo('categories')} className="w-full flex items-center gap-5 p-5 rounded-2xl hover:bg-slate-50 font-black text-slate-700 uppercase text-xs tracking-[0.2em] transition-all">
                  <Layers size={20} className="text-amber-500" /> Royal Categories
                </button>
              )}
              <button onClick={() => navigateTo('cart')} className="w-full flex items-center gap-5 p-5 rounded-2xl hover:bg-slate-50 font-black text-slate-700 uppercase text-xs tracking-[0.2em] transition-all">
                <ShoppingCart size={20} className="text-amber-500" /> My Cart
              </button>
              <button onClick={() => navigateTo('orders')} className="w-full flex items-center gap-5 p-5 rounded-2xl hover:bg-slate-50 font-black text-slate-700 uppercase text-xs tracking-[0.2em] transition-all">
                <History size={20} className="text-amber-500" /> Order History
              </button>
              <div className="pt-12 border-t border-slate-100">
                <button onClick={() => setUser(null)} className="w-full flex items-center gap-5 p-5 rounded-2xl text-rose-500 font-black uppercase text-xs tracking-[0.2em] hover:bg-rose-50 transition-all">
                  <LogOut size={20} /> Exit Kingdom
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-900 text-white shadow-2xl border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4 md:py-5 flex items-center transition-all duration-300 gap-6">
          {!isSearchFocused && (
            <div className="flex items-center gap-4 animate-in slide-in-from-left duration-300">
              <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2.5 hover:bg-slate-800 rounded-xl transition-all border border-slate-800">
                <Menu size={20} className="text-amber-500" />
              </button>
              <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigateTo('marketplace')}>
                <div className="w-10 h-10 md:w-11 md:h-11 bg-amber-500 rounded-xl flex items-center justify-center text-slate-900 shadow-xl group-hover:rotate-6 transition-transform">
                  <Crown size={24} />
                </div>
                <span className="text-xl md:text-2xl font-black italic tracking-tighter leading-none group-hover:text-amber-400 transition-colors uppercase">MAHARAJ</span>
              </div>
            </div>
          )}

          <div className="flex-1 relative" ref={searchRef}>
            <div className={`relative group flex items-center gap-4 transition-all duration-500`}>
              {isSearchFocused && (
                <button onClick={() => setIsSearchFocused(false)} className="p-2.5 hover:bg-slate-800 rounded-xl text-amber-500 animate-in fade-in duration-300">
                  <ArrowLeft size={20} />
                </button>
              )}
              <div className="relative flex-1">
                <input 
                  type="text" 
                  placeholder="Search the Royal Collection..."
                  className={`w-full bg-slate-800/50 text-white rounded-xl px-6 py-3 pl-12 pr-6 focus:ring-4 focus:ring-amber-500/20 focus:outline-none text-sm shadow-inner placeholder-slate-500 border border-slate-700 group-hover:bg-slate-800 transition-all`}
                  value={searchQuery}
                  onFocus={() => { setIsSearchFocused(true); setShowSuggestions(true); }}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSearchQuery(val);
                    setShowSuggestions(true);
                    if (val.length > 0 && (activeTab !== 'marketplace' || selectedProduct !== null)) {
                      setActiveTab('marketplace');
                      setSelectedProduct(null);
                    }
                  }}
                />
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500" />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-4 bg-white rounded-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] border border-slate-100 text-slate-800 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300 z-50">
                <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Royal Results</p>
                  <Sparkles size={14} className="text-amber-500" />
                </div>
                {suggestions.map(p => (
                  <button 
                    key={p.id}
                    onClick={() => { setSelectedProduct(p); setShowSuggestions(false); setIsSearchFocused(false); setSearchQuery(''); setActiveImageIndex(0); }}
                    className="w-full flex items-center gap-4 p-4 hover:bg-amber-50 text-left transition-all group border-b border-slate-50 last:border-0"
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden shadow-md">
                      <img src={p.images[0]} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-800 mb-0.5">{p.name}</p>
                      <p className="text-[9px] text-amber-600 font-black uppercase tracking-widest">{p.brand}</p>
                    </div>
                    <ArrowRight size={14} className="text-slate-300 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-x-hidden pb-24">
        {selectedProduct ? (
          <div className="animate-in fade-in slide-in-from-bottom-12 duration-700 bg-white min-h-screen">
            <div className="max-w-7xl mx-auto px-6 py-10 md:py-20">
              <div className="flex items-center justify-between mb-12">
                <button 
                  onClick={() => { setSelectedProduct(null); setActiveImageIndex(0); }}
                  className="flex items-center gap-4 text-slate-400 font-black text-[12px] uppercase tracking-[0.3em] hover:text-amber-600 transition-all group"
                >
                  <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to Catalog
                </button>
                <button 
                  onClick={() => handleShareProduct(selectedProduct)}
                  className="flex items-center gap-2 bg-slate-50 text-slate-600 font-black py-2.5 px-6 rounded-2xl shadow-sm hover:bg-amber-50 hover:text-amber-600 transition-all uppercase text-[10px] tracking-widest border border-slate-100"
                >
                  <Share2 size={16} /> Share Product
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32">
                <div className="space-y-6">
                  <div className="aspect-[4/5] bg-slate-50 rounded-[3rem] overflow-hidden shadow-2xl border border-slate-100 relative">
                    <img src={selectedProduct.images[activeImageIndex]} alt={selectedProduct.name} className="w-full h-full object-cover transition-opacity duration-500" />
                  </div>
                  <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-2">
                    {selectedProduct.images.map((img, idx) => (
                      <button key={idx} onClick={() => setActiveImageIndex(idx)} className={`w-20 h-20 rounded-2xl border-2 flex-shrink-0 overflow-hidden transition-all ${activeImageIndex === idx ? 'border-amber-500 scale-105 shadow-lg' : 'border-transparent opacity-60'}`}>
                        <img src={img} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-6 mt-8">
                    <button onClick={() => handleAddToCart(selectedProduct)} className="bg-white border-2 border-slate-900 text-slate-900 font-black py-5 rounded-2xl shadow-lg hover:bg-slate-50 flex items-center justify-center gap-3 uppercase text-xs tracking-widest transition-colors"><ShoppingCart size={18} /> Add to Bag</button>
                    <button onClick={() => handleBuyNow(selectedProduct)} className="bg-amber-500 text-slate-900 font-black py-5 rounded-2xl shadow-lg hover:bg-amber-600 flex items-center justify-center gap-3 uppercase text-xs tracking-widest transition-colors"><Zap size={18} /> Buy Royal</button>
                  </div>
                </div>

                <div className="flex flex-col">
                  <div className="mb-10">
                    <div className="flex items-center gap-4 mb-5">
                      <span className="text-[12px] font-black text-amber-600 uppercase tracking-[0.4em]">{selectedProduct.brand}</span>
                      <div className="h-0.5 w-12 bg-amber-100 rounded-full" />
                      <span className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.2em]">{selectedProduct.category}</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.1] mb-8 tracking-tighter uppercase italic">{selectedProduct.name}</h1>
                  </div>
                  <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 mb-12 shadow-inner">
                    <p className="text-amber-600 font-black text-[11px] uppercase tracking-[0.4em] mb-4">Royal Member Price</p>
                    <div className="flex items-end gap-6">
                      <span className="text-6xl font-black text-slate-900 tracking-tighter leading-none">₹{selectedProduct.price.toLocaleString()}</span>
                      <div className="flex flex-col mb-1">
                        <span className="text-xl text-slate-300 line-through font-black leading-none">₹{selectedProduct.originalPrice.toLocaleString()}</span>
                        <span className="text-sm font-black text-emerald-600 mt-2 bg-emerald-50 px-3 py-1 rounded-lg">-{Math.round(((selectedProduct.originalPrice - selectedProduct.price) / selectedProduct.originalPrice) * 100)}% DISCOUNT</span>
                      </div>
                    </div>
                  </div>
                  <div className="prose prose-slate">
                    <h3 className="font-black text-slate-900 uppercase text-xs tracking-[0.4em] mb-6">Imperial Details</h3>
                    <p className="text-slate-500 leading-relaxed italic text-lg">{selectedProduct.description}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === 'marketplace' ? (
          <div className="animate-in fade-in duration-1000">
            <div className="bg-slate-900 pb-20 md:pb-28 overflow-hidden relative">
              <div className="max-w-7xl mx-auto px-6 pt-10">
                <div className="bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 rounded-[3rem] p-10 md:p-16 h-[300px] md:h-[450px] flex items-center justify-between relative overflow-hidden shadow-[0_40px_80px_-20px_rgba(245,158,11,0.4)] group">
                  <div className="relative z-10 max-w-xl">
                    <div className="flex items-center gap-3 mb-6">
                       <div className="w-10 h-0.5 bg-slate-900 rounded-full" />
                       <span className="text-slate-900 text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em]">The Imperial Selection</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mt-2 mb-6 leading-[1] tracking-tighter uppercase italic">MAHARAJ <br/>WHOLESALE</h2>
                    <p className="text-slate-800 font-black text-xs md:text-lg mb-8 uppercase tracking-[0.05em] max-w-md opacity-90 leading-relaxed">
                      Exclusive Access to Royal Wholesales. <br/>
                      Save up to <span className="text-white bg-slate-900 px-3 py-1 rounded-xl ml-1 italic">90% Value</span>.
                    </p>
                    <button onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })} className="bg-slate-900 text-amber-500 font-black py-3 px-8 rounded-xl uppercase text-[10px] tracking-widest shadow-2xl hover:scale-105 transition-transform">Browse The Collection</button>
                  </div>
                  <div className="hidden lg:block absolute right-[-10%] top-[-5%] h-[120%] w-[50%] opacity-10 transform rotate-12 group-hover:rotate-6 transition-all duration-1000 pointer-events-none">
                    <Crown size={600} strokeWidth={1} className="text-slate-900" />
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#fcfcfd] to-transparent" />
            </div>
            <div className="max-w-7xl mx-auto px-6 -mt-16 md:-mt-24 space-y-16 mb-32">
              <section className="relative overflow-x-auto no-scrollbar py-4">
                <div className="flex items-center gap-8 min-w-max">
                  <CategoryChip icon="👟" label="Footwear" isActive={searchQuery === 'Shoes'} onClick={() => setSearchQuery('Shoes')} />
                  <CategoryChip icon="⌚" label="Chronos" isActive={searchQuery === 'Watches'} onClick={() => setSearchQuery('Watches')} />
                  <CategoryChip icon="✨" label="Parfum" isActive={searchQuery === 'Perfumes'} onClick={() => setSearchQuery('Perfumes')} />
                  <CategoryChip icon="🕶️" label="Optics" isActive={searchQuery === 'Goggles'} onClick={() => setSearchQuery('Goggles')} />
                  <CategoryChip icon="💼" label="Leather" isActive={searchQuery === 'Belts'} onClick={() => setSearchQuery('Belts')} />
                </div>
              </section>
              <section>
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic mb-10">{searchQuery ? `Vault Filtering: ${searchQuery}` : "Royal Masterpieces"}</h2>
                {filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-8">
                    {filteredProducts.map(product => (
                      <MaharajProductCard key={product.id} product={product} onAddToCart={() => handleAddToCart(product)} onBuyNow={() => handleBuyNow(product)} onViewDetails={() => { setSelectedProduct(product); setActiveImageIndex(0); }} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white p-24 rounded-[3rem] text-center border-2 border-dashed border-slate-100 shadow-sm">
                    <Search size={48} className="mx-auto text-slate-100 mb-6" />
                    <p className="text-slate-400 font-black uppercase text-xs tracking-[0.2em]">No Treasure Found</p>
                    <button onClick={() => setSearchQuery('')} className="mt-8 text-amber-600 font-black uppercase text-xs tracking-[0.3em] border-b-2 border-amber-600 pb-1 hover:text-amber-700 transition-all">Clear Filters</button>
                  </div>
                )}
              </section>
            </div>
          </div>
        ) : activeTab === 'categories' ? (
          <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 animate-in fade-in duration-700">
             <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic mb-12">Royal Realms</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Object.values(Category).map(cat => {
                  const catIcons: Record<string, string> = { [Category.SHOES]: '👟', [Category.PERFUMES]: '✨', [Category.WATCHES]: '⌚', [Category.BELTS]: '💼', [Category.GOGGLES]: '🕶️', [Category.ELECTRONICS]: '📱' };
                  return (
                    <button key={cat} onClick={() => { setSearchQuery(cat); navigateTo('marketplace'); }} className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-50 flex flex-col items-center group hover:border-amber-500 hover:-translate-y-2 transition-all">
                       <div className="w-24 h-24 rounded-[2rem] bg-slate-50 flex items-center justify-center text-5xl mb-6 shadow-inner group-hover:bg-amber-50 transition-colors">{catIcons[cat] || '💎'}</div>
                       <h3 className="text-xl font-black text-slate-900 uppercase italic mb-2">{cat}</h3>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{products.filter(p => p.category === cat).length} Masterpieces</p>
                       <div className="mt-8 p-3 bg-slate-900 text-amber-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"><ArrowRight size={20} /></div>
                    </button>
                  );
                })}
             </div>
          </div>
        ) : activeTab === 'dashboard' ? (
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20 animate-in fade-in duration-700">
            {user.role === 'ADMIN' ? (
              <>
                <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
                  <div className="flex flex-col">
                    <p className="text-[10px] font-black text-amber-600 uppercase tracking-[0.4em]">Administrative Center</p>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Maharaj Command</h2>
                  </div>

                  <div className="bg-slate-900 p-2 rounded-2xl flex items-center shadow-2xl overflow-x-auto no-scrollbar max-w-full">
                    <button onClick={() => setAdminSubTab('overview')} className={`flex-shrink-0 px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${adminSubTab === 'overview' ? 'bg-amber-500 text-slate-900 shadow-xl' : 'text-slate-400 hover:text-white'}`}><div className="flex items-center gap-2 min-w-max"><BarChart3 size={14} /> Insights</div></button>
                    <button onClick={() => setAdminSubTab('inventory')} className={`flex-shrink-0 px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${adminSubTab === 'inventory' ? 'bg-amber-500 text-slate-900 shadow-xl' : 'text-slate-400 hover:text-white'}`}><div className="flex items-center gap-2 min-w-max"><Layers size={14} /> Inventory</div></button>
                    <button onClick={() => setAdminSubTab('categories')} className={`flex-shrink-0 px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${adminSubTab === 'categories' ? 'bg-amber-500 text-slate-900 shadow-xl' : 'text-slate-400 hover:text-white'}`}><div className="flex items-center gap-2 min-w-max"><Tag size={14} /> Categories</div></button>
                  </div>
                </div>

                {adminSubTab === 'overview' && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-8">
                      <div className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-xl border border-slate-50">
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-8 italic flex items-center gap-3"><Sparkles size={20} className="text-amber-500" /> Royal Strategist Insights</h3>
                        <div className="bg-slate-50 p-6 md:p-8 rounded-[2rem] border-l-4 border-amber-500 italic text-slate-600 leading-relaxed text-base md:text-lg">{aiInsights || "Consulting the royal scrolls..."}</div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-8 rounded-[2rem] shadow-lg border border-slate-50"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Treasury</p><p className="text-3xl font-black text-slate-900">₹{orders.reduce((a, b) => a + b.totalAmount, 0).toLocaleString()}</p></div>
                        <div className="bg-white p-8 rounded-[2rem] shadow-lg border border-slate-50"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Acquisitions</p><p className="text-3xl font-black text-slate-900">{orders.length}</p></div>
                        <div className="bg-white p-8 rounded-[2rem] shadow-lg border border-slate-50"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Citizens</p><p className="text-3xl font-black text-slate-900">4,281</p></div>
                      </div>
                    </div>
                    <div className="space-y-8">
                      <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl flex flex-col items-center text-center">
                        <div className="w-24 h-24 bg-amber-500 rounded-[1.75rem] flex items-center justify-center text-slate-900 shadow-xl mb-6"><UserIcon size={48} /></div>
                        <h3 className="text-xl font-black text-white uppercase tracking-tight mb-1">{user.name}</h3>
                        <p className="text-amber-500 font-black text-[10px] uppercase tracking-[0.2em] mb-8">Grand Steward</p>
                        <button onClick={() => setUser(null)} className="w-full py-4 bg-white/10 text-white font-black rounded-2xl uppercase text-[10px] tracking-widest hover:bg-rose-500 transition-all">Relinquish Duties</button>
                      </div>
                    </div>
                  </div>
                )}

                {adminSubTab === 'inventory' && (
                  <div className="space-y-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight italic">Imperial Catalog</h3>
                      <button onClick={() => setIsAddingProduct(true)} className="bg-amber-500 text-slate-900 font-black py-4 px-10 rounded-2xl shadow-xl hover:bg-amber-600 transition-all uppercase text-[10px] tracking-widest flex items-center gap-3"><Plus size={16} /> Add Royal Asset</button>
                    </div>

                    {isAddingProduct && (
                      <div className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-2xl border border-slate-100 animate-in slide-in-from-top-4 duration-500">
                        <div className="flex items-center justify-between mb-10">
                          <h4 className="text-xl font-black text-slate-900 uppercase italic">Commission New Asset</h4>
                          <button onClick={() => setIsAddingProduct(false)} className="text-slate-400 hover:text-rose-500"><X size={24} /></button>
                        </div>
                        <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-6">
                            <div className="flex flex-col gap-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset Name</label>
                              <input type="text" required className="bg-slate-50 border border-slate-100 p-4 rounded-xl outline-none focus:ring-2 focus:ring-amber-500" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                            </div>
                            <div className="flex flex-col gap-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Noble House (Brand)</label>
                              <input type="text" required className="bg-slate-50 border border-slate-100 p-4 rounded-xl outline-none focus:ring-2 focus:ring-amber-500" value={newProduct.brand} onChange={e => setNewProduct({...newProduct, brand: e.target.value})} />
                            </div>
                            <div className="flex flex-col gap-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Heritage Value (Original Price ₹)</label>
                              <input type="number" required className="bg-slate-50 border border-slate-100 p-4 rounded-xl outline-none focus:ring-2 focus:ring-amber-500" value={newProduct.originalPrice} onChange={e => setNewProduct({...newProduct, originalPrice: parseFloat(e.target.value)})} />
                            </div>
                            <div className="flex flex-col gap-2">
                              <div className="flex justify-between items-center mb-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Imperial Discount (%)</label>
                                <span className="text-xs font-black text-amber-600">{formDiscount}%</span>
                              </div>
                              <input 
                                type="range" 
                                min="0" max="90" step="1"
                                className="w-full accent-amber-500 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                                value={formDiscount}
                                onChange={e => setFormDiscount(parseInt(e.target.value))}
                              />
                              <p className="text-[10px] font-bold text-slate-400 mt-1 italic">Royal Sale Price: ₹{newProduct.price?.toLocaleString()}</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Classification (Category)</label>
                                <select 
                                  required 
                                  className="bg-slate-50 border border-slate-100 p-4 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 appearance-none cursor-pointer"
                                  value={newProduct.category}
                                  onChange={e => setNewProduct({...newProduct, category: e.target.value as Category})}
                                >
                                  {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                             </div>
                          </div>
                          <div className="space-y-6">
                             <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset Portraits (Multiple URLs)</label>
                                {newProduct.images?.map((url, idx) => (
                                  <div key={idx} className="flex gap-2 mb-2">
                                    <input 
                                      type="text" 
                                      placeholder={`Portrait URL ${idx + 1}`}
                                      className="flex-1 bg-slate-50 border border-slate-100 p-3 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                                      value={url}
                                      onChange={e => {
                                        const newImages = [...(newProduct.images || [])];
                                        newImages[idx] = e.target.value;
                                        setNewProduct({...newProduct, images: newImages});
                                      }}
                                    />
                                    {idx > 0 && (
                                      <button type="button" onClick={() => setNewProduct({...newProduct, images: newProduct.images?.filter((_, i) => i !== idx)})} className="p-3 text-rose-500 bg-rose-50 rounded-xl"><Trash2 size={16}/></button>
                                    )}
                                  </div>
                                ))}
                                <button 
                                  type="button" 
                                  onClick={() => setNewProduct({...newProduct, images: [...(newProduct.images || []), '']})}
                                  className="text-[9px] font-black text-amber-600 uppercase tracking-widest flex items-center gap-2 mt-1 hover:text-amber-700"
                                >
                                  <Plus size={12}/> Add More Portrait URLs
                                </button>
                             </div>
                             <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vault Stock</label>
                                <input type="number" required className="bg-slate-50 border border-slate-100 p-4 rounded-xl outline-none focus:ring-2 focus:ring-amber-500" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: parseInt(e.target.value)})} />
                             </div>
                             <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Historical Context (Description)</label>
                                <textarea required rows={4} className="bg-slate-50 border border-slate-100 p-4 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 resize-none" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
                             </div>
                          </div>
                          <button type="submit" className="md:col-span-2 bg-slate-900 text-amber-500 font-black py-4 md:py-6 rounded-2xl uppercase tracking-[0.3em] shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3">
                             <CheckCircle size={20} /> Establish Royal Asset
                          </button>
                        </form>
                      </div>
                    )}

                    <div className="bg-white rounded-[2rem] shadow-xl border border-slate-50 overflow-hidden">
                      <div className="overflow-x-auto no-scrollbar">
                        <table className="w-full text-left min-w-[700px]">
                          <thead className="bg-slate-900 text-amber-500 text-[10px] font-black uppercase tracking-widest">
                            <tr>
                              <th className="p-6">Asset Portrait</th>
                              <th className="p-6">Name & Brand</th>
                              <th className="p-6">Classification</th>
                              <th className="p-6">Royal Price</th>
                              <th className="p-6 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                            {products.map(p => (
                              <tr key={p.id} className="hover:bg-slate-50 transition-colors group">
                                <td className="p-6">
                                  <div className="w-16 h-16 rounded-xl overflow-hidden shadow-md">
                                    <img src={p.images[0]} className="w-full h-full object-cover" />
                                  </div>
                                </td>
                                <td className="p-6">
                                  <p className="font-bold text-slate-900 text-sm">{p.name}</p>
                                  <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">{p.brand}</p>
                                </td>
                                <td className="p-6 text-slate-400 uppercase text-[10px] font-black tracking-widest">{p.category}</td>
                                <td className="p-6 font-black text-slate-900">₹{p.price.toLocaleString()}</td>
                                <td className="p-6 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-amber-100 hover:text-amber-600 transition-all"><Edit3 size={16}/></button>
                                    <button onClick={() => setProducts(products.filter(item => item.id !== p.id))} className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-rose-50 hover:text-rose-500 transition-all"><Trash2 size={16} /></button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="md:hidden p-4 bg-slate-50 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest border-t border-slate-100">Swipe table horizontally for more details</div>
                    </div>
                  </div>
                )}
                {adminSubTab === 'categories' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                     {Object.values(Category).map(cat => (
                        <div key={cat} className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-50 flex flex-col group hover:shadow-2xl transition-all">
                           <div className="flex items-center justify-between mb-8">
                              <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-amber-500 shadow-xl"><Tag size={24} /></div>
                              <div className="text-right">
                                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Population</p>
                                 <p className="text-xl font-black text-slate-900">{products.filter(p => p.category === cat).length} Assets</p>
                              </div>
                           </div>
                           <h4 className="text-2xl font-black text-slate-900 uppercase italic mb-6">{cat}</h4>
                           <button className="w-full py-4 bg-slate-50 text-slate-600 font-black rounded-xl uppercase text-[10px] tracking-widest hover:bg-slate-100 transition-all">Manage Archives</button>
                        </div>
                     ))}
                  </div>
                )}
              </>
            ) : (
              <div className="max-w-4xl mx-auto space-y-12">
                <div className="flex flex-col">
                  <p className="text-[10px] font-black text-amber-600 uppercase tracking-[0.4em]">Personal Sanctuary</p>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Patron Dossier</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-1 bg-white p-10 rounded-[3rem] shadow-xl border border-slate-50 flex flex-col items-center text-center">
                    <div className="w-24 h-24 bg-amber-500 rounded-3xl flex items-center justify-center text-slate-900 shadow-xl mb-6"><UserIcon size={40} /></div>
                    <h3 className="text-xl font-black text-slate-900 italic mb-1">{user.name}</h3>
                    <p className="text-amber-600 font-black text-[9px] uppercase tracking-widest mb-8">Loyal Maharaj Citizen</p>
                    <div className="w-full space-y-3">
                      <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100"><Mail size={16} className="text-amber-500" /><span className="text-[10px] font-bold text-slate-600 truncate">{user.email}</span></div>
                      <button onClick={() => navigateTo('orders')} className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl uppercase text-[10px] tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2"><History size={14} /> My Orders</button>
                      <button onClick={() => setUser(null)} className="w-full py-4 bg-rose-500 text-white font-black rounded-2xl uppercase text-[10px] tracking-widest hover:bg-rose-600 transition-all">Sign Out</button>
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-8">
                    <div className="bg-slate-900 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden text-white">
                       <h3 className="text-lg font-black uppercase italic mb-6">Imperial Rewards</h3>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="p-6 bg-white/5 rounded-2xl border border-white/10"><p className="text-amber-500 font-black text-[9px] uppercase tracking-widest mb-1">Vault Points</p><p className="text-3xl font-black tracking-tighter">1,240</p></div>
                          <div className="p-6 bg-white/5 rounded-2xl border border-white/10"><p className="text-amber-500 font-black text-[9px] uppercase tracking-widest mb-1">Tier</p><p className="text-3xl font-black tracking-tighter">SOVEREIGN</p></div>
                       </div>
                    </div>
                    <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-50">
                       <h3 className="text-lg font-black text-slate-900 uppercase italic mb-6">Recent Deliveries</h3>
                       <div className="space-y-4">
                          {orders.slice(0, 3).map(order => (
                             <div key={order.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="flex items-center gap-4">
                                   <div className="p-2 bg-amber-500/10 rounded-lg text-amber-600"><Package size={18} /></div>
                                   <div><p className="text-xs font-black text-slate-800">Order #{order.id}</p><p className="text-[9px] font-black text-emerald-500 uppercase">{order.status}</p></div>
                                </div>
                                <span className="font-black text-slate-900">₹{order.totalAmount.toLocaleString()}</span>
                             </div>
                          ))}
                          {orders.length === 0 && <p className="text-center text-slate-300 font-black text-[10px] uppercase py-8 tracking-widest">No previous acquisitions</p>}
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : activeTab === 'orders' ? (
          <div className="max-w-4xl mx-auto px-6 py-12 md:py-20 animate-in fade-in duration-700">
            <h2 className="text-3xl font-black text-slate-900 mb-12 tracking-tighter uppercase italic">Acquisition History</h2>
            {orders.length === 0 ? (
              <div className="bg-white p-24 rounded-[3rem] border border-dashed border-slate-200 flex flex-col items-center shadow-sm">
                <Package size={48} className="text-slate-100 mb-6" />
                <p className="text-slate-400 font-black uppercase text-xs tracking-widest">No previous acquisitions</p>
                <button onClick={() => navigateTo('marketplace')} className="mt-8 text-amber-600 font-black uppercase text-[10px] tracking-[0.2em] border-b-2 border-amber-600 pb-1">Begin Browsing</button>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map(order => (
                  <div key={order.id} className="bg-white border border-slate-100 rounded-[2rem] shadow-xl p-8 group hover:border-amber-500 transition-all">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex items-center gap-5">
                        <div className="p-4 bg-slate-900 rounded-2xl text-amber-500"><Package size={24} /></div>
                        <div><p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{order.status}</p><h3 className="font-black text-slate-900 uppercase text-sm italic">Order #{order.id}</h3><p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{new Date(order.createdAt).toLocaleDateString()}</p></div>
                      </div>
                      <div className="text-right"><p className="font-black text-slate-900 text-xl tracking-tight">₹{order.totalAmount.toLocaleString()}</p></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : activeTab === 'cart' ? (
          <div className="max-w-4xl mx-auto px-6 py-12 md:py-20 animate-in fade-in zoom-in-95 duration-700">
            <div className="flex items-center justify-between mb-16 px-4 md:px-0">
              <div className="flex flex-col items-center gap-3"><div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${checkoutStep === 'cart' ? 'bg-amber-500 text-slate-900' : 'bg-slate-900 text-amber-500 opacity-50'}`}><ShoppingCart size={20} /></div><span className="text-[10px] font-black uppercase tracking-widest">Vault Bag</span></div>
              <div className="h-px flex-1 bg-slate-200 mx-4" />
              <div className="flex flex-col items-center gap-3"><div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${checkoutStep === 'address' ? 'bg-amber-500 text-slate-900' : checkoutStep === 'payment' ? 'bg-slate-900 text-amber-500' : 'bg-slate-100 text-slate-300'}`}><MapPin size={20} /></div><span className="text-[10px] font-black uppercase tracking-widest">Address</span></div>
              <div className="h-px flex-1 bg-slate-200 mx-4" />
              <div className="flex flex-col items-center gap-3"><div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${checkoutStep === 'payment' ? 'bg-amber-500 text-slate-900' : 'bg-slate-100 text-slate-300'}`}><CreditCard size={20} /></div><span className="text-[10px] font-black uppercase tracking-widest">Payment</span></div>
            </div>
            {cart.length === 0 ? (
              <div className="bg-white p-24 rounded-[3rem] border border-dashed border-slate-200 flex flex-col items-center shadow-sm"><ShoppingBag size={48} className="text-slate-100 mb-8" /><p className="text-slate-400 font-black text-xs uppercase tracking-widest">Bag is Empty</p><button onClick={() => navigateTo('marketplace')} className="mt-10 bg-slate-900 text-amber-500 font-black py-4 px-12 rounded-2xl shadow-xl hover:bg-slate-800 transition-all uppercase text-xs tracking-[0.2em]">Return to Vault</button></div>
            ) : (
              <div className="flex flex-col lg:flex-row gap-12">
                <div className="flex-1">
                  {checkoutStep === 'cart' && (
                    <div className="bg-white rounded-[2rem] shadow-xl border border-slate-50 overflow-hidden p-8 space-y-8 animate-in slide-in-from-left duration-500">
                      {cart.map(item => (
                        <div key={item.product.id} className="flex gap-6 group">
                          <img src={item.product.images[0]} className="w-24 md:w-32 h-32 md:h-44 bg-slate-50 rounded-2xl object-cover shadow-inner" />
                          <div className="flex-1 flex flex-col py-2">
                            <div className="flex justify-between items-start mb-4">
                              <div><p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">{item.product.brand}</p><h3 className="font-black text-slate-900 text-lg md:text-xl italic">{item.product.name}</h3></div>
                              <button onClick={() => removeFromCart(item.product.id)} className="text-slate-300 hover:text-rose-500 transition-colors"><Trash2 size={20} /></button>
                            </div>
                            <div className="flex items-center gap-4 mb-6"><span className="text-xl font-black text-slate-900">₹{(item.product.price * item.quantity).toLocaleString()}</span></div>
                            <div className="mt-auto flex items-center justify-between">
                              <div className="flex items-center bg-slate-50 rounded-xl border border-slate-100">
                                <button className="px-4 py-2 font-black border-r border-slate-100 text-slate-900" onClick={() => { if(item.quantity > 1) setCart(prev => prev.map(c => c.product.id === item.product.id ? {...c, quantity: c.quantity - 1} : c)); }}>-</button>
                                <span className="px-5 py-2 font-black text-sm text-slate-900">{item.quantity}</span>
                                <button className="px-4 py-2 font-black border-l border-slate-100 text-slate-900" onClick={() => setCart(prev => prev.map(c => c.product.id === item.product.id ? {...c, quantity: c.quantity + 1} : c))}>+</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {checkoutStep === 'address' && (
                    <div className="bg-white rounded-[2rem] shadow-xl border border-slate-50 p-8 space-y-8 animate-in slide-in-from-right duration-500">
                      <h3 className="text-xl font-black text-slate-900 uppercase italic mb-8 flex items-center gap-3"><MapPin className="text-amber-500" /> Shipping Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <input type="text" className="bg-slate-50 border border-slate-100 p-4 rounded-xl outline-none" placeholder="Full Name" value={shippingAddress.fullName} onChange={e => setShippingAddress({...shippingAddress, fullName: e.target.value})} />
                        <input type="tel" className="bg-slate-50 border border-slate-100 p-4 rounded-xl outline-none" placeholder="Phone Number" value={shippingAddress.phone} onChange={e => setShippingAddress({...shippingAddress, phone: e.target.value})} />
                        <textarea className="md:col-span-2 bg-slate-50 border border-slate-100 p-4 rounded-xl outline-none resize-none" rows={3} placeholder="Address Line" value={shippingAddress.addressLine} onChange={e => setShippingAddress({...shippingAddress, addressLine: e.target.value})} />
                        <input type="text" className="bg-slate-50 border border-slate-100 p-4 rounded-xl outline-none" placeholder="City" value={shippingAddress.city} onChange={e => setShippingAddress({...shippingAddress, city: e.target.value})} />
                        <input type="text" className="bg-slate-50 border border-slate-100 p-4 rounded-xl outline-none" placeholder="Pincode" value={shippingAddress.pincode} onChange={e => setShippingAddress({...shippingAddress, pincode: e.target.value})} />
                      </div>
                    </div>
                  )}
                  {checkoutStep === 'payment' && (
                    <div className="bg-white rounded-[2rem] shadow-xl border border-slate-50 p-8 space-y-8 animate-in zoom-in duration-500">
                      <h3 className="text-xl font-black text-slate-900 uppercase italic mb-8 flex items-center gap-3"><CreditCard className="text-amber-500" /> Settlement</h3>
                      <div className="space-y-4">
                        <button onClick={() => setPaymentMethod('cod')} className={`w-full flex items-center justify-between p-6 rounded-2xl border-2 transition-all ${paymentMethod === 'cod' ? 'border-amber-500 bg-amber-50/20' : 'border-slate-100 bg-slate-50'}`}><div className="flex items-center gap-4"><Truck /> <span className="font-black uppercase text-sm italic">Cash on Delivery</span></div>{paymentMethod === 'cod' && <CheckCircle className="text-amber-500" />}</button>
                        <button onClick={() => setPaymentMethod('upi')} className={`w-full flex items-center justify-between p-6 rounded-2xl border-2 transition-all ${paymentMethod === 'upi' ? 'border-amber-500 bg-amber-50/20' : 'border-slate-100 bg-slate-50'}`}><div className="flex items-center gap-4"><Smartphone /> <span className="font-black uppercase text-sm italic">UPI Payment</span></div>{paymentMethod === 'upi' && <CheckCircle className="text-amber-500" />}</button>
                      </div>
                    </div>
                  )}
                </div>
                <div className="lg:w-96">
                  <div className="bg-slate-900 rounded-[2rem] shadow-2xl p-10 sticky top-48 text-white">
                    <h3 className="text-[11px] font-black text-amber-500 uppercase tracking-[0.3em] mb-8">Summary</h3>
                    <div className="space-y-5 mb-10"><div className="flex justify-between"><span>Value</span><span className="font-black">₹{cartTotal.toLocaleString()}</span></div><div className="flex justify-between"><span>Delivery</span><span className="text-emerald-500 font-black uppercase text-xs">FREE</span></div><div className="h-px bg-slate-800 my-2" /><div className="flex justify-between"><span className="text-amber-500 font-black text-sm uppercase">Total</span><span className="text-amber-500 text-xl font-black">₹{cartTotal.toLocaleString()}</span></div></div>
                    {checkoutStep === 'cart' && <button onClick={() => setCheckoutStep('address')} className="w-full bg-amber-500 text-slate-900 font-black py-4 rounded-xl shadow-xl uppercase text-xs tracking-widest flex items-center justify-center gap-2">Enter Address <ChevronRight size={16} /></button>}
                    {checkoutStep === 'address' && <button onClick={() => setCheckoutStep('payment')} disabled={!shippingAddress.fullName || !shippingAddress.pincode} className={`w-full bg-amber-500 text-slate-900 font-black py-4 rounded-xl shadow-xl uppercase text-xs tracking-widest flex items-center justify-center gap-2 ${(!shippingAddress.fullName || !shippingAddress.pincode) && 'opacity-50'}`}>Payment <ChevronRight size={16} /></button>}
                    {checkoutStep === 'payment' && <button onClick={handlePlaceOrder} className="w-full bg-amber-500 text-slate-900 font-black py-4 rounded-xl shadow-xl uppercase text-xs tracking-widest flex items-center justify-center gap-2 animate-pulse"><Zap size={18} /> Authorize Order</button>}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-2xl border-t border-slate-100 flex items-center h-20 z-40 pb-safe shadow-[0_-30px_60px_rgba(0,0,0,0.1)] rounded-t-[2.5rem]">
        <div className="flex-1 flex justify-center"><button onClick={() => navigateTo('marketplace')} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'marketplace' ? 'text-amber-600 font-black' : 'text-slate-400 opacity-60'}`}><ShoppingBag size={22} /><span className="text-[9px] font-black uppercase tracking-[0.1em]">Vault</span></button></div>
        <div className="flex-1 flex justify-center">{user.role === 'ADMIN' ? (<button onClick={() => navigateTo('orders')} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'orders' ? 'text-amber-600 font-black' : 'text-slate-400 opacity-60'}`}><History size={22} /><span className="text-[9px] font-black uppercase tracking-[0.1em]">History</span></button>) : (<button onClick={() => navigateTo('categories')} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'categories' ? 'text-amber-600 font-black' : 'text-slate-400 opacity-60'}`}><Grid size={22} /><span className="text-[9px] font-black uppercase tracking-[0.1em]">Categories</span></button>)}</div>
        <div className="flex-1 flex justify-center -mt-10"><button onClick={() => navigateTo('cart')} className="w-16 h-16 bg-slate-900 rounded-[1.25rem] flex items-center justify-center text-amber-500 shadow-2xl border-4 border-white relative"><ShoppingCart size={24} />{cart.length > 0 && <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-900 text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-lg border-2 border-slate-900 shadow-2xl">{cart.length}</span>}</button></div>
        <div className="flex-1 flex justify-center"><button onClick={() => navigateTo('dashboard')} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'dashboard' ? 'text-amber-600 font-black' : 'text-slate-400 opacity-60'}`}>{user.role === 'ADMIN' ? <LayoutDashboard size={22} /> : <UserIcon size={22} />}<span className="text-[9px] font-black uppercase tracking-[0.1em]">{user.role === 'ADMIN' ? 'Command' : 'Sanctuary'}</span></button></div>
        <div className="flex-1 flex justify-center"><button onClick={() => setIsMobileMenuOpen(true)} className="flex flex-col items-center gap-1.5 text-slate-400 opacity-60"><Menu size={22} /><span className="text-[9px] font-black uppercase tracking-[0.1em]">Menu</span></button></div>
      </nav>
    </div>
  );
};

export default App;
