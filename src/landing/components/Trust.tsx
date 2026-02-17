import { motion } from 'framer-motion';

export default function Trust() {
    const brands = [
        "JANE'S INTEL", "STRATFOR", "GEOPOLITICAL FUTURES", "OSINT COMBINE", "BELLINCAT"
    ];

    return (
        <section className="py-12 bg-zinc-950 border-b border-zinc-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <p className="text-sm font-mono text-gray-500 mb-8 uppercase tracking-widest">
                    Trusted by Intelligence Analysts Worldwide
                </p>
                <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale">
                    {brands.map((brand, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="text-xl font-bold text-gray-400 font-mono"
                        >
                            {brand}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
