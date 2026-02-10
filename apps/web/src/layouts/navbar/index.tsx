'use client';

import { Button } from '@/components/ui/button';
import { useThemeContext } from '@/providers/theme-provider';
import { Bell, Heart, Moon, Search, ShoppingBag, Sun } from 'lucide-react';

export default function Navbar() {
    const { isDarkMode, toggleTheme } = useThemeContext();
    return (
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
                    <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-md">
                        {isDarkMode ? <Sun className="w-4 h-4 text-sky-400" /> : <Moon className="w-4 h-4" />}
                    </Button>
                    <Button className="h-9 rounded-md bg-sky-600 hover:bg-sky-700 font-bold text-[10px] uppercase tracking-widest px-6 shadow-lg shadow-sky-500/20">
                        Login_Access
                    </Button>
                </div>
            </div>
        </header>
    );
}
