import { ArrowRightIcon } from "@heroicons/react/16/solid";
import { BriefcaseIcon } from "@heroicons/react/24/outline";


export function Services() {
  return (
    <div id="services-section" className="px-4 sm:px-8 md:px-12 lg:px-16 py-8 sm:py-12 md:py-16 min-h-screen flex flex-col bg-[#EDEDED] items-center justify-center gap-8 sm:gap-10 md:gap-12">
      <div className="flex flex-col items-center justify-center gap-3 sm:gap-4">
        <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-center">Services</span>
        <span className="flex flex-row items-center justify-center gap-2">
            <span className="w-8 sm:w-12 md:w-16 h-1 bg-[#367C55] rounded-full"></span>
            <span > <BriefcaseIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#367C55]" /> </span>
            <span className="w-8 sm:w-12 md:w-16 h-1 bg-[#367C55] rounded-full"></span>
        </span>
        <span className="flex justify-center items-center gap-2 text-sm sm:text-base md:text-[18px] text-[#367C55] font-medium">
            <span className="font-semibold text-center">
                Tous Nos Services
            </span><ArrowRightIcon className="w-3 h-3 sm:w-4 sm:h-4 mt-0.5" /></span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 w-full max-w-7xl">
        {/* Service 1 - Topographie */}
        <div className="group relative flex flex-col items-end justify-end w-full h-48 sm:h-72 md:h-80 lg:h-72 gap-2 sm:gap-4 border hover:border-[#367C55] hover:border-2 sm:hover:border-4 lg:hover:border-[8px] p-3 sm:p-4 transition-all duration-300 cursor-pointer">
            <span className="text-8xl sm:text-[120px] md:text-[140px] lg:text-[150px] text-slate-400 group-hover:text-[#367C55] transition-colors duration-300">01</span>
            <span className="text-xs sm:text-sm text-xl sm:text-2xl md:text-[30px] font-bold text-gray-500 group-hover:text-[#367C55] transition-colors duration-300">Topographie</span>
            
            {/* Informations au survol */}
            <div className="absolute inset-0 bg-white bg-opacity-95 p-3 sm:p-4 md:p-6 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-end text-end">
                <p className="text-gray-600 text-xl sm:text-2xl md:text-[40px] mb-2 sm:mb-4 leading-relaxed">
                    01
                </p>
                <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-[#367C55] mb-2 sm:mb-4">Topographie</h3>
                <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4 md:mb-6 leading-relaxed">
                    Levés topographiques précis pour vos projets de construction et d'aménagement.
                </p>
                <button className="bg-[#367C55] text-white px-3 py-1 sm:px-4 sm:py-2 md:px-6 md:py-2 hover:bg-[#2d5f44] transition-colors duration-200 cursor-pointer uppercase text-xs sm:text-sm">
                    Vérifier
                </button>
            </div>
        </div>

        {/* Service 2 - Cadastre */}
        <div className="group relative flex flex-col items-end justify-end w-full h-48 sm:h-72 md:h-80 lg:h-72 gap-2 sm:gap-4 border hover:border-[#367C55] hover:border-2 sm:hover:border-4 lg:hover:border-[8px] p-3 sm:p-4 transition-all duration-300 cursor-pointer">
            <span className="text-8xl sm:text-[120px] md:text-[140px] lg:text-[150px] text-slate-400 group-hover:text-[#367C55] transition-colors duration-300">02</span>
            <span className="text-xs sm:text-sm text-xl sm:text-2xl md:text-[30px] font-bold text-gray-500 group-hover:text-[#367C55] transition-colors duration-300">Cadastre</span>
            
            {/* Informations au survol */}
            <div className="absolute inset-0 bg-white bg-opacity-95 p-3 sm:p-4 md:p-6 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-end text-end">
                <p className="text-gray-600 text-xl sm:text-2xl md:text-[40px] mb-2 sm:mb-4 leading-relaxed">
                    02
                </p>
                <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-[#367C55] mb-2 sm:mb-4">Cadastre</h3>
                <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4 md:mb-6 leading-relaxed">
                    Sécurisation foncière et délivrance de titres de propriété.
                </p>
                <button className="bg-[#367C55] text-white px-3 py-1 sm:px-4 sm:py-2 md:px-6 md:py-2 hover:bg-[#2d5f44] transition-colors duration-200 cursor-pointer uppercase text-xs sm:text-sm">
                    En savoir plus
                </button>
            </div>
        </div>

        {/* Service 3 - Chatbot */}
        <div className="group relative flex flex-col items-end justify-end w-full h-48 sm:h-72 md:h-80 lg:h-72 gap-2 sm:gap-4 border hover:border-[#367C55] hover:border-2 sm:hover:border-4 lg:hover:border-[8px] p-3 sm:p-4 transition-all duration-300 cursor-pointer sm:col-span-2 lg:col-span-1">
            <span className="text-8xl sm:text-[120px] md:text-[140px] lg:text-[150px] text-slate-400 group-hover:text-[#367C55] transition-colors duration-300">03</span>
            <span className="text-xs sm:text-sm text-xl sm:text-2xl md:text-[30px] font-bold text-gray-500 group-hover:text-[#367C55] transition-colors duration-300">Assistant IA</span>
            
            {/* Informations au survol */}
            <div className="absolute inset-0 bg-white bg-opacity-95 p-3 sm:p-4 md:p-6 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-end text-end">
                <p className="text-gray-600 text-xl sm:text-2xl md:text-[40px] mb-2 sm:mb-4 leading-relaxed">
                    03
                </p>
                <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-[#367C55] mb-2 sm:mb-4">Assistant IA</h3>
                <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4 md:mb-6 leading-relaxed">
                    Assistant virtuel intelligent pour répondre à vos questions 24h/24.
                </p>
                <button className="bg-[#367C55] text-white px-3 py-1 sm:px-4 sm:py-2 md:px-6 md:py-2 hover:bg-[#2d5f44] transition-colors duration-200 cursor-pointer uppercase text-xs sm:text-sm">
                    Des questions ?
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}