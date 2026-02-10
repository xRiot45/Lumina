'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { Chrome, Github, Lock, Mail, Moon, ShieldCheck, ShoppingBag, Sun, User, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function RegisterPage7030() {
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
                    <div className="absolute top-[-10%] right-[-10%] w-175 h-175 bg-sky-600/10 blur-[150px] rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070')] bg-cover bg-center grayscale opacity-20 contrast-150"></div>
                    <div
                        className={`absolute inset-0 bg-linear-to-r ${isDark ? 'from-black via-black/60 to-transparent' : 'from-slate-900/80 via-transparent to-transparent'}`}
                    ></div>
                </div>

                {/* Decorative Grid Elements */}
                <div
                    className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{
                        backgroundImage: `linear-gradient(${isDark ? '#ffffff10' : '#00000010'} 1px, transparent 1px), linear-gradient(90deg, ${isDark ? '#ffffff10' : '#00000010'} 1px, transparent 1px)`,
                        backgroundSize: '40px 40px',
                    }}
                ></div>

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

                    <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="max-w-3xl">
                        <Badge className="rounded-md bg-sky-600/20 text-sky-400 border border-sky-500/30 mb-8 px-4 py-1 text-[10px] font-black tracking-[0.4em]">
                            ENROLLMENT_PROTOCOL: ACTIVE
                        </Badge>
                        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter uppercase italic leading-[0.85] mb-8">
                            JOIN THE <br /> <span className="text-sky-500">NETWORK.</span>
                        </h1>
                        <p className="text-slate-400 max-w-lg text-xs md:text-sm leading-loose uppercase tracking-[0.2em] font-bold">
                            Buat identitas digital Anda sekarang. Dapatkan akses penuh ke sistem logistik modular, drop
                            eksklusif, dan komunitas lab global.
                        </p>
                    </motion.div>

                    {/* Footer Info Left */}
                    <div className="hidden lg:flex items-center gap-12 border-t border-white/5 pt-10">
                        <div className="flex flex-col gap-2">
                            <span className="text-[9px] font-black uppercase opacity-40 tracking-[0.3em]">
                                Identity_Security
                            </span>
                            <span className="text-sky-500 font-mono text-sm font-bold tracking-widest italic flex items-center gap-2">
                                <ShieldCheck size={14} /> BIO_AUTH_READY
                            </span>
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className="text-[9px] font-black uppercase opacity-40 tracking-[0.3em]">
                                Node_Region
                            </span>
                            <span className="font-mono text-sm font-bold tracking-widest uppercase">
                                ID_WEST_KALIMANTAN // 01
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- DIV 2: REGISTER FORM (30% WIDTH) --- */}
            <div className="w-full lg:w-[30%] min-h-[60vh] lg:min-h-screen flex items-center justify-center p-8 md:p-12 relative bg-white dark:bg-[#050505] transition-colors duration-500">
                {/* Toggle Theme */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-6 right-6 rounded-md hover:bg-sky-500/10"
                    onClick={() => setIsDark(!isDark)}
                >
                    {isDark ? <Sun className="w-4 h-4 text-sky-400" /> : <Moon className="w-4 h-4 text-slate-500" />}
                </Button>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-sm space-y-10">
                    {/* Form Header */}
                    <div className="space-y-3">
                        <h2 className="text-3xl font-black uppercase tracking-tighter italic">Create_Operator_ID</h2>
                        <div className="h-1 w-12 bg-sky-500"></div>
                        <p className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.3em]">
                            Register for node access // P.0.1
                        </p>
                    </div>

                    {/* Form Fields */}
                    <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                        <div className="space-y-4">
                            {/* Full Name Input */}
                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 ml-1">
                                    Legal_Name_ID
                                </label>
                                <div className="relative group">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-sky-500 transition-colors" />
                                    <Input
                                        type="text"
                                        placeholder="THOMAS ALBERTO"
                                        className={`rounded-md h-12 pl-10 text-[11px] font-mono uppercase transition-all ${isDark ? 'bg-white/5 border-white/10 focus:border-sky-500' : 'bg-slate-100 border-slate-200 focus:border-sky-500'}`}
                                    />
                                </div>
                            </div>

                            {/* Email Input */}
                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 ml-1">
                                    Email_Address
                                </label>
                                <div className="relative group">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-sky-500 transition-colors" />
                                    <Input
                                        type="email"
                                        placeholder="NAME@DOMAIN.COM"
                                        className={`rounded-md h-12 pl-10 text-[11px] font-mono uppercase transition-all ${isDark ? 'bg-white/5 border-white/10 focus:border-sky-500' : 'bg-slate-100 border-slate-200 focus:border-sky-500'}`}
                                    />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 ml-1">
                                    Access_Secret
                                </label>
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

                        <div className="flex items-start space-x-3 px-1 pt-2">
                            <Checkbox
                                id="terms"
                                className={`mt-1 rounded-sm border-2 transition-colors ${isDark ? 'border-white/20 data-[state=checked]:bg-sky-500 data-[state=checked]:border-sky-500' : 'border-slate-300 data-[state=checked]:bg-sky-600'}`}
                            />
                            <label
                                htmlFor="terms"
                                className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-500 cursor-pointer select-none leading-relaxed"
                            >
                                Saya menyetujui <span className="text-sky-500">Syarat & Ketentuan</span> serta kebijakan
                                privasi data Lumina Lab.
                            </label>
                        </div>

                        <Button className="w-full rounded-md bg-sky-600 hover:bg-sky-700 h-14 font-black uppercase tracking-[0.4em] text-[11px] text-white border-none shadow-xl shadow-sky-500/10 group mt-4">
                            Initialize_Registration{' '}
                            <UserPlus className="w-4 h-4 ml-2 group-hover:scale-110 transition-transform" />
                        </Button>
                    </form>

                    {/* Social Access Divider */}
                    <div className="relative">
                        <div className={`absolute inset-0 flex items-center ${isDark ? 'opacity-10' : 'opacity-20'}`}>
                            <span className="w-full border-t border-current"></span>
                        </div>
                        <div className="relative flex justify-center text-[9px] font-black uppercase tracking-[0.4em]">
                            <span
                                className={`px-4 ${isDark ? 'bg-[#050505] text-slate-500' : 'bg-white text-slate-400'}`}
                            >
                                Or_Sync_With
                            </span>
                        </div>
                    </div>

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

                    {/* Footer Link */}
                    <div className="pt-6">
                        <p className="text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            Already an Operator? <br />
                            <Link href="/login" className="text-sky-500 hover:text-sky-400 transition-colors">
                                Authorize_Existing_Session
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
