/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Instagram, 
  Search, 
  MessageSquare, 
  Users, 
  Settings, 
  Send, 
  Target, 
  MapPin, 
  BarChart3, 
  Plus, 
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  RefreshCw,
  Sparkles,
  Zap,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";

// AI Initialization
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

type View = 'dashboard' | 'discovery' | 'outreach' | 'tracker';

interface Lead {
  id: string;
  username: string;
  sector: string;
  location: string;
  status: 'pending' | 'sent' | 'replied' | 'converted';
  lastAction: string;
}

export default function App() {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [niche, setNiche] = useState('Restaurantes Gourmet');
  const [location, setLocation] = useState('Madrid, España');
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<any>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [leads, setLeads] = useState<Lead[]>([
    { id: '1', username: '@el_rincon_gourmet', sector: 'Gastronomía', location: 'Madrid', status: 'pending', lastAction: 'Encontrado por hashtag' },
    { id: '2', username: '@madrid_eats', sector: 'Influencer Foodie', location: 'Madrid', status: 'sent', lastAction: 'DM enviado hace 2h' },
    { id: '3', username: '@chef_pablo_art', sector: 'Chef Privado', location: 'Madrid', status: 'replied', lastAction: 'Interesado en demo' },
  ]);

  const generateStrategy = async () => {
    setIsGenerating(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Eres un experto en Growth Hacking para Instagram. El usuario busca prospectos en el sector: "${niche}" en "${location}". 
        Proporciona una estrategia detallada que incluya:
        1. 5 Hashtags clave para buscar.
        2. 3 Tipos de ubicaciones (geo-tags) donde se encuentran.
        3. 2 Cuentas "líderes" donde buscar en sus seguidores.
        Responde en formato JSON amigable.`,
        config: {
          responseMimeType: "application/json"
        }
      });
      
      const data = JSON.parse(response.text);
      setSuggestions(data);
    } catch (error) {
      console.error("Error generating strategy:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateMessages = async () => {
    setIsGenerating(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Redacta 3 mensajes directos (DMs) de Instagram altamente efectivos para prospectar en el sector "${niche}". 
        - Mensaje 1: Gancho directo (Direct Hook).
        - Mensaje 2: Basado en valor (Value First).
        - Mensaje 3: Casual/Relacional (Soft Connect).
        Los mensajes deben ser cortos, humanos (sin parecer IA) y con un CTA claro pero no agresivo.
        Responde solo con los 3 mensajes separados.`,
      });
      
      const text = response.text;
      setMessages(text.split('\n').filter(m => m.trim().length > 10));
    } catch (error) {
      console.error("Error generating messages:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] text-slate-900 font-sans flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full z-10">
        <div className="p-6 flex items-center gap-3 border-bottom border-slate-100">
          <div className="w-10 h-10 bg-gradient-to-tr from-purple-600 to-pink-500 rounded-xl flex items-center justify-center text-white shadow-lg">
            <Instagram size={24} />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">InstaPro</h1>
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Assistant</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <NavItem 
            active={activeView === 'dashboard'} 
            onClick={() => setActiveView('dashboard')} 
            icon={<BarChart3 size={18} />} 
            label="Dashboard" 
          />
          <NavItem 
            active={activeView === 'discovery'} 
            onClick={() => setActiveView('discovery')} 
            icon={<Search size={18} />} 
            label="Descubrimiento" 
          />
          <NavItem 
            active={activeView === 'outreach'} 
            onClick={() => setActiveView('outreach')} 
            icon={<MessageSquare size={18} />} 
            label="Campañas AI" 
          />
          <NavItem 
            active={activeView === 'tracker'} 
            onClick={() => setActiveView('tracker')} 
            icon={<Users size={18} />} 
            label="Gestionar Leads" 
          />
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-50 p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={14} className="text-orange-500" />
              <span className="text-xs font-bold uppercase tracking-tighter">Plan Pro</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-orange-500 w-[65%] h-full"></div>
            </div>
            <p className="text-[10px] text-slate-500 mt-2">650 / 1,000 Mensajes AI</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-8">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 capitalize">{activeView === 'dashboard' ? 'Resumen General' : activeView}</h2>
            <p className="text-slate-500 text-sm mt-1">Automatización inteligente de prospección ética.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
              <Sparkles size={16} className="text-purple-500" />
              <span className="text-sm font-medium">IA Lista</span>
            </div>
            <button className="bg-slate-900 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-slate-800 transition-all font-medium shadow-sm">
              <Plus size={18} />
              Nueva Campaña
            </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeView === 'dashboard' && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-4 gap-6">
                <StatCard label="Leads Encontrados" value="1,284" change="+12%" icon={<Users className="text-blue-500" />} />
                <StatCard label="Mensajes Enviados" value="432" change="+5%" icon={<Send className="text-purple-500" />} />
                <StatCard label="Tasa de Respuesta" value="18.2%" change="+2.4%" icon={<TrendingUp className="text-emerald-500" />} />
                <StatCard label="Convertidos" value="24" change="+1" icon={<CheckCircle2 className="text-orange-500" />} />
              </div>

              {/* Active Campaigns */}
              <div className="grid grid-cols-3 gap-8">
                <div className="col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                    <Target size={20} className="text-slate-400" />
                    Propiedades de Prospección
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sector / Nicho</label>
                        <div className="relative">
                          <input 
                            value={niche} 
                            onChange={(e) => setNiche(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Ubicación</label>
                        <div className="relative">
                          <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input 
                            value={location} 
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 flex items-start gap-4">
                      <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                        <Globe size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-indigo-900 leading-tight">Sincronización con Mapas de Intención</h4>
                        <p className="text-indigo-700 text-sm mt-1">Buscaremos perfiles que hayan etiquetado su ubicación en negocios locales de {location} relacionados con {niche}.</p>
                      </div>
                    </div>

                    <button 
                      onClick={generateStrategy}
                      disabled={isGenerating}
                      className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all shadow-lg disabled:opacity-50"
                    >
                      {isGenerating ? <RefreshCw className="animate-spin" /> : <Sparkles />}
                      Analizar Estrategia de Búsqueda de Leads
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <h3 className="font-bold text-lg mb-6">IA Insights</h3>
                  <div className="space-y-4">
                    <InsightItem text="El mejor horario de envío para el sector Gastronomía es Martes a las 11:00 AM." />
                    <InsightItem text="Tu tasa de respuesta es un 4% superior a la media de Madrid este mes." />
                    <InsightItem text="Personaliza la referencia al menú para aumentar el interés un 22%." />
                  </div>
                  <div className="mt-8 pt-6 border-t border-slate-100">
                    <p className="text-xs text-slate-400 font-medium italic">"Instagram prioriza cuentas que interactúan con historias antes del primer DM."</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeView === 'discovery' && (
            <motion.div 
              key="discovery"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Search size={120} />
                </div>
                
                <h3 className="text-2xl font-bold mb-6">Guía de Descubrimiento para {niche}</h3>
                
                {!suggestions ? (
                  <div className="text-center py-20">
                    <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
                      <RefreshCw size={32} />
                    </div>
                    <p className="text-slate-500">Genera una estrategia para ver sugerencias de búsqueda...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-10 relative z-10">
                    <div className="space-y-6">
                      <section>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                          <span className="w-5 h-5 rounded bg-blue-100 text-blue-600 flex items-center justify-center text-[10px]">01</span>
                          Hashtags de Nicho
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {suggestions.hashtags?.map((tag: string) => (
                            <span key={tag} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-100">
                              #{tag.replace('#', '')}
                            </span>
                          ))}
                        </div>
                      </section>

                      <section>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                          <span className="w-5 h-5 rounded bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px]">02</span>
                          Ubicaciones Estratégicas
                        </h4>
                        <ul className="space-y-2">
                          {suggestions.ubicaciones?.map((loc: string) => (
                            <li key={loc} className="flex items-center gap-2 text-slate-700 text-sm">
                              <MapPin size={14} className="text-emerald-500" />
                              {loc}
                            </li>
                          ))}
                        </ul>
                      </section>
                    </div>

                    <div className="space-y-6 border-l border-slate-100 pl-10">
                      <section>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                          <span className="w-5 h-5 rounded bg-purple-100 text-purple-600 flex items-center justify-center text-[10px]">03</span>
                          Cuentas de la Competencia
                        </h4>
                        <div className="space-y-3">
                          {suggestions.cuentas_lideres?.map((acc: string) => (
                            <div key={acc} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                              <span className="font-medium text-slate-800">@{acc.replace('@', '')}</span>
                              <ChevronRight size={16} className="text-slate-300" />
                            </div>
                          ))}
                        </div>
                      </section>

                      <div className="bg-slate-900 rounded-xl p-5 text-white">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle size={16} className="text-yellow-400" />
                          <span className="text-[10px] font-bold uppercase tracking-tight">Consejo de Pro</span>
                        </div>
                        <p className="text-xs text-slate-300">
                          "Busca en las historias donde etiquetan a estas cuentas líderes. Esas personas son clientes activos y verificados en este momento."
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeView === 'outreach' && (
            <motion.div 
              key="outreach"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="text-2xl font-bold">Generador de Mensajes AI</h3>
                  <p className="text-slate-500">Scripts optimizados para no ser detectados como spam.</p>
                </div>
                <button 
                  onClick={generateMessages}
                  className="bg-purple-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-purple-700 transition shadow-lg"
                >
                  <Sparkles size={18} />
                  Generar Nuevas Variantes
                </button>
              </div>

              <div className="grid grid-cols-3 gap-6">
                {[
                  { title: "Direct Hook", type: "Rápido y al punto" },
                  { title: "Value First", type: "Aporta beneficio" },
                  { title: "Soft Connect", type: "Relacional" }
                ].map((type, idx) => (
                  <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col h-[350px]">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="px-2 py-1 bg-slate-100 text-slate-500 text-[10px] uppercase font-bold rounded mb-1 inline-block">{type.type}</span>
                        <h4 className="font-bold text-slate-800">{type.title}</h4>
                      </div>
                      <div className="p-2 bg-slate-50 rounded-lg">
                        <MessageSquare size={16} className="text-slate-400" />
                      </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto mb-4 p-4 bg-slate-50 rounded-xl text-sm italic text-slate-600 leading-relaxed">
                      {messages[idx] || "Haz clic en 'Generar' para crear este script personalizado..."}
                    </div>

                    <button 
                      onClick={() => navigator.clipboard.writeText(messages[idx] || "")}
                      className="w-full py-3 border border-slate-200 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-50 transition flex items-center justify-center gap-2"
                    >
                      Copiar Script
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeView === 'tracker' && (
            <motion.div 
              key="tracker"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-lg">Leads de la Campaña Actual</h3>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold border border-emerald-100 flex items-center gap-1">
                    <CheckCircle2 size={12} /> Sync con IG Activa
                  </span>
                </div>
              </div>
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Username</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nicho</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Última Acción</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {leads.map(lead => (
                    <tr key={lead.id} className="hover:bg-slate-50/50 transition">
                      <td className="px-6 py-4 font-bold text-indigo-600">{lead.username}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 uppercase text-[11px] font-medium tracking-tight bg-slate-50 w-fit rounded px-2 m-4">{lead.sector}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          lead.status === 'sent' ? 'bg-blue-100 text-blue-700' :
                          lead.status === 'replied' ? 'bg-orange-100 text-orange-700' :
                          lead.status === 'converted' ? 'bg-emerald-100 text-emerald-700' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">{lead.lastAction}</td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition">
                           <Send size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function NavItem({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
        active 
        ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' 
        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
      }`}
    >
      <span className={active ? 'text-white' : 'text-slate-400 group-hover:text-slate-900'}>
        {icon}
      </span>
      <span className="font-bold text-sm tracking-tight">{label}</span>
      {active && (
        <motion.div 
          layoutId="active-nav"
          className="ml-auto w-1.5 h-1.5 bg-white rounded-full"
        />
      )}
    </button>
  );
}

function StatCard({ label, value, change, icon }: { label: string; value: string; change: string; icon: React.ReactNode }) {
  const isPositive = change.startsWith('+');
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
          {icon}
        </div>
        <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
          {change}
        </span>
      </div>
      <div>
        <h4 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">{label}</h4>
        <p className="text-2xl font-black text-slate-900">{value}</p>
      </div>
    </div>
  );
}

function InsightItem({ text }: { text: string }) {
  return (
    <div className="flex gap-3 text-sm">
      <div className="mt-1">
        <TrendingUp size={14} className="text-emerald-500" />
      </div>
      <p className="text-slate-600 font-medium leading-relaxed">{text}</p>
    </div>
  );
}
