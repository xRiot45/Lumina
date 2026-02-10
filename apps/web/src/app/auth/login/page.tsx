'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import {
    Activity,
    Chrome,
    Fingerprint,
    Github,
    Lock,
    Mail,
    Moon,
    ShieldCheck,
    ShoppingBag,
    Sun,
    Zap,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function LoginPage7030() {
    const [isDark, setIsDark] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);
    if (!mounted) return null;

    return (
        <div
            className={`min-h-screen flex flex-col lg:flex-row transition-colors duration-500 ${isDark ? 'dark bg-[#050505] text-white' : 'bg-slate-50 text-slate-900'}`}
        >
            {/* --- DIV 1: VISUAL CONTENT (70% WIDTH) --- */}
            <div className="relative w-full lg:w-[70%] min-h-[40vh] lg:min-h-screen overflow-hidden bg-slate-900 border-b lg:border-b-0 lg:border-r border-white/5">
                {/* Background Visuals */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-[-20%] left-[-10%] w-200 h-200 bg-sky-600/10 blur-[150px] rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=2187')] bg-cover bg-center grayscale opacity-30 contrast-125"></div>
                    <div
                        className={`absolute inset-0 bg-linear-to-r ${isDark ? 'from-black via-black/40 to-transparent' : 'from-slate-900/80 via-transparent to-transparent'}`}
                    ></div>
                </div>

                {/* Floating UI Elements (Simulasi Web3/Industrial) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl px-8 hidden lg:block opacity-20 pointer-events-none">
                    <div className="grid grid-cols-3 gap-8">
                        <div className="h-64 border border-white/10 rounded-md p-4 flex flex-col justify-between">
                            <Activity size={16} className="text-sky-500" />
                            <div className="h-1 w-full bg-white/5 rounded-full">
                                <div className="h-full w-2/3 bg-sky-500 rounded-full"></div>
                            </div>
                        </div>
                        <div className="h-64 border border-white/10 rounded-md"></div>
                        <div className="h-64 border border-white/10 rounded-md flex items-center justify-center italic font-black text-4xl opacity-10">
                            LUMINA
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="relative z-10 p-8 md:p-16 lg:p-24 h-full flex flex-col justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-sky-500 p-2 rounded-md shadow-[0_0_20px_rgba(14,165,233,0.3)]">
                            <ShoppingBag className="w-6 h-6 text-white" />
                        </div>
                        <span className="font-black text-2xl tracking-tighter uppercase italic">
                            LUMINA<span className="text-sky-500 font-light">_LAB</span>
                        </span>
                    </div>

                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
                        <Badge className="rounded-md bg-sky-600/20 text-sky-400 border border-sky-500/30 mb-8 px-4 py-1 text-[10px] font-black tracking-[0.4em]">
                            SYSTEM_ACCESS: PONTIANAK_NODE_01
                        </Badge>
                        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter uppercase italic leading-[0.85] mb-8">
                            SECURE <br /> <span className="text-sky-500">INTERFACE</span> <br /> 2026.
                        </h1>
                        <p className="text-slate-400 max-w-lg text-xs md:text-sm leading-loose uppercase tracking-[0.2em] font-bold">
                            Masuk ke dalam ekosistem Lumina untuk mengelola aset digital, melacak pengiriman eksklusif,
                            dan mengakses drop terbatas.
                        </p>
                    </motion.div>

                    {/* Footer Info Left */}
                    <div className="hidden lg:flex items-center gap-12 border-t border-white/5 pt-10">
                        <div className="flex flex-col gap-2">
                            <span className="text-[9px] font-black uppercase opacity-40 tracking-[0.3em]">
                                Protocol
                            </span>
                            <span className="text-sky-500 font-mono text-sm font-bold tracking-widest">
                                TLS_v1.3_ENCRYPTED
                            </span>
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className="text-[9px] font-black uppercase opacity-40 tracking-[0.3em]">
                                Server_Status
                            </span>
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                                <span className="font-mono text-sm font-bold tracking-widest">STABLE_CONNECTED</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- DIV 2: LOGIN FORM (30% WIDTH) --- */}
            <div className="w-full lg:w-[30%] min-h-[60vh] lg:min-h-screen flex items-center justify-center p-8 md:p-12 relative bg-white dark:bg-[#050505] transition-colors duration-500">
                {/* Toggle Theme (Floating Mobile Safe) */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-6 right-6 rounded-md hover:bg-sky-500/10"
                    onClick={() => setIsDark(!isDark)}
                >
                    {isDark ? <Sun className="w-4 h-4 text-sky-400" /> : <Moon className="w-4 h-4 text-slate-500" />}
                </Button>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-sm space-y-12">
                    {/* Form Header */}
                    <div className="space-y-3">
                        <h2 className="text-3xl font-black uppercase tracking-tighter italic">Initialize_Session</h2>
                        <div className="h-1 w-12 bg-sky-500"></div>
                        <p className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.3em]">
                            Credentials Required // V.4.0.2
                        </p>
                    </div>

                    {/* Social Access */}
                    <div className="grid grid-cols-2 gap-3">
                        <Button
                            variant="outline"
                            className={`rounded-md h-12 text-[10px] font-black uppercase tracking-widest transition-all hover:border-sky-500 ${isDark ? 'border-white/10' : 'border-slate-200'}`}
                        >
                            <Github className="w-4 h-4 mr-2" /> Github
                        </Button>
                        <Button
                            variant="outline"
                            className={`rounded-md h-12 text-[10px] font-black uppercase tracking-widest transition-all hover:border-sky-500 ${isDark ? 'border-white/10' : 'border-slate-200'}`}
                        >
                            <Chrome className="w-4 h-4 mr-2" /> Google
                        </Button>
                    </div>

                    {/* Form Fields */}
                    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 ml-1">
                                    User_Identifier
                                </label>
                                <div className="relative group">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-sky-500 transition-colors" />
                                    <Input
                                        type="email"
                                        placeholder="NAME@PROTOCOL.COM"
                                        className={`rounded-md h-12 pl-10 text-[11px] font-mono uppercase transition-all ${isDark ? 'bg-white/5 border-white/10 focus:border-sky-500' : 'bg-slate-100 border-slate-200 focus:border-sky-500'}`}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">
                                        Access_Key
                                    </label>
                                    <a
                                        href="#"
                                        className="text-[9px] font-black text-sky-500 uppercase hover:underline"
                                    >
                                        Recovery
                                    </a>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-sky-500 transition-colors" />
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        className={`rounded-md h-12 pl-10 text-[11px] font-mono transition-all ${isDark ? 'bg-white/5 border-white/10 focus:border-sky-500' : 'bg-slate-100 border-slate-200 focus:border-sky-500'}`}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3 px-1">
                            <Checkbox
                                id="remember"
                                className={`rounded-sm border-2 transition-colors ${isDark ? 'border-white/20 data-[state=checked]:bg-sky-500 data-[state=checked]:border-sky-500' : 'border-slate-300 data-[state=checked]:bg-sky-600'}`}
                            />
                            <label
                                htmlFor="remember"
                                className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 cursor-pointer select-none"
                            >
                                Persistent_Sync
                            </label>
                        </div>

                        <Button className="w-full rounded-md bg-sky-600 hover:bg-sky-700 h-14 font-black uppercase tracking-[0.4em] text-[11px] text-white border-none shadow-xl shadow-sky-500/10 group">
                            Login_Secure{' '}
                            <Fingerprint className="w-4 h-4 ml-2 group-hover:scale-110 transition-transform" />
                        </Button>
                    </form>

                    {/* Form Footer */}
                    <div className="space-y-6 pt-6">
                        <p className="text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-loose">
                            New Operator? <br />
                            <Link href="/auth/register" className="text-sky-500 hover:text-sky-400 transition-colors">
                                Apply_For_Node_Access
                            </Link>
                        </p>

                        {/* System Status Indicators */}
                        <div className="flex justify-center items-center gap-6 opacity-20 hover:opacity-100 transition-opacity duration-500">
                            <ShieldCheck size={18} />
                            <Zap size={18} />
                            <Lock size={18} />
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
