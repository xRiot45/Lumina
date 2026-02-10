'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    Bell,
    Box,
    Check,
    Command,
    ExternalLink,
    Facebook,
    Filter,
    Heart,
    Instagram,
    Layers,
    LayoutGrid,
    Moon,
    MousePointer2,
    Search,
    ShieldCheck,
    ShoppingBag,
    Sparkles,
    Star,
    Sun,
    Truck,
    Twitter,
    Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';

// --- MOCK DATA ENHANCED (24 PRODUCTS) ---
const CATEGORIES = [
    { name: 'Outerwear', icon: <Layers size={14} /> },
    { name: 'Footwear', icon: <Box size={14} /> },
    { name: 'Hardware', icon: <Command size={14} /> },
    { name: 'Accessories', icon: <Sparkles size={14} /> },
    { name: 'Archive', icon: <Layers size={14} /> },
];

const PRODUCTS = Array.from({ length: 24 }).map((_, i) => ({
    id: i + 1,
    name: [
        'Lumina Industrial Cargo v2',
        'Aero-Tech Sneakers White',
        'Holo-Shell Windbreaker',
        'Vertex Smart Glasses',
        'Quantum Mechanical Keyboard',
        'Pulse-Line Joggers',
        'Arc-Reactor Powerbank',
        'Synth-Wave Cap',
    ][i % 8],
    price: `Rp ${(Math.floor(Math.random() * 20) + 5) * 50}000`,
    category: ['Apparel', 'Footwear', 'Hardware', 'Accessories'][i % 4],
    rating: (4.5 + Math.random() * 0.5).toFixed(1),
    reviews: Math.floor(Math.random() * 500),
    description:
        'High-performance modular gear built with reinforced synthetic fibers and weather-resistant coating. Optimized for urban mobility and high-density environments.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    features: ['Water-repellent', 'Modular Design', 'Reinforced Stitching'],
    isNew: i < 6,
    discount: i % 5 === 0 ? '20%' : null,
    stock: Math.floor(Math.random() * 50),
}));

const REVIEWS = [
    { user: 'Alex_V', comment: 'Quality is insane. Best techwear in the market.', rating: 5 },
    { user: 'Sarah_K', comment: 'The smart glasses are a game changer for my workflow.', rating: 5 },
    { user: 'Zero_Dev', comment: 'Sharp design, fits perfectly with my industrial setup.', rating: 4 },
];

export default function UltimateIndustrialEcom() {
    const [isDark, setIsDark] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);
    if (!mounted) return null;

    return (
        <div
            className={`min-h-screen transition-colors duration-300 ${isDark ? 'dark bg-[#0a0a0a] text-slate-50' : 'bg-white text-slate-900'}`}
        >
            {/* --- TOP ANNOUNCEMENT --- */}
            <div className="bg-sky-600 text-white py-2 px-4 overflow-hidden whitespace-nowrap">
                <motion.div
                    animate={{ x: [0, -1000] }}
                    transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
                    className="text-[9px] font-bold uppercase tracking-[0.4em] flex gap-20"
                >
                    <span>NEW DROP: LUMINA X VORTEX COLLABORATION LIVE NOW</span>
                    <span>FREE WORLDWIDE SHIPPING FOR CRYPTO PAYMENTS</span>
                    <span>SYSTEM UPGRADE 2.0: NEW INVENTORY ADDED</span>
                </motion.div>
            </div>

            {/* --- NAVBAR --- */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur border-slate-200 dark:border-white/10">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-10">
                        <div className="flex items-center gap-2 cursor-pointer">
                            <div className="bg-sky-500 p-1.5 rounded-md">
                                <ShoppingBag className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-bold text-lg tracking-tighter uppercase">
                                Lumina<span className="text-sky-500 font-light">Lab</span>
                            </span>
                        </div>
                        <nav className="hidden md:flex items-center gap-8 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                            <a href="#" className="text-sky-500">
                                Dashboard
                            </a>
                            <a href="#" className="hover:text-primary transition-colors">
                                Catalog
                            </a>
                            <a href="#" className="hover:text-primary transition-colors">
                                Collection
                            </a>
                            <a href="#" className="hover:text-primary transition-colors">
                                System
                            </a>
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center border border-slate-200 dark:border-white/10 rounded-md px-3 py-1 bg-slate-50 dark:bg-white/5">
                            <Search className="w-3 h-3 text-slate-400" />
                            <input
                                type="text"
                                placeholder="CMD_SEARCH..."
                                className="bg-transparent border-none outline-none text-[10px] font-mono ml-2 w-48 uppercase"
                            />
                        </div>
                        <div className="flex items-center border-x border-slate-200 dark:border-white/10 px-4 gap-4">
                            <Bell className="w-4 h-4 cursor-pointer text-slate-400 hover:text-sky-500" />
                            <Heart className="w-4 h-4 cursor-pointer text-slate-400 hover:text-sky-500" />
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => setIsDark(!isDark)} className="rounded-md">
                            {isDark ? <Sun className="w-4 h-4 text-sky-400" /> : <Moon className="w-4 h-4" />}
                        </Button>
                        <Button className="h-9 rounded-md bg-sky-600 hover:bg-sky-700 font-bold text-[10px] uppercase tracking-widest px-6 shadow-lg shadow-sky-500/20">
                            Login_Access
                        </Button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto max-w-7xl px-4 py-8">
                {/* --- HERO BENTO GRID --- */}
                <section className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-16">
                    <div className="md:col-span-8 relative aspect-[16/9] md:aspect-auto md:h-[550px] bg-slate-900 rounded-md overflow-hidden border border-white/5 group">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070')] bg-cover bg-center grayscale opacity-40 group-hover:scale-105 transition-transform duration-700"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                        <div className="absolute bottom-12 left-12 z-10">
                            <Badge className="rounded-md bg-sky-500 mb-4 border-none text-[9px]">
                                ENCRYPTED_SHIPMENT_02
                            </Badge>
                            <h1 className="text-6xl font-black tracking-tighter mb-4 leading-none italic uppercase">
                                Cyber <br /> Urban_Core
                            </h1>
                            <p className="text-slate-400 max-w-sm text-sm mb-8 leading-relaxed">
                                Advanced apparel systems designed for the high-density urban environments. SS/26
                                Available now.
                            </p>
                            <div className="flex gap-4">
                                <Button className="rounded-md bg-white text-black hover:bg-slate-200 font-bold text-[10px] uppercase tracking-widest h-12 px-10">
                                    Shop_Archive
                                </Button>
                                <Button
                                    variant="outline"
                                    className="rounded-md border-white/20 text-white h-12 px-10 text-[10px] uppercase tracking-widest hover:bg-white/5"
                                >
                                    Lookbook
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="md:col-span-4 grid grid-rows-2 gap-4">
                        <div className="bg-sky-600 rounded-md p-8 flex flex-col justify-between relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-20 rotate-12">
                                <Zap size={120} />
                            </div>
                            <Badge className="w-fit rounded-sm bg-white/20 text-white border-none text-[8px]">
                                ACTIVE_PROMO
                            </Badge>
                            <div>
                                <h3 className="text-white font-black text-2xl mb-1 tracking-tighter italic">
                                    FLASH_DROP
                                </h3>
                                <p className="text-sky-100 text-xs mb-6 opacity-80 uppercase tracking-widest">
                                    Selected Hardware 40% Off
                                </p>
                                <div className="flex gap-2 mb-6">
                                    <div className="bg-white/10 px-3 py-2 rounded-md font-mono text-white text-lg">
                                        02
                                    </div>
                                    <div className="bg-white/10 px-3 py-2 rounded-md font-mono text-white text-lg">
                                        45
                                    </div>
                                    <div className="bg-white/10 px-3 py-2 rounded-md font-mono text-white text-lg">
                                        12
                                    </div>
                                </div>
                                <Button className="w-full rounded-md bg-black text-white hover:bg-black/80 font-bold text-[10px] uppercase tracking-widest h-10">
                                    Enter_Terminal
                                </Button>
                            </div>
                        </div>
                        <div className="bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-md p-8 flex flex-col justify-center">
                            <h3 className="font-bold text-xl mb-2 tracking-tighter">COLLECTIVE_SUBS</h3>
                            <p className="text-slate-500 text-xs mb-6 uppercase leading-tight">
                                Join the internal network for early drop notifications and NFT drops.
                            </p>
                            <div className="flex gap-2">
                                <input
                                    className="flex-1 bg-transparent border-b border-slate-300 dark:border-white/20 text-xs outline-none focus:border-sky-500 py-2 font-mono"
                                    placeholder="USER@DOMAIN.COM"
                                />
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="rounded-md h-10 w-10 border border-slate-200 dark:border-white/10"
                                >
                                    <ArrowRight size={16} />
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- STATS BAR --- */}
                <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 py-8 border-y border-slate-200 dark:border-white/5">
                    <div className="text-center">
                        <div className="text-2xl font-black text-sky-500">12.5K+</div>
                        <div className="text-[9px] font-bold uppercase tracking-widest opacity-50">Units_Deployed</div>
                    </div>
                    <div className="text-center border-l border-slate-200 dark:border-white/5">
                        <div className="text-2xl font-black text-sky-500">4.9/5</div>
                        <div className="text-[9px] font-bold uppercase tracking-widest opacity-50">User_Rating</div>
                    </div>
                    <div className="text-center border-l border-slate-200 dark:border-white/5">
                        <div className="text-2xl font-black text-sky-500">24/7</div>
                        <div className="text-[9px] font-bold uppercase tracking-widest opacity-50">Support_Active</div>
                    </div>
                    <div className="text-center border-l border-slate-200 dark:border-white/5">
                        <div className="text-2xl font-black text-sky-500">100%</div>
                        <div className="text-[9px] font-bold uppercase tracking-widest opacity-50">Encrypted_Sec</div>
                    </div>
                </section>

                {/* --- CATEGORY QUICK SELECT --- */}
                <section className="mb-12">
                    <div className="flex items-center gap-4 overflow-x-auto pb-4 hide-scrollbar">
                        {CATEGORIES.map((cat) => (
                            <button key={cat.name} className="flex-none group">
                                <div className="px-8 py-4 border border-slate-200 dark:border-white/10 rounded-md flex items-center gap-4 hover:border-sky-500 hover:bg-sky-500/5 transition-all">
                                    <span className="text-sky-500">{cat.icon}</span>
                                    <span className="text-[10px] font-bold uppercase tracking-widest">{cat.name}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </section>

                {/* --- MAIN CATALOG (24 PRODUCTS) --- */}
                <section className="mb-24">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 border-l-4 border-sky-500 pl-6">
                        <div>
                            <h2 className="text-3xl font-black tracking-tighter uppercase italic">Main_Archive_2026</h2>
                            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                                Showing all results // Database_Version: 2.0.1
                            </p>
                        </div>
                        <div className="flex gap-3 mt-4 md:mt-0">
                            <Button
                                variant="outline"
                                className="rounded-md h-10 text-[10px] font-bold uppercase tracking-widest border-slate-200 dark:border-white/10"
                            >
                                <Filter className="w-3 h-3 mr-2" /> Filter_Params
                            </Button>
                            <Button
                                variant="outline"
                                className="rounded-md h-10 text-[10px] font-bold uppercase tracking-widest border-slate-200 dark:border-white/10"
                            >
                                <LayoutGrid className="w-3 h-3 mr-2" /> Sort_By
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        {PRODUCTS.map((product) => (
                            <Dialog key={product.id}>
                                <DialogTrigger asChild>
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        className="group cursor-pointer border border-slate-200 dark:border-white/10 rounded-md p-3 hover:border-sky-500/50 transition-all bg-white dark:bg-white/[0.02]"
                                    >
                                        <div className="aspect-[3/4] rounded-sm bg-slate-100 dark:bg-white/5 relative overflow-hidden mb-4">
                                            {product.isNew && (
                                                <Badge className="absolute top-2 left-2 rounded-sm text-[8px] bg-sky-600 border-none px-2 py-0.5">
                                                    NEW
                                                </Badge>
                                            )}
                                            {product.discount && (
                                                <Badge className="absolute top-2 right-2 rounded-sm text-[8px] bg-red-600 border-none px-2 py-0.5">
                                                    -{product.discount}
                                                </Badge>
                                            )}
                                            <div className="absolute inset-0 bg-sky-500/0 group-hover:bg-sky-500/5 transition-colors flex items-center justify-center">
                                                <MousePointer2
                                                    className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg"
                                                    size={24}
                                                />
                                            </div>
                                        </div>
                                        <div className="px-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                                    {product.category}
                                                </p>
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-2.5 h-2.5 fill-sky-500 text-sky-500" />
                                                    <span className="text-[9px] font-bold">{product.rating}</span>
                                                </div>
                                            </div>
                                            <h3 className="font-bold text-xs line-clamp-2 mb-3 uppercase tracking-tight group-hover:text-sky-500 transition-colors h-8">
                                                {product.name}
                                            </h3>
                                            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-white/5">
                                                <span className="font-mono text-xs font-bold">{product.price}</span>
                                                <span className="text-[9px] text-slate-500 font-mono">
                                                    STOCK:{product.stock}
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                </DialogTrigger>

                                <DialogContent className="sm:max-w-5xl p-0 overflow-hidden border-none rounded-md dark:bg-[#0d0d0d] outline-none">
                                    <div className="grid grid-cols-1 md:grid-cols-2">
                                        <div className="bg-slate-100 dark:bg-white/10 flex items-center justify-center p-10 relative">
                                            <div className="w-full aspect-square border border-slate-200 dark:border-white/20 flex items-center justify-center relative overflow-hidden group">
                                                <Zap className="w-24 h-24 text-sky-500/10 group-hover:scale-110 transition-transform" />
                                                <div className="absolute top-4 left-4 text-[8px] font-mono opacity-30 tracking-[0.2em]">
                                                    UID_{product.id} // SEC_VERIFIED
                                                </div>
                                                <div className="absolute bottom-4 right-4 text-[8px] font-mono opacity-30">
                                                    © LUMINA_SYSTEMS
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-10 flex flex-col justify-between">
                                            <div>
                                                <DialogHeader className="mb-8">
                                                    <div className="flex gap-2 mb-4">
                                                        <Badge
                                                            variant="outline"
                                                            className="rounded-sm border-sky-500 text-sky-500 text-[9px] px-3"
                                                        >
                                                            AUTHORISED_DEALER
                                                        </Badge>
                                                        <Badge
                                                            variant="outline"
                                                            className="rounded-sm border-slate-500 text-slate-500 text-[9px] px-3"
                                                        >
                                                            {product.category}
                                                        </Badge>
                                                    </div>
                                                    <DialogTitle className="text-4xl font-black uppercase tracking-tighter italic leading-none mb-2">
                                                        {product.name}
                                                    </DialogTitle>
                                                    <div className="text-3xl font-mono text-sky-500 font-bold">
                                                        {product.price}
                                                    </div>
                                                </DialogHeader>

                                                <ScrollArea className="h-[280px] pr-6">
                                                    <p className="text-[11px] text-slate-500 leading-relaxed uppercase tracking-wide mb-8">
                                                        {product.description}
                                                    </p>

                                                    <div className="mb-8">
                                                        <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-4 text-slate-400">
                                                            Select_Configuration
                                                        </h4>
                                                        <div className="flex flex-wrap gap-2">
                                                            {product.sizes.map((s) => (
                                                                <button
                                                                    key={s}
                                                                    className="w-12 h-12 border border-slate-200 dark:border-white/10 rounded-md text-[10px] font-bold hover:border-sky-500 hover:text-sky-500 transition-all uppercase"
                                                                >
                                                                    {s}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="space-y-3 mb-8">
                                                        {product.features.map((f, i) => (
                                                            <div
                                                                key={i}
                                                                className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-slate-300"
                                                            >
                                                                <Check className="w-3 h-3 text-sky-500" /> {f}
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-3 pb-4">
                                                        <div className="p-4 border border-slate-200 dark:border-white/10 rounded-md">
                                                            <Truck className="w-5 h-5 mb-2 text-sky-500" />
                                                            <p className="text-[9px] font-bold uppercase">
                                                                Priority_Logistics
                                                            </p>
                                                            <p className="text-[8px] text-slate-500 mt-1 uppercase font-mono">
                                                                ETA: 2-3_DAYS
                                                            </p>
                                                        </div>
                                                        <div className="p-4 border border-slate-200 dark:border-white/10 rounded-md">
                                                            <ShieldCheck className="w-5 h-5 mb-2 text-sky-500" />
                                                            <p className="text-[9px] font-bold uppercase">
                                                                Encrypted_Origin
                                                            </p>
                                                            <p className="text-[8px] text-slate-500 mt-1 uppercase font-mono">
                                                                VERIFIED_NFT
                                                            </p>
                                                        </div>
                                                    </div>
                                                </ScrollArea>
                                            </div>

                                            <div className="mt-10 flex gap-3 pt-6 border-t dark:border-white/5">
                                                <Button className="flex-1 rounded-md bg-sky-600 hover:bg-sky-700 font-black uppercase tracking-[0.2em] text-[11px] h-14 shadow-lg shadow-sky-500/20">
                                                    Deploy_to_Cart
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    className="h-14 w-14 rounded-md border-slate-200 dark:border-white/10 hover:border-red-500 hover:text-red-500 transition-all"
                                                >
                                                    <Heart className="w-5 h-5" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        ))}
                    </div>

                    <div className="mt-20 flex flex-col items-center">
                        <p className="text-[10px] font-mono text-slate-500 mb-6 tracking-widest uppercase">
                            End of primary archive // 24 items loaded
                        </p>
                        <Button
                            variant="outline"
                            className="rounded-md px-12 h-12 text-[10px] font-bold uppercase tracking-[0.3em] border-slate-200 dark:border-white/10 hover:border-sky-500"
                        >
                            Access_More_Data
                        </Button>
                    </div>
                </section>

                {/* --- REVIEW HUB --- */}
                <section className="py-20 border-t border-slate-200 dark:border-white/10">
                    <div className="text-center mb-16">
                        <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-2">
                            User_Feedback_Terminal
                        </h2>
                        <p className="text-[10px] font-mono text-sky-500 uppercase tracking-widest">
                            Real-time transmissions from the field
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {REVIEWS.map((rev, i) => (
                            <div
                                key={i}
                                className="p-8 border border-slate-200 dark:border-white/10 rounded-md bg-slate-50 dark:bg-white/[0.01]"
                            >
                                <div className="flex gap-1 mb-4 text-sky-500">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <Star key={s} size={12} fill={s <= rev.rating ? 'currentColor' : 'none'} />
                                    ))}
                                </div>
                                <p className="text-xs uppercase font-medium leading-relaxed mb-6 italic">
                                    "{rev.comment}"
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-[10px] font-bold">
                                        U
                                    </div>
                                    <span className="text-[10px] font-mono font-bold">{rev.user}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* --- BRAND PARTNERS --- */}
                <section className="py-20 border-t border-slate-200 dark:border-white/10 overflow-hidden">
                    <div className="flex flex-wrap justify-center gap-10 md:gap-20 opacity-20 grayscale transition-all hover:opacity-100">
                        <div className="font-black text-2xl italic tracking-tighter uppercase flex items-center gap-2">
                            Phantom_Supply <ExternalLink size={14} />
                        </div>
                        <div className="font-black text-2xl italic tracking-tighter uppercase flex items-center gap-2">
                            Vortex_Tech <ExternalLink size={14} />
                        </div>
                        <div className="font-black text-2xl italic tracking-tighter uppercase flex items-center gap-2">
                            Neuro_Net <ExternalLink size={14} />
                        </div>
                        <div className="font-black text-2xl italic tracking-tighter uppercase flex items-center gap-2">
                            Oxygen_Gear <ExternalLink size={14} />
                        </div>
                    </div>
                </section>
            </main>

            {/* --- INDUSTRIAL FOOTER --- */}
            <footer className="bg-slate-50 dark:bg-[#050505] border-t border-slate-200 dark:border-white/10 pt-20 pb-10">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-5 gap-12 mb-20">
                    <div className="col-span-2">
                        <div className="flex items-center gap-2 mb-8">
                            <div className="bg-sky-500 p-1.5 rounded-md">
                                <ShoppingBag className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-black text-xl tracking-tighter uppercase italic">
                                Lumina<span className="text-sky-500 font-light">Lab</span>
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 leading-loose uppercase tracking-wide max-w-sm">
                            Propelling urban exploration through modular apparel and hardware integration. Designed for
                            high-density environments and extreme metropolitan conditions.
                        </p>
                        <div className="flex gap-4 mt-8">
                            <Button
                                variant="outline"
                                size="icon"
                                className="rounded-md border-slate-200 dark:border-white/10 hover:text-sky-500 transition-colors"
                            >
                                <Instagram size={16} />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="rounded-md border-slate-200 dark:border-white/10 hover:text-sky-500 transition-colors"
                            >
                                <Twitter size={16} />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="rounded-md border-slate-200 dark:border-white/10 hover:text-sky-500 transition-colors"
                            >
                                <Facebook size={16} />
                            </Button>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-8 text-sky-500">
                            Navigation_Tree
                        </h4>
                        <ul className="space-y-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            <li>
                                <a href="#" className="hover:text-white transition-colors">
                                    Master_Archive
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white transition-colors">
                                    Catalog_List
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white transition-colors">
                                    Internal_Drops
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white transition-colors">
                                    Legacy_System
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-8 text-sky-500">
                            Service_Node
                        </h4>
                        <ul className="space-y-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            <li>
                                <a href="#" className="hover:text-white transition-colors">
                                    Shipment_Tracking
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white transition-colors">
                                    Return_Protocol
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white transition-colors">
                                    Cyber_Sec_Policy
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white transition-colors">
                                    Terminal_Faq
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-8 text-sky-500">
                            System_Status
                        </h4>
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                                <span className="text-[9px] font-mono text-slate-400">SERVER_ONLINE_100%</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                                <span className="text-[9px] font-mono text-slate-400">DB_SYNC_COMPLETE</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-sky-500 rounded-full"></div>
                                <span className="text-[9px] font-mono text-slate-400">VER_2.0.1_STABLE</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-4 pt-10 border-t border-slate-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex flex-col gap-1">
                        <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest italic">
                            © 2026 LUMINA_LAB_SYSTEMS. DESIGNED BY THOMAS_ALBERTO.
                        </p>
                        <p className="text-[8px] font-mono text-slate-600 uppercase tracking-widest">
                            HOSTED_ON_DECENTRALIZED_NET // ENCRYPTED_SSL
                        </p>
                    </div>
                    <div className="flex gap-10 text-[9px] font-mono text-slate-500 uppercase tracking-[0.2em]">
                        <div className="flex flex-col">
                            <span className="text-sky-500">LOC: PONTIANAK_ID</span>
                            <span>LAT: -0.0263 // LON: 109.3425</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
