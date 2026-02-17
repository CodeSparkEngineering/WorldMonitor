import { Github, Instagram, Mail } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export default function Footer() {
    const { t } = useLanguage();

    return (
        <footer className="bg-zinc-900 border-t border-zinc-800 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-1">
                        <a href="/" className="font-mono text-xl tracking-tighter text-white no-underline block mb-6 uppercase">
                            GEO<span className="text-electric-500">NEXUS</span>
                        </a>
                        <p className="text-gray-500 text-sm mb-6 max-w-xs">
                            {t('footer.description')}
                        </p>
                        <div className="flex items-center gap-2 text-xs font-mono text-green-500 bg-green-500/10 px-2 py-1 rounded w-fit border border-green-500/20">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            {t('footer.system_status')}
                        </div>
                    </div>

                    <div>
                        <h4 className="font-mono text-white font-bold mb-6">{t('footer.headers.intelligence')}</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-electric-500 transition-colors no-underline">{t('footer.links.live_map')}</a></li>
                            <li><a href="#" className="hover:text-electric-500 transition-colors no-underline">{t('footer.links.osint')}</a></li>
                            <li><a href="#" className="hover:text-electric-500 transition-colors no-underline">{t('footer.links.satellite')}</a></li>
                            <li><a href="#" className="hover:text-electric-500 transition-colors no-underline">{t('footer.links.conflict')}</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-mono text-white font-bold mb-6">{t('footer.headers.company')}</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><a href="https://codesparkengineering.com/" target="_blank" rel="noopener noreferrer" className="hover:text-electric-500 transition-colors no-underline">{t('footer.links.about')}</a></li>
                            <li><a href="#" className="hover:text-electric-500 transition-colors no-underline">{t('footer.links.methodology')}</a></li>
                            <li><a href="mailto:codespark.dev@proton.me" className="hover:text-electric-500 transition-colors no-underline">{t('footer.links.security')}</a></li>
                            <li><a href="https://wa.me/message/D4VY7QSTGWJXO1" className="hover:text-electric-500 transition-colors no-underline">{t('footer.links.contact')}</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-mono text-white font-bold mb-6">{t('footer.headers.connect')}</h4>
                        <div className="flex gap-4 mb-6">
                            <a href="https://wa.me/message/D4VY7QSTGWJXO1" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-500 transition-colors" title="WhatsApp Contact">
                                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                            </a>
                            <a href="mailto:codespark.dev@proton.me" className="text-gray-400 hover:text-electric-500 transition-colors" title="Email Support"><Mail className="w-5 h-5" /></a>
                            <a href="https://instagram.com/codesparkengineering" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-electric-500 transition-colors" title="Instagram"><Instagram className="w-5 h-5" /></a>
                            <a href="https://github.com/codesparkengineering" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-electric-500 transition-colors" title="GitHub"><Github className="w-5 h-5" /></a>
                        </div>
                        <div className="text-xs text-gray-600 font-mono text-center md:text-left whitespace-pre-line">
                            {t('footer.encrypted')}
                        </div>
                    </div>
                </div>

                <div className="border-t border-zinc-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-gray-600 text-sm">
                        <p>© {new Date().getFullYear()} {t('footer.copyright')}</p>
                        <p className="mt-2 text-xs text-gray-300 font-mono tracking-widest font-bold">
                            {t('footer.designed_by')} <a href="https://codesparkengineering.com/" target="_blank" rel="noopener noreferrer" className="text-electric-400 hover:text-electric-300 no-underline transition-all hover:shadow-[0_0_20px_rgba(0,128,255,0.8)] ml-1">CODESPARK_ENGINEERING</a>
                        </p>
                    </div>
                    <div className="flex gap-6 text-sm text-gray-600">
                        <a href="mailto:codespark.dev@proton.me" className="hover:text-gray-400 transition-colors">{t('footer.links.privacy')}</a>
                        <a href="mailto:codespark.dev@proton.me" className="hover:text-gray-400 transition-colors">{t('footer.links.terms')}</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
