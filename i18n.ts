
import { Language } from './types';

export const translations = {
  es: {
    appTitle: "MemoriaViva",
    appSubtitle: "Investigador de Memoria Histórica Española",
    helpButton: "Ayuda",
    helpCenter: "Centro de Ayuda y Fuentes",
    aboutProject: "Sobre el Proyecto",
    guideTitle: "Guía de Investigación",
    guideSubtitle: "Manual de Usuario y Fuentes Documentales",
    closeGuide: "Entendido, Cerrar Guía",
    closeAbout: "Volver a la Búsqueda",
    newSearch: "Nueva Investigación",
    recentSearchesTitle: "Búsquedas Recientes",
    noRecentSearches: "No hay búsquedas recientes",
    stopSearch: "Detener Búsqueda",
    noResultsFound: "No se han encontrado registros específicos coincidentes. Consulte el análisis histórico superior para más contexto.",
    loadingMessages: [
      "Rastreando archivos históricos...",
      "Localizando signaturas oficiales...",
      "Cotejando registros de registros...",
      "Extrayendo guías de búsqueda manual...",
      "Analizando fondos documentales..."
    ],
    resetConfirm: {
      title: "¿Nueva Investigación?",
      message: "Se borrarán todos los resultados actuales y parámetros de búsqueda. Esta acción no se puede deshacer.",
      cancel: "Cancelar",
      confirm: "Sí, limpiar todo"
    },
    about: {
      title: "Misión y Metodología",
      missionTitle: "Nuestra Misión",
      missionText: "MemoriaViva nace del compromiso con el derecho a la verdad. Nuestra misión es facilitar a familiares, historiadores y ciudadanos la localización de seres queridos y víctimas de la Guerra Civil y la Dictadura Franquista, transformando la fragmentación de los archivos en un acceso unificado y digno.",
      methodologyTitle: "Metodología de Investigación",
      methodologyText: "Utilizamos algoritmos de procesamiento de lenguaje natural (IA) para indexar y cruzar datos procedentes de los principales fondos documentales públicos digitalizados (PARES, CDMH, Archivos Militares, Fosas Comunes y Cementerios). El sistema genera hipótesis de búsqueda que deben ser siempre contrastadas con la signatura física proporcionada.",
      importanceTitle: "La Importancia de Recordar",
      importanceText: "España cuenta con miles de desaparecidos en fosas comunes y expedientes silenciados. La investigación histórica no es un acto de revisión, sino de justicia transicional. Conocer el destino de quienes nos precedieron es fundamental para la salud democrática de nuestra sociedad y la reparación moral de las familias."
    },
    searchForm: {
      firstName: "Nombre (Opcional)",
      lastName1: "Primer Apellido",
      lastName2: "Segundo Apellido (Opcional)",
      militaryServiceNumber: "Nº Expediente / Chapa (Opcional)",
      fuzzyLabel: "Búsqueda Flexible (Fuzzy)",
      exactLabel: "Búsqueda Exacta",
      save: "Guardar",
      clear: "Limpiar",
      investigate: "Investigar",
      consulting: "Consultando..."
    },
    results: {
      statsTitle: "Desglose de Hallazgos",
      analysisTitle: "Análisis de la Investigación",
      historicalNote: "Nota Histórica",
      exploreSources: "Explorar Fuentes",
      mapTitle: "Cartografía de Incidencias Verificadas",
      militaryCasualties: "Bajas Militares Detectadas",
      casualtySubtitle: "Registros de Defunción o Desaparición en Combate",
      identifiedRecords: "Registros Identificados",
      locationFilterLabel: "Filtrar por Ubicación",
      locationFilterPlaceholder: "Ciudad, provincia...",
      rankFilterLabel: "Filtrar por Rango",
      rankFilterPlaceholder: "Soldado, Cabo...",
      share: "Compartir",
      shareOptions: {
        copyText: "Copiar Ficha (Texto)",
        email: "Enviar por Email",
        whatsapp: "Enviar por WhatsApp",
        download: "Descargar Ficha (.txt)"
      },
      copied: "¡Copiado!",
      battleDetails: "Detalles Combate",
      unitDetailsTitle: "Identificación de Unidad",
      searchBattleDetails: "Investigar acción en Wikipedia",
      searchUnitDetails: "Investigar unidad en Wikipedia",
      searchGoogle: "Buscar en Google",
      repressionMethods: "Formas de Represión",
      location: "Localización",
      date: "Fecha",
      combatTooltipTitle: "Hoja de Servicio / Combate",
      repressionTooltipTitle: "Naturaleza de la Represión",
      unitLabel: "Unidad / Cuerpo",
      rankLabel: "Rango / Grado",
      originLabel: "Procedencia",
      birthPlaceLabel: "Lugar de Nacimiento",
      statusLabel: "Estado Mil.",
      dataNotAvailable: "Dato no disponible en la fuente",
      archiveNote: "Coteje con la signatura para historial de servicios.",
      ephemeralWarning: "Enlace inestable. Use la Signatura si el link falla.",
      noUnit: "No especificada",
      noRank: "Sin graduación conocida",
      noOrigin: "Desconocida",
      downloadFicha: "Descargar Ficha (.txt)",
      downloadSources: "Descargar Fuentes (TXT)",
      repressionInfo: "La represión se articuló como una herramienta sistemática de control social y político, manifestándose tanto en la retaguardia durante el conflicto como de forma institucionalizada en la posguerra.",
      repressionContexts: {
        extrajudicial: "Los 'paseos' y sacas consistían en ejecuciones arbitrarias sin juicio previo, a menudo al amanecer en cunetas o tapias de cementerios.",
        judicial: "Consejos de Guerra sumadísimos bajo la jurisdicción militar, basados frecuentemente en denuncias sin pruebas tangibles.",
        concentration: "Campos de concentración y batallones disciplinarios de soldados trabajadores para la reconstrucción forzosa de infraestructuras.",
        social: "La depuración profesional, la incautación de bienes y el 'exilio interior' marcaron el destino de miles de familias supervivientes."
      },
      militaryContexts: {
        'Madrid': "La defensa de Madrid se convirtió en una guerra de posiciones urbana y de trincheras en la Sierra, marcada por el lema 'No pasarán' y la llegada de las Brigadas Internacionales.",
        'Ebridge': "La Batalla del Ebro fue la mayor operación militar del conflicto, una guerra de desgaste tras el cruce masivo del río que duró 115 días bajo fuego de artillería constante.",
        'Teruel': "La Batalla de Teruel se libró bajo condiciones climáticas extremas de hasta -20ºC, caracterizándose por combates casa por casa y múltiples cambios de control de la ciudad.",
        'Jarama': "El Jarama fue escenario de una de las batallas más crentas, donde se intentó cortar la comunicación de Madrid, resultando en un estancamiento del frente tras choques frentales masivos.",
        'Brunete': "Brunete fue una offensiva de distracción republicana que degeneró en una batalla de tanques y aviación de gran escala bajo un calor sofocante en la llanura madrileña.",
        'Norte': "La campaña del Norte implicó la ruptura del 'Cinturón de Hierro' de Bilbao y una guerra de columnas en Asturias y Santander, culminando en la caída del frente cantábrico.",
        'Aragón': "El frente de Aragón alternó periodos de estabilización con grandes ofensivas como la de Belchite, caracterizada por la toma estratégica de pueblos fortificados.",
        'Guadalajara': "La batalla de Guadalajara es recordada por la derrota del cuerpo expedicionario italiano (CTV) ante las fuerzas republicanas en un entorno de barro y lluvia intensa."
      }
    },
    helpModal: {
      instructionsTitle: "¿Cómo usar la aplicación?",
      instructions1: "Introduzca el nombre y apellidos de la persona. El primer apellido es obligatorio.",
      instructions2: "Use el Número de Expediente o Chapa Militar si lo conoce para resultados precisos.",
      instructions3: "La 'Búsqueda Flexible' ayuda a encontrar registros con variaciones ortográficas comunes en la época.",
      sourcesTitle: "Fuentes Consultadas",
      sourcesText: "Esta herramienta consulta y cruza datos de los siguientes organismos oficiales y bases de datos históricas:",
      sourcesList: [
        "PARES: Portal de Archivos Españoles.",
        "CDMH: Centro Documental de la Memoria Histórica.",
        "AGM: Archivos Generales Militares y Diarios Oficiales.",
        "Mapa de Fosas y Registros de Cementerios Municipales.",
        "Combatientes.es: Militares republicanos y nacionales.",
        "Portal de Víctimas de la Guerra Civil y el Franquismo."
      ]
    },
    report: {
      finishTitle: "Exportar Investigación Completa",
      downloadFullTxt: "Descargar Informe (.txt)",
      copyText: "Copiar Informe Completo",
      shareReport: "Compartir Investigación",
      shareOptions: {
        whatsapp: "WhatsApp (Resumen)",
        email: "Email (Informe Completo)",
        copy: "Copiar Texto"
      },
      instructions: "El formato .TXT es el estándar de exportación de MemoriaViva. Contiene todos los detalles históricos, enlaces y signaturas oficiales.",
      headerSubtitle: "Investigación Documental Histórica",
      section1: "I. Datos de la Investigación",
      section2: "II. Evidencias y Signaturas de Archivo",
      footer: "MemoriaViva • Informe de Reconciliación Histórica • Documento no vinculante"
    },
    disclaimer: {
      title: "Manual de Investigación y Aviso Legal",
      veracityTitle: "Sobre la veracidad de los datos:",
      veracityText: "Los resultados mostrados han sido localizados mediante técnicas de inteligencia sobre fondos públicos digitalizados. Se recomienda encarecidamente cotejar la Signatura proporcionada con el archivo físico para trámites legales oficiales.",
      archivesTitle: "Cómo localizar el expediente físico:",
      archivesText: "Use la signatura ID para búsquedas en PARES o el Portal de Archivos de Defensa. Si un enlace externo da error, introduzca la signatura manualmente en el buscador raíz del archivo oficial."
    }
  },
  en: {
    appTitle: "MemoriaViva",
    appSubtitle: "Spanish Historical Memory Researcher",
    helpButton: "Help",
    helpCenter: "Help Center & Sources",
    aboutProject: "About the Project",
    guideTitle: "Research Guide",
    guideSubtitle: "User Manual & Documentary Sources",
    closeGuide: "Got it, Close Guide",
    closeAbout: "Back to Search",
    newSearch: "New Investigation",
    recentSearchesTitle: "Recent Searches",
    noRecentSearches: "No recent searches",
    stopSearch: "Stop Search",
    noResultsFound: "No specific matching records were found. Please refer to the historical analysis above for more context.",
    loadingMessages: [
      "Tracing historical archives...",
      "Locating official signatures...",
      "Cross-referencing record logs...",
      "Extracting manual search guides...",
      "Analyzing documentary collections..."
    ],
    resetConfirm: {
      title: "New Investigation?",
      message: "All current results and search parameters will be cleared. This action cannot be undone.",
      cancel: "Cancel",
      confirm: "Yes, clear all"
    },
    about: {
      title: "Mission and Methodology",
      missionTitle: "Our Mission",
      missionText: "MemoriaViva was born from a commitment to the right to the truth. Our mission is to assist families, historians, and citizens in locating loved ones and victims of the Civil War and the Francoist Dictatorship, transforming fragmented archives into a unified and dignified access point.",
      methodologyTitle: "Research Methodology",
      methodologyText: "We utilize natural language processing (AI) algorithms to index and cross-reference data from digitized public collections (PARES, CDMH, Military Archives, Mass Graves, and Cemetery Records). The system generates search hypotheses that must be contrasted with the provided physical signatures.",
      importanceTitle: "The Importance of Remembering",
      importanceText: "Spain has thousands of missing persons in mass graves. Historical research is not an act of revisionism, but of transitional justice. Knowing the fate of those who preceded us is fundamental for democratic health and family moral reparation.",
    },
    searchForm: {
      firstName: "First Name (Optional)",
      lastName1: "First Surname",
      lastName2: "Second Surname (Optional)",
      militaryServiceNumber: "Military Service ID (Optional)",
      fuzzyLabel: "Flexible Search (Fuzzy)",
      exactLabel: "Exact Match",
      save: "Save",
      clear: "Clear",
      investigate: "Investigate",
      consulting: "Consulting..."
    },
    results: {
      statsTitle: "Findings Breakdown",
      analysisTitle: "Investigation Analysis",
      historicalNote: "Historical Note",
      exploreSources: "Explore Sources",
      mapTitle: "Verified Incidents Mapping",
      militaryCasualties: "Detected Military Casualties",
      casualtySubtitle: "Records of Death or Disappearance in Combat",
      identifiedRecords: "Identified Records",
      locationFilterLabel: "Filter by Location",
      locationFilterPlaceholder: "City, province...",
      rankFilterLabel: "Filter by Rank",
      rankFilterPlaceholder: "Private, Corporal...",
      share: "Share",
      shareOptions: {
        copyText: "Copy Record (Text)",
        email: "Send via Email",
        whatsapp: "Send via WhatsApp",
        download: "Download Record (.txt)"
      },
      copied: "Copied!",
      battleDetails: "Combat Details",
      unitDetailsTitle: "Unit Identification",
      searchBattleDetails: "Search action on Wikipedia",
      searchUnitDetails: "Search unit on Wikipedia",
      searchGoogle: "Search on Google",
      repressionMethods: "Forms of Repression",
      location: "Location",
      date: "Date",
      combatTooltipTitle: "Service Record / Combat",
      repressionTooltipTitle: "Nature of Repression",
      unitLabel: "Unit / Corps",
      rankLabel: "Rank / Grade",
      originLabel: "Origin",
      birthPlaceLabel: "Birth Place",
      statusLabel: "Mil. Status",
      dataNotAvailable: "Data not available in the source",
      archiveNote: "Cross-check with signature for service history.",
      ephemeralWarning: "Unstable link. Use Signature if link fails.",
      noUnit: "Not specified",
      noRank: "No known rank",
      noOrigin: "Unknown",
      downloadFicha: "Download Record (.txt)",
      downloadSources: "Download Sources (TXT)",
      repressionInfo: "Repression was articulated as a tool for social control, both in the rearguard and institutionalized in the post-war period.",
      repressionContexts: {
        extrajudicial: "Extrajudicial executions without trial, often at dawn on roadsides.",
        judicial: "Summary Courts-Martial under military jurisdiction.",
        concentration: "Concentration camps and disciplinary battalions.",
        social: "Purging and asset seizure."
      },
      militaryContexts: {
        'Madrid': "Urban and trench war of positions in the Sierra.",
        'Ebro': "Largest operation of the conflict, war of attrition.",
        'Teruel': "Fought under extreme weather conditions of up to -20ºC.",
        'Jarama': "Scene of one of the bloodiest battles.",
        'Brunete': "Republican diversionary offensive.",
        'Norte': "Breaking of Bilbao's 'Iron Belt'.",
        'Aragón': "Belchite and major strategic offensives.",
        'Guadalajara': "Defeat of the Italian CTV."
      }
    },
    helpModal: {
      instructionsTitle: "How to use the application?",
      instructions1: "Enter the person's name and surnames.",
      instructions2: "Use the Military ID if known for precision.",
      instructions3: "Flexible search helps with historical spelling variations.",
      sourcesTitle: "Consulted Sources",
      sourcesText: "Cross-references data from several official archives:",
      sourcesList: [
        "PARES: Spanish Archives Portal.",
        "CDMH: Documentary Center of Historical Memory.",
        "AGM: Military Archives and Gazettes.",
        "Mass Grave Mapping and Cemetery Records.",
        "Combatientes.es and Victims Portal."
      ]
    },
    report: {
      finishTitle: "Export Full Investigation",
      downloadFullTxt: "Download Report (.txt)",
      copyText: "Copy Full Report",
      shareReport: "Share Investigation",
      shareOptions: {
        whatsapp: "WhatsApp (Summary)",
        email: "Email (Full Report)",
        copy: "Copy Text"
      },
      instructions: ".TXT is the standard export format. It includes all details, links, and official signatures.",
      headerSubtitle: "Historical Documentary Research",
      section1: "I. Investigation Data",
      section2: "II. Evidences & Archive Signatures",
      footer: "MemoriaViva • Historical Reconciliation Report"
    },
    disclaimer: {
      title: "Manual & Legal Notice",
      veracityTitle: "Data Accuracy:",
      veracityText: "Located through AI on public digitized files. Always cross-check with physical archives.",
      archivesTitle: "Locating physical records:",
      archivesText: "Use ID signature in official search engines if links fails."
    }
  }
};
