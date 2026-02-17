
export type Language = 'en' | 'pt' | 'es';

export const translations = {
    en: {
        navbar: {
            intel_feed: "INTEL_FEED",
            live_map: "LIVE_MAP",
            subscription: "SUBSCRIPTION",
            access_terminal: "ACCESS_TERMINAL",
            beta_tag: "v2.2.2"
        },
        hero: {
            system_status: "System_Linked // Secure_Node",
            title_prefix: "GEO",
            title_suffix: "NEXUS",
            subtitle: "STRATEGIC_OSINT",
            description: "The ultimate command center for real-time geopolitical intelligence and strategic situational awareness.",
            cta_primary: "START_MONITORING",
            cta_secondary: "LEARN_MORE",
            scanning_text: "STRATEGIC_SURVEILLANCE_INITIALIZED_001",
            scroll_text: "SCROLL_FOR_INTEL"
        },
        features: {
            section_label: "System Capabilities",
            title_prefix: "INTELLIGENCE",
            title_suffix: "MODULES",
            stats: {
                latency: "LATENCY < 50ms",
                monitoring: "24/7 MONITORING",
                sources: "1M+ SOURCES",
                updates: "LIVE UPDATES",
                resolution: "0.5m RESOLUTION",
                push: "INSTANT PUSH"
            },
            cards: {
                globe: {
                    title: "Global 3D Visualization",
                    desc: "Interactive WebGL globe visualizing real-time geopolitical events, borders, and conflict zones."
                },
                tracking: {
                    title: "Maritime Asset Tracking",
                    desc: "Advanced AIS tracking for naval fleets and commercial shipping in high-risk zones."
                },
                ai: {
                    title: "AI Narrative Detection",
                    desc: "NLP algorithms analyzing millions of sources to detect emerging propaganda and psyops."
                },
                heatmaps: {
                    title: "Conflict Heatmaps",
                    desc: "Thermal overlays showing intensity of improved explosive events and troop movements."
                },
                satellite: {
                    title: "Satellite Imagery Analysis",
                    desc: "Automated change detection in high-resolution satellite feeds for infrastructure monitoring."
                },
                alerts: {
                    title: "Strategic Alerts",
                    desc: "Instant push notifications for critical events affecting your defined assets or regions."
                }
            }
        },
        showcase: {
            title_prefix: "OPERATIONAL",
            title_suffix: "VISIBILITY",
            description: "Gain a strategic advantage with our real-time global intelligence dashboard. Monitor conflicts, assets, and economic shifts from a single command center."
        },
        pricing: {
            label: "Clearance Levels",
            title_prefix: "ACCESS",
            title_suffix: "PROTOCOLS",
            description: "Choose between monthly intelligence access or full system acquisition for sovereign control.",
            monthly: "MONTHLY",
            annual: "ANNUAL",
            save: "-30%",
            tiers: {
                analyst: {
                    name: "ANALYST_ACCESS",
                    desc: "Complete access to the GeoNexus intelligence platform.",
                    period_month: "/MONTH",
                    period_year: "/YEAR",
                    cta: "INITIATE CLEARANCE",
                    features: [
                        "Real-time 3D Globe Visualization",
                        "Live Conflict & Event Alerts",
                        "Maritime & Aerial Asset Tracking",
                        "AI-Driven Narrative Detection",
                        "Satellite Reconnaissance Feeds",
                        "Exportable Intelligence Reports"
                    ]
                },
                system: {
                    name: "SYSTEM_ACQUISITION",
                    price: "CUSTOM",
                    desc: "Purchase the complete source code and infrastructure for your organization.",
                    cta: "CONTACT SALES",
                    features: [
                        "Full Source Code License",
                        "On-Premise / Private Cloud Deployment",
                        "Custom Data Integrations",
                        "White Labeling Options",
                        "Dedicated Engineering Support",
                        "Lifetime Updates"
                    ]
                }
            },
            processing: "PROCESSING..."
        },
        footer: {
            description: "Democratizing high-grade geopolitical intelligence. access the same tools used by defense contractors and hedge funds.",
            system_status: "SYSTEM STATUS: ONLINE",
            headers: {
                intelligence: "INTELLIGENCE",
                company: "COMPANY",
                connect: "CONNECT"
            },
            links: {
                live_map: "Live Map",
                osint: "OSINT Feeds",
                satellite: "Satellite Imagery",
                conflict: "Conflict Reports",
                about: "About Codespark",
                methodology: "Methodology",
                security: "Security",
                contact: "Contact",
                privacy: "Privacy Policy",
                terms: "Terms of Service"
            },
            copyright: "GeoNexus. All Rights Reserved.",
            designed_by: "DESIGNED & DEVELOPED BY",
            encrypted: "ENCRYPTED CONNECTION\n256-BIT AES GLBA"
        },
        marquee: {
            powered_by: "Powered by Real-Time Global Data Feeds",
            types: {
                satellite: "Satellite",
                conflict: "Conflict",
                intelligence: "Intelligence",
                aviation: "Aviation",
                maritime: "Maritime",
                seismic: "Seismic",
                weather: "Weather",
                prediction: "Prediction",
                humanitarian: "Humanitarian",
                internet: "Internet",
                economic: "Economic",
                crypto: "Crypto"
            }
        }
    },
    pt: {
        navbar: {
            intel_feed: "FEED_INTEL",
            live_map: "MAPA_AO_VIVO",
            subscription: "ASSINATURA",
            access_terminal: "ACESSAR_TERMINAL",
            beta_tag: "v2.2.2"
        },
        hero: {
            system_status: "Sistema_Vinculado // Nó_Seguro",
            title_prefix: "GEO",
            title_suffix: "NEXUS",
            subtitle: "OSINT_ESTRATÉGICO",
            description: "O centro de comando definitivo para inteligência geopolítica em tempo real e consciência situacional estratégica.",
            cta_primary: "INICIAR_MONITORAMENTO",
            cta_secondary: "SAIBA_MAIS",
            scanning_text: "VIGILÂNCIA_ESTRATÉGICA_INICIALIZADA_001",
            scroll_text: "ROLE_PARA_INTEL"
        },
        features: {
            section_label: "Capacidades do Sistema",
            title_prefix: "MÓDULOS DE",
            title_suffix: "INTELIGÊNCIA",
            stats: {
                latency: "LATÊNCIA < 50ms",
                monitoring: "MONITORAMENTO 24/7",
                sources: "1M+ FONTES",
                updates: "ATUALIZAÇÕES AO VIVO",
                resolution: "RESOLUÇÃO 0.5m",
                push: "PUSH INSTANTÂNEO"
            },
            cards: {
                globe: {
                    title: "Visualização Global 3D",
                    desc: "Globo WebGL interativo visualizando eventos geopolíticos em tempo real, fronteiras e zonas de conflito."
                },
                tracking: {
                    title: "Rastreamento Marítimo",
                    desc: "Rastreamento AIS avançado para frotas navais e transporte comercial em zonas de alto risco."
                },
                ai: {
                    title: "Detecção Narrativa por IA",
                    desc: "Algoritmos de NLP analisando milhões de fontes para detectar propaganda emergente e operações psicológicas."
                },
                heatmaps: {
                    title: "Mapas de Calor de Conflito",
                    desc: "Sobreposições térmicas mostrando a intensidade de eventos explosivos e movimentos de tropas."
                },
                satellite: {
                    title: "Análise de Imagens de Satélite",
                    desc: "Detecção automática de mudanças em feeds de satélite de alta resolução para monitoramento de infraestrutura."
                },
                alerts: {
                    title: "Alertas Estratégicos",
                    desc: "Notificações push instantâneas para eventos críticos afetando seus ativos ou regiões definidas."
                }
            }
        },
        showcase: {
            title_prefix: "VISIBILIDADE",
            title_suffix: "OPERACIONAL",
            description: "Obtenha vantagem estratégica com nosso painel de inteligência global em tempo real. Monitoree conflitos, ativos e mudanças econômicas em um único centro de comando."
        },
        pricing: {
            label: "Níveis de Acesso",
            title_prefix: "PROTOCOLOS DE",
            title_suffix: "ACESSO",
            description: "Escolha entre acesso mensal de inteligência ou aquisição completa do sistema para controle soberano.",
            monthly: "MENSAL",
            annual: "ANUAL",
            save: "-30%",
            tiers: {
                analyst: {
                    name: "ACESSO_ANALISTA",
                    desc: "Acesso completo à plataforma de inteligência GeoNexus.",
                    period_month: "/MÊS",
                    period_year: "/ANO",
                    cta: "INICIAR CREDENCIAMENTO",
                    features: [
                        "Visualização do Globo 3D em Tempo Real",
                        "Alertas de Conflitos e Eventos ao Vivo",
                        "Rastreamento de Ativos Marítimos e Aéreos",
                        "Detecção de Narrativa Impulsionada por IA",
                        "Feeds de Reconhecimento por Satélite",
                        "Relatórios de Inteligência Exportáveis"
                    ]
                },
                system: {
                    name: "AQUISIÇÃO_SISTEMA",
                    price: "SOB MEDIDA",
                    desc: "Adquira o código-fonte completo e a infraestrutura para sua organização.",
                    cta: "CONTATAR VENDAS",
                    features: [
                        "Licença Completa do Código-Fonte",
                        "Implantação On-Premise / Nuvem Privada",
                        "Integrações de Dados Personalizadas",
                        "Opções de White Label",
                        "Suporte de Engenharia Dedicado",
                        "Atualizações Vitalícias"
                    ]
                }
            },
            processing: "PROCESSANDO..."
        },
        footer: {
            description: "Democratizando a inteligência geopolítica de alto nível. Acesse as mesmas ferramentas usadas por empreiteiros de defesa e fundos de hedge.",
            system_status: "STATUS DO SISTEMA: ONLINE",
            headers: {
                intelligence: "INTELIGÊNCIA",
                company: "EMPRESA",
                connect: "CONECTAR"
            },
            links: {
                live_map: "Mapa ao Vivo",
                osint: "Feeds OSINT",
                satellite: "Imagens de Satélite",
                conflict: "Relatórios de Conflito",
                about: "Sobre a Codespark",
                methodology: "Metodologia",
                security: "Segurança",
                contact: "Contato",
                privacy: "Política de Privacidade",
                terms: "Termos de Serviço"
            },
            copyright: "GeoNexus. Todos os Direitos Reservados.",
            designed_by: "PROJETADO & DESENVOLVIDO POR",
            encrypted: "CONEXÃO CRIPTOGRAFADA\nAES 256-BIT GLBA"
        },
        marquee: {
            powered_by: "Alimentado por Feeds de Dados Globais em Tempo Real",
            types: {
                satellite: "Satélite",
                conflict: "Conflito",
                intelligence: "Inteligência",
                aviation: "Aviação",
                maritime: "Marítimo",
                seismic: "Sísmico",
                weather: "Clima",
                prediction: "Predição",
                humanitarian: "Humanitário",
                internet: "Internet",
                economic: "Econômico",
                crypto: "Cripto"
            }
        }
    },
    es: {
        navbar: {
            intel_feed: "FEED_INTEL",
            live_map: "MAPA_EN_VIVO",
            subscription: "SUSCRIPCIÓN",
            access_terminal: "ACCEDER_TERMINAL",
            beta_tag: "v2.2.2"
        },
        hero: {
            system_status: "Sistema_Vinculado // Nodo_Seguro",
            title_prefix: "GEO",
            title_suffix: "NEXUS",
            subtitle: "OSINT_ESTRATÉGICO",
            description: "El centro de comando definitivo para inteligencia geopolítica en tiempo real y conciencia situacional estratégica.",
            cta_primary: "INICIAR_MONITOREO",
            cta_secondary: "SABER_MÁS",
            scanning_text: "VIGILANCIA_ESTRATÉGICA_INICIALIZADA_001",
            scroll_text: "DESPLAZAR_PARA_INTEL"
        },
        features: {
            section_label: "Capacidades del Sistema",
            title_prefix: "MÓDULOS DE",
            title_suffix: "INTELIGENCIA",
            stats: {
                latency: "LATENCIA < 50ms",
                monitoring: "MONITOREO 24/7",
                sources: "1M+ FUENTES",
                updates: "ACTUALIZACIONES EN VIVO",
                resolution: "RESOLUCIÓN 0.5m",
                push: "PUSH INSTANTÁNEO"
            },
            cards: {
                globe: {
                    title: "Visualización Global 3D",
                    desc: "Globo WebGL interactivo que visualiza eventos geopolíticos en tiempo real, fronteras y zonas de conflicto."
                },
                tracking: {
                    title: "Rastreo Marítimo",
                    desc: "Rastreo AIS avanzado para flotas navales y transporte comercial en zonas de alto riesgo."
                },
                ai: {
                    title: "Detección Narrativa por IA",
                    desc: "Algoritmos de NLP que analizan millones de fuentes para detectar propaganda emergente y operaciones psicológicas."
                },
                heatmaps: {
                    title: "Mapas de Calor de Conflicto",
                    desc: "Superposiciones térmicas que muestran la intensidad de eventos explosivos y movimientos de tropas."
                },
                satellite: {
                    title: "Análisis de Imágenes de Satélite",
                    desc: "Detección automática de cambios en feeds de satélite de alta resolución para monitoreo de infraestructura."
                },
                alerts: {
                    title: "Alertas Estratégicas",
                    desc: "Notificaciones push instantáneas para eventos críticos que afectan sus activos o regiones definidas."
                }
            }
        },
        showcase: {
            title_prefix: "VISIBILIDAD",
            title_suffix: "OPERACIONAL",
            description: "Obtenga una ventaja estratégica con nuestro panel de inteligencia global en tiempo real. Monitoree conflictos, activos y cambios económicos desde un solo centro de comando."
        },
        pricing: {
            label: "Niveles de Acceso",
            title_prefix: "PROTOCOLOS DE",
            title_suffix: "ACCESO",
            description: "Elija entre acceso mensual de inteligencia o adquisición completa del sistema para control soberano.",
            monthly: "MENSUAL",
            annual: "ANUAL",
            save: "-30%",
            tiers: {
                analyst: {
                    name: "ACCESO_ANALISTA",
                    desc: "Acceso completo a la plataforma de inteligencia GeoNexus.",
                    period_month: "/MES",
                    period_year: "/AÑO",
                    cta: "INICIAR CREDENCIALES",
                    features: [
                        "Visualización del Globo 3D en Tiempo Real",
                        "Alertas de Conflictos y Eventos en Vivo",
                        "Rastreo de Activos Marítimos y Aéreos",
                        "Detección de Narrativa Impulsada por IA",
                        "Feeds de Reconocimiento por Satélite",
                        "Informes de Inteligencia Exportables"
                    ]
                },
                system: {
                    name: "ADQUISICIÓN_SISTEMA",
                    price: "A MEDIDA",
                    desc: "Adquiera el código fuente completo y la infraestructura para su organización.",
                    cta: "CONTACTAR VENTAS",
                    features: [
                        "Licencia Completa del Código Fuente",
                        "Implementación On-Premise / Nube Privada",
                        "Integraciones de Datos Personalizadas",
                        "Opciones de Marca Blanca",
                        "Soporte de Ingeniería Dedicado",
                        "Actualizaciones de por Vida"
                    ]
                }
            },
            processing: "PROCESANDO..."
        },
        footer: {
            description: "Democratizando la inteligencia geopolítica de alto nivel. Acceda a las mismas herramientas utilizadas por contratistas de defensa y fondos de cobertura.",
            system_status: "ESTADO DEL SISTEMA: EN LÍNEA",
            headers: {
                intelligence: "INTELIGENCIA",
                company: "EMPRESA",
                connect: "CONECTAR"
            },
            links: {
                live_map: "Mapa en Vivo",
                osint: "Feeds OSINT",
                satellite: "Imágenes de Satélite",
                conflict: "Informes de Conflicto",
                about: "Sobre Codespark",
                methodology: "Metodología",
                security: "Seguridad",
                contact: "Contacto",
                privacy: "Política de Privacidad",
                terms: "Términos de Servicio"
            },
            copyright: "GeoNexus. Todos los Derechos Reservados.",
            designed_by: "DISEÑADO & DESARROLLADO POR",
            encrypted: "CONEXIÓN ENCRIPTADA\nAES 256-BIT GLBA"
        },
        marquee: {
            powered_by: "Impulsado por Feeds de Datos Globales en Tiempo Real",
            types: {
                satellite: "Satélite",
                conflict: "Conflicto",
                intelligence: "Inteligencia",
                aviation: "Aviación",
                maritime: "Marítimo",
                seismic: "Sísmico",
                weather: "Clima",
                prediction: "Predicción",
                humanitarian: "Humanitario",
                internet: "Internet",
                economic: "Económico",
                crypto: "Cripto"
            }
        }
    }
};
