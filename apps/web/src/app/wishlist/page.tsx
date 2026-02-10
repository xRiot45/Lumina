'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Heart, LayoutGrid, Plus, Trash2, Zap } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// --- MOCK DATA WISHLIST ---
const INITIAL_WISHLIST = [
    {
        id: 1,
        name: 'Lumina Industrial Cargo v2',
        price: 'Rp 899.000',
        category: 'Apparel',
        image: 'from-sky-500/20 to-blue-600/20',
        isNew: true,
    },
    {
        id: 4,
        name: 'Vertex Smart Glasses',
        price: 'Rp 2.499.000',
        category: 'Accessories',
        image: 'from-indigo-500/20 to-sky-500/20',
        isNew: false,
    },
    {
        id: 2,
        name: 'Aero-Tech Sneakers White',
        price: 'Rp 2.150.000',
        category: 'Footwear',
        image: 'from-emerald-500/20 to-teal-500/20',
        isNew: true,
    },
];

export default function WishlistPage() {
    const [wishlist, setWishlist] = useState(INITIAL_WISHLIST);
    const [isDark, setIsDark] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    const removeItem = (id: number) => {
        setWishlist(wishlist.filter((item) => item.id !== id));
    };

    if (!mounted) return null;

    return (
        <div
            className={`min-h-screen transition-colors duration-500 ${isDark ? 'dark bg-[#050505] text-white' : 'bg-slate-50 text-slate-900'}`}
        >
            <main className="max-w-7xl mx-auto px-4 py-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <div className="flex items-center gap-2 text-sky-500 mb-2">
                            <Heart className="w-5 h-5 fill-current" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                                Accessing_Database
                            </span>
                        </div>
                        <h1 className="text-4xl font-black uppercase tracking-tighter italic">
                            Your_Wishlist [ {wishlist.length} ]
                        </h1>
                    </div>
                    {wishlist.length > 0 && (
                        <Button className="rounded-md bg-sky-600 hover:bg-sky-700 text-white font-black text-[10px] uppercase tracking-widest h-12 px-8">
                            Move_All_To_Cart <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    )}
                </div>

                {/* --- GRID WISHLIST --- */}
                {wishlist.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                        <AnimatePresence>
                            {wishlist.map((product) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    key={product.id}
                                    className={`group relative flex flex-col border rounded-md p-3 transition-all ${isDark ? 'bg-white/2 border-white/5 hover:border-sky-500/40' : 'bg-white border-slate-200 shadow-sm hover:border-sky-500'}`}
                                >
                                    {/* Image Container */}
                                    <div
                                        className={`aspect-square rounded-sm bg-linear-to-br ${product.image} relative overflow-hidden mb-4 border border-transparent group-hover:border-sky-500/20 transition-colors`}
                                    >
                                        {product.isNew && (
                                            <Badge className="absolute top-2 left-2 rounded-sm text-[8px] font-black bg-sky-600 text-white border-none">
                                                NEW_DROP
                                            </Badge>
                                        )}
                                        <button
                                            onClick={() => removeItem(product.id)}
                                            className="absolute top-2 right-2 p-2 rounded-md bg-red-500/10 text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                        <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:opacity-40 transition-opacity">
                                            <Zap size={48} />
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 space-y-3">
                                        <div>
                                            <p className="text-[9px] font-black text-sky-500 uppercase tracking-widest mb-1">
                                                {product.category}
                                            </p>
                                            <h3 className="font-bold text-xs uppercase tracking-tight line-clamp-2 h-8 leading-snug group-hover:text-sky-500 transition-colors italic">
                                                {product.name}
                                            </h3>
                                        </div>

                                        <div className="flex items-center justify-between pt-2 border-t border-slate-500/10">
                                            <span className="font-mono text-sm font-bold tracking-tighter">
                                                {product.price}
                                            </span>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-8 w-8 rounded-md bg-sky-500/10 text-sky-500 hover:bg-sky-500 hover:text-white"
                                            >
                                                <Plus size={16} />
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    /* --- EMPTY STATE --- */
                    <div
                        className={`py-32 text-center border-2 border-dashed rounded-md transition-colors ${isDark ? 'border-white/5' : 'border-slate-200'}`}
                    >
                        <div className="w-20 h-20 bg-sky-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Heart className="w-8 h-8 text-sky-500 opacity-20" />
                        </div>
                        <h3 className="text-xl font-black uppercase tracking-widest italic mb-2">Archive_Empty</h3>
                        <p className="text-xs text-slate-500 uppercase tracking-widest mb-8">
                            Anda belum menyimpan item apapun ke dalam database wishlist.
                        </p>
                        <Button
                            className="rounded-md bg-sky-600 hover:bg-sky-700 text-white font-black text-[10px] uppercase tracking-[0.3em] h-12 px-10"
                            asChild
                        >
                            <Link href="/catalog">Return_To_Catalog</Link>
                        </Button>
                    </div>
                )}

                {/* --- RECOMMENDATION SECTION (Simulasi Konten Tambahan) --- */}
                {wishlist.length > 0 && (
                    <section className="mt-24">
                        <div className="flex items-center gap-4 mb-8">
                            <LayoutGrid className="text-sky-500" size={20} />
                            <h2 className="text-lg font-black uppercase tracking-widest italic">Suggested_For_You</h2>
                            <div className="h-px flex-1 bg-slate-500/10"></div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
                            {[1, 2, 3, 4].map((i) => (
                                <div
                                    key={i}
                                    className={`h-20 border rounded-md border-dashed border-slate-500/20 flex items-center justify-center text-[10px] font-mono tracking-widest`}
                                >
                                    RECOM_NODE_0{i}
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </main>

            {/* --- FOOTER SIMPLIFIED --- */}
            <footer className="mt-20 py-10 border-t border-slate-500/10">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[9px] font-mono text-slate-500 uppercase tracking-[0.4em]">
                        © 2026 LUMINA_LAB_WISHLIST // STATUS: SECURE
                    </p>
                    <div className="flex gap-6 text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                        <span>Lat: -0.0263</span>
                        <span>Lon: 109.3425</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
