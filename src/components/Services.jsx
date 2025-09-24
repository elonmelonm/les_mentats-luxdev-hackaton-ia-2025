import { ArrowRightIcon } from "@heroicons/react/16/solid";
import { BriefcaseIcon } from "@heroicons/react/24/outline";


export function Services() {
  return (
    <div className="px-16 py-16 h-screen flex flex-col bg-[#EDEDED] items-center justify-center gap-12">
      <div className="flex flex-col items-center justify-center gap-4">
        <span className="text-4xl font-bold">Services</span>
        <span className="flex flex-row items-center justify-center gap-2">
            <span className="w-16 h-1 bg-[#367C55] rounded-full"></span>
            <span > <BriefcaseIcon className="w-6 h-6 text-[#367C55]" /> </span>
            <span className="w-16 h-1 bg-[#367C55] rounded-full"></span>
        </span>
        <span className="flex justify-center items-center gap-2 text-[18px] text-[#367C55] font-medium">
            <span className="font-semibold">
                Tous Nos Services
            </span><ArrowRightIcon className="w-4 h-4 mt-0.5" /></span>
      </div>
      <div className="grid grid-cols-3 gap-8">
        {/* Service 1 - Topographie */}
        <div className="group relative flex flex-col items-end justify-end min-w-72 min-h-72 gap-4 border hover:border-[#367C55] hover:border-[8px] p-4 transition-all duration-300">
            <span className="text-[150px] text-slate-400 group-hover:text-[#367C55] transition-colors duration-300">01</span>
            <span className="text-sm text-[30px] font-bold text-gray-500 group-hover:text-[#367C55] transition-colors duration-300">Topographie</span>
            
            {/* Informations au survol */}
            <div className="absolute inset-0 bg-white bg-opacity-95 p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-end text-end">
                <p className="text-gray-600 text-[40px] mb-4 leading-relaxed">
                    01
                </p>
                <h3 className="text-3xl font-bold text-[#367C55] mb-4">Topographie</h3>
                <ul className="text-sm text-gray-500 space-y-2 mb-6">
                    Levés topographiques précis pour vos projets de construction et d'aménagement.
                </ul>
                <button className="bg-[#367C55] text-white px-6 py-2 hover:bg-[#2d5f44] transition-colors duration-200 cursor-pointer uppercase">
                    Vérifier
                </button>
            </div>
        </div>

        {/* Service 2 - Cadastre */}
        <div className="group relative flex flex-col items-end justify-end min-w-72 min-h-72 gap-4 border hover:border-[#367C55] hover:border-[8px] p-4 transition-all duration-300">
            <span className="text-[150px] text-slate-400 group-hover:text-[#367C55] transition-colors duration-300">02</span>
            <span className="text-sm text-[30px] font-bold text-gray-500 group-hover:text-[#367C55] transition-colors duration-300">Cadastre</span>
            
            {/* Informations au survol */}
            <div className="absolute inset-0 bg-white bg-opacity-95 p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-end text-end">
                <p className="text-gray-600 text-[40px] mb-4 leading-relaxed">
                    02
                </p>
                <h3 className="text-3xl font-bold text-[#367C55] mb-4">Cadastre</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                    
                </p>
                <ul className="text-sm text-gray-500 space-y-2 mb-6">
                    Sécurisation foncière et délivrance de titres de propriété.
                </ul>
                <button className="bg-[#367C55] text-white px-6 py-2 hover:bg-[#2d5f44] transition-colors duration-200 cursor-pointer uppercase">
                    En savoir plus
                </button>
            </div>
        </div>

        {/* Service 3 - Chatbot */}
        <div className="group relative flex flex-col items-end justify-end min-w-72 min-h-72 gap-4 border hover:border-[#367C55] hover:border-[8px] p-4 transition-all duration-300">
            <span className="text-[150px] text-slate-400 group-hover:text-[#367C55] transition-colors duration-300">03</span>
            <span className="text-sm text-[30px] font-bold text-gray-500 group-hover:text-[#367C55] transition-colors duration-300">Chatbot</span>
            
            {/* Informations au survol */}
            <div className="absolute inset-0 bg-white bg-opacity-95 p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-end text-end">
                <p className="text-gray-600 text-[40px] mb-4 leading-relaxed">
                    03
                </p>
                <h3 className="text-3xl font-bold text-[#367C55] mb-4">Assistant IA</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                    
                </p>
                <ul className="text-sm text-gray-500 space-y-2 mb-6">
                    Assistant virtuel intelligent pour répondre à vos questions 24h/24.
                </ul>
                <button className="bg-[#367C55] text-white px-6 py-2 hover:bg-[#2d5f44] transition-colors duration-200  cursor-pointer uppercase">
                    Des questions ?
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}