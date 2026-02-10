'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    ChevronLeft,
    CreditCard,
    Info,
    Minus,
    Plus,
    ShieldCheck,
    ShoppingBag,
    Trash2,
    Truck,
    Zap,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// --- MOCK DATA ITEMS KERANJANG ---
const INITIAL_ITEMS = [
    {
        id: 1,
        name: 'Lumina Industrial Cargo v2',
        price: 899000,
        size: 'M',
        qty: 1,
        image: 'bg-sky-500/20',
    },
    {
        id: 2,
        name: 'Aero-Tech Sneakers White',
        price: 2150000,
        size: '42',
        qty: 1,
        image: 'bg-indigo-500/20',
    },
];

export default function CartPage() {
    const [items, setItems] = useState(INITIAL_ITEMS);
    const [isDark, setIsDark] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    const updateQty = (id: number, delta: number) => {
        setItems(items.map((item) => (item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item)));
    };

    const removeItem = (id: number) => {
        setItems(items.filter((item) => item.id !== id));
    };

    const subtotal = items.reduce((acc, item) => acc + item.price * item.qty, 0);
    const shipping = subtotal > 0 ? 50000 : 0;
    const total = subtotal + shipping;

    if (!mounted) return null;

    return (
        <div
            className={`min-h-screen transition-colors duration-500 ${isDark ? 'dark bg-[#050505] text-white' : 'bg-slate-50 text-slate-900'}`}
        >
            <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
                <div className="flex items-center gap-3 mb-10">
                    <Link href="/catalog" className="hover:text-sky-500 transition-colors">
                        <ChevronLeft size={20} />
                    </Link>
                    <h1 className="text-3xl font-black uppercase tracking-tighter italic">
                        Your_Manifest [ {items.length} ]
                    </h1>
                </div>

                <div className="flex flex-col lg:flex-row gap-10">
                    {/* --- LEFT: ITEMS LIST (70%) --- */}
                    <div className="w-full lg:w-[70%] space-y-6">
                        {items.length > 0 ? (
                            items.map((item) => (
                                <motion.div
                                    layout
                                    key={item.id}
                                    className={`flex flex-col md:flex-row items-center gap-6 p-6 border rounded-md transition-colors ${isDark ? 'bg-white/2 border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}
                                >
                                    {/* Item Image */}
                                    <div
                                        className={`w-full md:w-32 h-32 rounded-md ${item.image} flex items-center justify-center border border-current opacity-20`}
                                    >
                                        <Zap size={32} />
                                    </div>

                                    {/* Item Info */}
                                    <div className="flex-1 space-y-1 text-center md:text-left">
                                        <Badge
                                            variant="outline"
                                            className="rounded-sm text-[9px] font-black tracking-widest border-sky-500 text-sky-500 uppercase"
                                        >
                                            Premium_Unit
                                        </Badge>
                                        <h3 className="text-lg font-black uppercase tracking-tight italic">
                                            {item.name}
                                        </h3>
                                        <p className="text-xs font-mono text-slate-500 tracking-widest">
                                            SIZE: {item.size} // SKU: LUM-00{item.id}
                                        </p>
                                    </div>

                                    {/* Quantity & Price */}
                                    <div className="flex flex-col md:items-end gap-4 w-full md:w-auto">
                                        <div className="flex items-center justify-center border rounded-md border-slate-500/20 overflow-hidden">
                                            <button
                                                onClick={() => updateQty(item.id, -1)}
                                                className="p-2 hover:bg-sky-500/10 transition-colors"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="w-10 text-center font-mono text-sm font-bold">
                                                {item.qty}
                                            </span>
                                            <button
                                                onClick={() => updateQty(item.id, 1)}
                                                className="p-2 hover:bg-sky-500/10 transition-colors"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-lg font-black font-mono text-sky-500">
                                                Rp {(item.price * item.qty).toLocaleString()}
                                            </div>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-[10px] font-bold text-red-500 uppercase flex items-center gap-1 mt-1 hover:underline ml-auto"
                                            >
                                                <Trash2 size={12} /> Remove_Item
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="py-20 text-center border border-dashed rounded-md border-slate-500/30">
                                <ShoppingBag size={48} className="mx-auto mb-4 opacity-20" />
                                <p className="text-sm font-mono uppercase tracking-[0.2em] opacity-50">
                                    Your_Cart_Is_Empty
                                </p>
                                <Button
                                    className="mt-6 rounded-md bg-sky-600 uppercase text-[10px] tracking-widest font-black"
                                    asChild
                                >
                                    <Link href="/catalog">Go_To_Archive</Link>
                                </Button>
                            </div>
                        )}

                        {/* Additional Info Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10 opacity-60">
                            <div className="p-4 border border-slate-500/20 rounded-md flex gap-4">
                                <Truck className="text-sky-500" size={20} />
                                <div className="text-[10px] uppercase tracking-widest font-bold">
                                    <p>Free_Global_Logistics</p>
                                    <p className="opacity-50 mt-1">Orders above Rp 2.000.000</p>
                                </div>
                            </div>
                            <div className="p-4 border border-slate-500/20 rounded-md flex gap-4">
                                <ShieldCheck className="text-sky-500" size={20} />
                                <div className="text-[10px] uppercase tracking-widest font-bold">
                                    <p>Secure_Node_Transaction</p>
                                    <p className="opacity-50 mt-1">AES-256 Bit Encryption</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- RIGHT: SUMMARY (30%) --- */}
                    <div className="w-full lg:w-[30%]">
                        <div
                            className={`p-8 border rounded-md sticky top-24 transition-colors ${isDark ? 'bg-white/3 border-white/10' : 'bg-white border-slate-200 shadow-xl shadow-slate-200/50'}`}
                        >
                            <h2 className="text-xl font-black uppercase tracking-tighter italic mb-6">Order_Summary</h2>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-500">
                                    <span>Subtotal</span>
                                    <span className="font-mono text-current">Rp {subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-500">
                                    <span>Logistics_Fee</span>
                                    <span className="font-mono text-current">Rp {shipping.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-500">
                                    <span>Tax_Protocol (0%)</span>
                                    <span className="font-mono text-current">Rp 0</span>
                                </div>
                                <Separator className="bg-current opacity-10" />
                                <div className="flex justify-between text-lg font-black uppercase tracking-tighter">
                                    <span>Total_Amount</span>
                                    <span className="text-sky-500 font-mono italic">Rp {total.toLocaleString()}</span>
                                </div>
                            </div>

                            {/* Promo Code */}
                            <div className="mb-8">
                                <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 mb-3 block">
                                    Promo_Access_Code
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="ENTER_CODE"
                                        className={`flex-1 rounded-md px-3 text-[10px] font-mono outline-none border transition-all ${isDark ? 'bg-white/5 border-white/10 focus:border-sky-500' : 'bg-slate-100 border-slate-200 focus:border-sky-500'}`}
                                    />
                                    <Button
                                        variant="outline"
                                        className="rounded-md uppercase text-[9px] font-black border-2 transition-all hover:bg-sky-500 hover:text-white"
                                    >
                                        Apply
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Button className="w-full h-14 rounded-md bg-sky-600 hover:bg-sky-700 font-black uppercase tracking-[0.3em] text-[11px] text-white border-none shadow-lg shadow-sky-500/20 group">
                                    Proceed_To_Checkout{' '}
                                    <ArrowRight
                                        size={16}
                                        className="ml-2 group-hover:translate-x-1 transition-transform"
                                    />
                                </Button>
                                <div className="flex items-center justify-center gap-2 text-[9px] font-bold text-slate-500 uppercase tracking-widest py-2">
                                    <CreditCard size={12} /> Trusted_Payment_Nodes
                                </div>
                            </div>
                        </div>

                        {/* Helper Info */}
                        <div className="mt-6 p-4 rounded-md border border-dashed border-slate-500/20 flex gap-3">
                            <Info size={16} className="text-sky-500 shrink-0" />
                            <p className="text-[9px] font-medium uppercase tracking-widest leading-relaxed text-slate-500">
                                Barang yang sudah dibeli dapat ditukar dalam waktu 7 hari dengan menyertakan
                                Unit_Verification_Code.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {/* --- FOOTER SIMPLIFIED --- */}
            <footer className="mt-20 py-10 border-t border-slate-500/10 text-center">
                <p className="text-[9px] font-mono text-slate-500 uppercase tracking-[0.4em]">
                    © 2026 LUMINA_LAB_SYSTEMS // CART_VER_1.0.4
                </p>
            </footer>
        </div>
    );
}
