import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Game.css';

interface ArtifactData {
  id: number;
  name: string;
  emoji: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  basePoints: number;
  facts: {
    origin: string;
    siteImpact: string;
    culturalSignificance: string;
    historicalPeriod: string;
    additionalFact: string;
  };
}

interface Card {
  id: number;
  artifactId: number;
  isFlipped: boolean;
  isMatched: boolean;
}

interface GameLevel {
  level: number;
  pairs: number;
  artifacts: ArtifactData[];
}

interface SiteIntegrityQuestion {
  id: number;
  question: string;
  scenario: string;
  options: {
    text: string;
    correct: boolean;
    explanation: string;
  }[];
}

interface SiteIntegrityLevel {
  level: number;
  questions: SiteIntegrityQuestion[];
  topic: string;
}

const artifactDatabase: Record<number, ArtifactData> = {
  1: {
    id: 1,
    name: 'Well-Preserved Pottery in Stable Soil',
    emoji: '🏺',
    rarity: 'common',
    basePoints: 10,
    facts: {
      origin: 'Neolithic pottery from Mesopotamia around 7000 BCE buried in stable clay-rich soil',
      siteImpact: 'Demonstrates excellent site integrity - physical geology of stable clay soil prevents ceramic degradation and maintains stratigraphy over millennia',
      culturalSignificance: 'Pottery vessels reveal daily life and settlement patterns when preserved in good site integrity conditions',
      historicalPeriod: 'Neolithic Age (10,000 - 3000 BCE)',
      additionalFact: 'Physical geology factor: Clay-based soils with neutral pH maintain site integrity by preventing ceramic cracking and chemical weathering of pottery'
    }
  },
  2: {
    id: 2,
    name: 'Flint Tool (Weathered Surface)',
    emoji: '🔨',
    rarity: 'common',
    basePoints: 15,
    facts: {
      origin: 'Paleolithic flint tool approximately 2.6 million years old exposed to surface weathering',
      siteImpact: 'Shows poor site integrity - exposed to environmental geology (rain, wind, freeze-thaw cycles) causing physical weathering and surface alteration',
      culturalSignificance: 'Stone tools survive better than organic materials but surface exposure damages fine details needed for cultural analysis',
      historicalPeriod: 'Paleolithic Age (2.6 million - 10,000 years ago)',
      additionalFact: 'Environmental geology factor: Exposure to weathering processes (oxidation, hydration, micro-fracturing) reduces site integrity and damages archaeological information'
    }
  },
  3: {
    id: 3,
    name: 'Bone Harpoon (Waterlogged Deposit)',
    emoji: '🦴',
    rarity: 'uncommon',
    basePoints: 25,
    facts: {
      origin: 'Upper Paleolithic bone harpoon preserved in waterlogged archaeological deposit for 40,000 years',
      siteImpact: 'Exceptional site integrity maintained by anaerobic (oxygen-free) environmental geology - wet conditions prevent bacterial decomposition of bone',
      culturalSignificance: 'Waterlogged sites preserve organic materials impossible to find in dry contexts, revealing complete hunting tools and wood artifacts',
      historicalPeriod: 'Upper Paleolithic (40,000 - 10,000 years ago)',
      additionalFact: 'Environmental geology factor: Anoxic waterlogged environments create ideal preservation by preventing aerobic decay - excellent site integrity from stable hydrology'
    }
  },
  4: {
    id: 4,
    name: 'Copper Furnace Slag',
    emoji: '⚔️',
    rarity: 'uncommon',
    basePoints: 30,
    facts: {
      origin: 'Metallurgical slag from Anatolian copper furnaces around 6000 BCE showing early smelting technology',
      siteImpact: 'Industrial by-products preserve site integrity and historical geology context - slag layers create distinct stratigraphic markers for chronological dating',
      culturalSignificance: 'Evidence of technological innovation and transition from Stone Age to Metal Ages in human history',
      historicalPeriod: 'Chalcolithic (Copper-Stone Age) - Bronze Age (5000 - 1000 BCE)',
      additionalFact: 'Historical geology factor: Slag accumulations establish temporal sequences and reveal ore sources through chemical analysis, maintaining site integrity through distinctive layers'
    }
  },
  5: {
    id: 5,
    name: 'Jade Figurine (Minerologically Stable)',
    emoji: '💚',
    rarity: 'rare',
    basePoints: 50,
    facts: {
      origin: 'Jade (mineral silicate) carved figurine from Neolithic China around 5000 BCE with exceptional hardness',
      siteImpact: 'Demonstrates excellent site integrity - mineral properties of jade resist weathering, hydration, and chemical alteration over 7,000 years',
      culturalSignificance: 'Jade\'s rarity, hardness, and resistance to degradation made it spiritually valuable and ensured preservation of carved details and artistic information',
      historicalPeriod: 'Neolithic China (8000 - 2000 BCE)',
      additionalFact: 'Physical geology factor: Crystalline mineral structure of jade resists environmental weathering - monocrystalline silicate properties maintain site integrity and artifact clarity'
    }
  },
  6: {
    id: 6,
    name: 'Cuneiform Clay Tablet (Fired)',
    emoji: '📋',
    rarity: 'uncommon',
    basePoints: 35,
    facts: {
      origin: 'Fired clay tablet from Mesopotamia around 3200 BCE - intentional or accidental heat hardening dramatically improved preservation',
      siteImpact: 'Physical geology of fired clay creates durable ceramic material maintaining excellent site integrity; clay minerals undergo phase changes when heated, improving durability',
      culturalSignificance: 'Writing system invented by Sumerians - clay tablets preserve direct textual evidence of administration, laws, and beliefs',
      historicalPeriod: 'Bronze Age Mesopotamia (3200 BCE onwards)',
      additionalFact: 'Physical geology factor: Firing reorganizes clay minerals (dehydration of clay minerals) creating stronger ceramic structure with superior site integrity and resistance to decay'
    }
  },
  7: {
    id: 7,
    name: 'Sealed Royal Tomb (Valley of Kings)',
    emoji: '👑',
    rarity: 'rare',
    basePoints: 75,
    facts: {
      origin: 'Sealed royal tomb from Valley of the Kings, Egypt around 1300 BCE - geological formation in stable limestone bedrock',
      siteImpact: 'Exceptional site integrity maintained by: stable bedrock geology (limestone), sealed chamber environment, arid climate, and absence of groundwater disturbance',
      culturalSignificance: 'Sealed tombs preserve complete artifact assemblages, mummified remains, and textiles - demonstrating beliefs in afterlife and royal authority',
      historicalPeriod: 'New Kingdom Egypt (1550 - 1070 BCE)',
      additionalFact: 'Environmental and physical geology factors: Desert climate (dry), limestone bedrock (chemically stable), sealed chamber (anaerobic) combine to preserve site integrity for 3,300+ years'
    }
  },
  8: {
    id: 8,
    name: 'Preserved Papyrus in Dry Climate',
    emoji: '📜',
    rarity: 'rare',
    basePoints: 60,
    facts: {
      origin: 'Organic papyrus documents preserved in the arid Egyptian desert for over 3,000 years',
      siteImpact: 'Demonstrates excellent site integrity maintained by dry environmental geology - low moisture prevents decomposition of organic materials',
      culturalSignificance: 'Direct textual evidence of ancient laws, literature, and daily life preserved through favorable environmental geological conditions',
      historicalPeriod: 'Ancient Egypt (3000 - 300 BCE)',
      additionalFact: 'Environmental geology factor: Arid desert climate (low humidity, stable temperature) provides optimal conditions for organic preservation, ensuring site integrity'
    }
  },
  9: {
    id: 9,
    name: 'Waterlogged Bog Body',
    emoji: '🔮',
    rarity: 'legendary',
    basePoints: 100,
    facts: {
      origin: 'Exceptionally preserved human remains found in peat bogs of Northern Europe dated 2000+ years old',
      siteImpact: 'Peat bog environment provides anaerobic (oxygen-free) conditions from environmental geology - demonstrates exceptional site integrity with preservation of skin, organs, and stomach contents intact',
      culturalSignificance: 'Reveals details of ancient diet, clothing, and life circumstances impossible to obtain from skeletal remains alone',
      historicalPeriod: 'Iron Age to Roman Period (500 BCE - 500 CE)',
      additionalFact: 'Environmental geology: Acidic peat with anoxic conditions creates ideal preservation; site integrity maintained by stable groundwater and geological layering preventing microbial decay'
    }
  }
};

const Game: React.FC = () => {
  const { user, updateUserScore, addScoreToLeaderboard } = useAuth();
  const navigate = useNavigate();

  const [gameState, setGameState] = useState<'levelSelect' | 'playing' | 'levelComplete' | 'finished'>('levelSelect');
  const [cards, setCards] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [currentLevel, setCurrentLevel] = useState<number>(0);
  const [matchedArtifact, setMatchedArtifact] = useState<ArtifactData | null>(null);
  const [showFacts, setShowFacts] = useState(false);
  const [selectedGame, setSelectedGame] = useState<'memory' | 'siteIntegrity' | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<{ questionId: number; correct: boolean }[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  // Site Integrity Questions Database
  const siteIntegrityQuestions: Record<number, SiteIntegrityLevel> = {
    1: {
      level: 1,
      topic: 'Site Preservation Basics',
      questions: [
        {
          id: 1,
          question: 'Environmental Protection',
          scenario: 'You discover an ancient pottery vessel buried in wet clay. Why is this an excellent site integrity situation?',
          options: [
            {
              text: 'The wet clay seals the artifact from oxygen and moisture',
              correct: false,
              explanation: 'While the artifact is sealed, clay doesn\'t prevent all moisture. The key is the ANAEROBIC environment that prevents bacterial decay.'
            },
            {
              text: 'The anaerobic (oxygen-free) environment prevents bacterial decomposition and decay',
              correct: true,
              explanation: 'Correct! Waterlogged and anaerobic conditions are ideal for preservation because they prevent the aerobic bacteria that cause decay.'
            },
            {
              text: 'The pottery is too hard to be damaged by water',
              correct: false,
              explanation: 'Pottery CAN be damaged by water. The real benefit is the chemical environment it creates, not the hardness of the material.'
            },
            {
              text: 'Clay always preserves artifacts perfectly',
              correct: false,
              explanation: 'Not all clay is equally protective. The preservation depends on the pH level, moisture content, and presence or absence of oxygen.'
            }
          ]
        },
        {
          id: 2,
          question: 'Climate Effects on Site Integrity',
          scenario: 'A dig site in Egypt has preserved organic materials (papyrus, cloth) for 3,000 years. What climate factor is most responsible?',
          options: [
            {
              text: 'High temperature kills all bacteria',
              correct: false,
              explanation: 'Temperature alone doesn\'t destroy bacteria completely. The key factor in Egyptian preservation is the low moisture content.'
            },
            {
              text: 'Desert sand is a natural preservative',
              correct: false,
              explanation: 'Sand itself isn\'t preservative. The preservation comes from the climate conditions the sand creates.'
            },
            {
              text: 'The arid climate with low humidity prevents bacterial decomposition',
              correct: true,
              explanation: 'Excellent! Arid climates with very low humidity (the Egyptian desert averages <3% humidity in some areas) prevent the moisture bacteria need to decompose organic materials.'
            },
            {
              text: 'The sand blocks all light and oxygen',
              correct: false,
              explanation: 'Light and oxygen blockage help preservation, but the REAL key is the low moisture that prevents bacterial growth.'
            }
          ]
        },
        {
          id: 3,
          question: 'Soil Stability',
          scenario: 'A stone artifact buried in stable clay-based soil shows excellent preservation. An identical artifact in sandy, shifting soil is severely damaged. Why?',
          options: [
            {
              text: 'Clay is harder than sand, so it protects better',
              correct: false,
              explanation: 'The hardness of soil material isn\'t the key factor. It\'s about soil stability and chemical properties.'
            },
            {
              text: 'Stable, cohesive clay prevents physical disturbance and maintains stratigraphic context',
              correct: true,
              explanation: 'Perfect! Stable clay maintains artifact position and prevents the physical damage from soil movement and compression that occurs in sandy soils.'
            },
            {
              text: 'Sand doesn\'t preserve anything while clay always preserves everything',
              correct: false,
              explanation: 'This is too absolute. Some sandy soils can preserve artifacts, though stable clay is generally better. The key is soil behavior, not material type alone.'
            },
            {
              text: 'Clay has magical preservative properties',
              correct: false,
              explanation: 'While clay is excellent for preservation, it works through geological and chemical principles, not magic! Specifically: pH buffering, permeability, and structural stability.'
            }
          ]
        },
        {
          id: 4,
          question: 'Exposure and Weathering',
          scenario: 'Two flint tools from the same era: one recovered from deep subsurface, one from the surface. The subsurface tool shows perfect detail while the surface tool is weathered smooth. What caused the surface damage?',
          options: [
            {
              text: 'Surface artifacts are always older and naturally more worn',
              correct: false,
              explanation: 'Age isn\'t the issue here. Both tools are from the same era. The damage is from EXPOSURE to weathering processes.'
            },
            {
              text: 'Weathering cycles (freeze-thaw, oxidation, hydration) gradually damage exposed artifacts',
              correct: true,
              explanation: 'Exactly! Surface exposure means repeated wetting/drying, freezing/thawing, oxidation, and hydration - all chemical and physical weathering processes that damage artifacts.'
            },
            {
              text: 'Sunlight bleaches and weakens stone tools',
              correct: false,
              explanation: 'While sunlight can affect color, the primary damage to surface stone tools comes from physical and chemical weathering, not light exposure.'
            },
            {
              text: 'Animals walking on surface tools cause the damage',
              correct: false,
              explanation: 'While animal trampling can cause some damage, the main cause of surface artifact weathering is exposure to natural weathering processes over time.'
            }
          ]
        },
        {
          id: 5,
          question: 'Water Table Importance',
          scenario: 'Archaeologists note that artifacts above the water table are degraded, while identical artifacts below it are perfectly preserved. What is the primary reason?',
          options: [
            {
              text: 'Water keeps artifacts from drying out',
              correct: false,
              explanation: 'While moisture presence matters, this isn\'t the key. The critical factor is the CHEMICAL PROPERTIES of the waterlogged environment.'
            },
            {
              text: 'The water table marks the boundary between aerobic (oxidative) and anaerobic (non-oxidative) environments',
              correct: true,
              explanation: 'Brilliant! Below the water table, oxygen is depleted, creating anaerobic conditions that prevent aerobic decay. Above the table, oxidative weathering and bacterial decomposition occur.'
            },
            {
              text: 'Artifacts below water are heavier and sink to where they\'re safe',
              correct: false,
              explanation: 'Artifact weight isn\'t the factor. The water table creates distinct chemical zones - aerobic above, anaerobic below.'
            },
            {
              text: 'Water pressure from below prevents all damage',
              correct: false,
              explanation: 'Pressure isn\'t the preservative factor. It\'s the chemical properties of the anaerobic zone that matter.'
            }
          ]
        }
      ]
    },
    2: {
      level: 2,
      topic: 'Excavation Protocols',
      questions: [
        {
          id: 1,
          question: 'Stratigraphic Documentation',
          scenario: 'You\'re excavating a multi-layered site with pottery from different time periods in different layers. How should you document this to preserve site integrity?',
          options: [
            {
              text: 'Collect all artifacts and date them in the lab later',
              correct: false,
              explanation: 'Without documenting layer context DURING excavation, the chronological information is lost forever. This destroys site integrity of temporal data.'
            },
            {
              text: 'Record each artifact\'s position, layer number, and surrounding features in detailed notes and photographs before removal',
              correct: true,
              explanation: 'Perfect! Stratigraphic documentation BEFORE artifact removal is essential. This preserves the site integrity of temporal relationships and context.'
            },
            {
              text: 'Just photograph the layer before removing everything at once',
              correct: false,
              explanation: 'Photographs help, but detailed positional records of individual artifacts, surrounding soil conditions, and associated features are equally important.'
            },
            {
              text: 'Mark artifacts with layer numbers after they\'re removed',
              correct: false,
              explanation: 'Recording must happen BEFORE or DURING removal, not after. Once removed without documentation, the contextual information is lost.'
            }
          ]
        },
        {
          id: 2,
          question: 'Excavation Technique',
          scenario: 'You encounter a fragile artifact (bone, textile, ceramic) partially exposed in a dirt layer. What\'s the proper excavation approach?',
          options: [
            {
              text: 'Use heavy tools to quickly remove surrounding soil',
              correct: false,
              explanation: 'Heavy tools cause vibration damage and can break fragile materials. This destroys site integrity of the artifact itself.'
            },
            {
              text: 'Use small, careful tools (brushes, dental picks) and leave some surrounding soil matrix for support and laboratory analysis',
              correct: true,
              explanation: 'Excellent! Gentle tools and leaving the soil matrix preserve both the artifact and its contextual information (pollen, microbes, chemical signatures) for later analysis.'
            },
            {
              text: 'Spray the artifact with water to soften surrounding soil',
              correct: false,
              explanation: 'Water can damage certain artifacts (bone, textiles) and alter soil chemistry. This compromises site integrity.'
            },
            {
              text: 'Use a metal scraper to cut away the soil block containing the artifact',
              correct: false,
              explanation: 'Metal tools can damage delicate artifacts. Precision hand tools like brushes and dental picks are far more appropriate for fragile materials.'
            }
          ]
        },
        {
          id: 3,
          question: 'Context Preservation',
          scenario: 'You find a tool surrounded by animal bones and ash layer. Which documentation preserves maximum site integrity?',
          options: [
            {
              text: 'Just record the tool\'s depth and collect it',
              correct: false,
              explanation: 'This loses crucial context. The associated bones and ash indicate hunting/butchering activity and site use pattern - vital information for understanding the site.'
            },
            {
              text: 'Document the tool\'s relationship to bones, ash, and surrounding features before removal',
              correct: true,
              explanation: 'Perfect! Documenting associations between artifacts, ecofacts (bones), and features (ash layer) preserves site integrity of behavioral and activity patterns.'
            },
            {
              text: 'Photograph the bones and ash separately from the tool',
              correct: false,
              explanation: 'Separate documentation loses the ASSOCIATION. The spatial relationships between items are as important as the items themselves.'
            },
            {
              text: 'Remove everything in the same excavation unit and sort it in the lab',
              correct: false,
              explanation: 'While laboratory analysis is important, documenting associations IN SITU (in place) DURING excavation is irreplaceable.'
            }
          ]
        },
        {
          id: 4,
          question: 'Ground Truthing',
          scenario: 'Your survey map shows archaeological features, but field conditions are different. What should you do to maintain site integrity?',
          options: [
            {
              text: 'Trust the map and excavate according to the planned grid',
              correct: false,
              explanation: 'Site conditions change and maps aren\'t perfectly accurate. Following a plan that doesn\'t match reality wastes excavation and damages the site.'
            },
            {
              text: 'Ignore the map and dig randomly to find features',
              correct: false,
              explanation: 'Random excavation destroys site integrity by creating chaotic damage patterns without systematic documentation.'
            },
            {
              text: 'Compare field observations to the map, adjust your understanding, and systematically excavate based on ACTUAL site features you observe',
              correct: true,
              explanation: 'Excellent! Adapting to actual field conditions while maintaining systematic documentation and grid systems preserves maximum site integrity and research value.'
            },
            {
              text: 'Follow the original survey exactly regardless of current conditions',
              correct: false,
              explanation: 'While survey data is valuable, field archaeology requires flexibility and responsiveness to actual site conditions you encounter.'
            }
          ]
        },
        {
          id: 5,
          question: 'Sample Collection',
          scenario: 'You want to test soil for pollen, microbes, and chemical composition to understand site preservation. How do you maintain integrity?',
          options: [
            {
              text: 'Take soil samples from anywhere convenient',
              correct: false,
              explanation: 'Random samples don\'t preserve spatial and contextual information. The LOCATION of samples is as important as the samples themselves.'
            },
            {
              text: 'Record sample location, depth, surrounding features, and take material in sterile containers to prevent contamination',
              correct: true,
              explanation: 'Perfect! Documented sampling with proper technique preserves integrity by allowing later analysis to correlate chemical/biological data with spatial context.'
            },
            {
              text: 'Collect samples after all excavation is complete',
              correct: false,
              explanation: 'Late sampling means losing the opportunity to correlate samples with actively documented features and losing samples to weather damage.'
            },
            {
              text: 'Use regular plastic bags and document samples later in the lab',
              correct: false,
              explanation: 'Regular plastic bags allow contamination and moisture loss. Samples must be properly containerized and field-documented for integrity.'
            }
          ]
        },
        {
          id: 6,
          question: 'Avoiding Contamination',
          scenario: 'You\'re excavating an artifact that hasn\'t been touched in 2,000 years. How do you prevent modern contamination that compromises site integrity?',
          options: [
            {
              text: 'Wear latex gloves, document the artifact before touching, and use sterile tools for removal',
              correct: true,
              explanation: 'Excellent! Proper procedures prevent modern organic contamination (skin oils, bacteria, sweat) that can damage ancient organics and confuse scientific analysis.'
            },
            {
              text: 'Handle the artifact directly with bare hands - archaeological artifacts are robust',
              correct: false,
              explanation: 'Many artifacts are fragile, and bare hands introduce modern contamination (oils, bacteria) that damages ancient materials and confuses scientific dating.'
            },
            {
              text: 'Brush off soil directly onto the excavation floor',
              correct: false,
              explanation: 'This loses soil context and spreads modern contamination. Clean brushing with documentation is essential.'
            },
            {
              text: 'Place the artifact in a labeled plastic bag with notes',
              correct: false,
              explanation: 'While labeling is good, proper excavation procedures require documentation and handling BEFORE bagging, and often plastic isn\'t appropriate (it can cause moisture problems).'
            }
          ]
        },
        {
          id: 7,
          question: 'Backfilling Decisions',
          scenario: 'After excavation, should you backfill the excavated area or leave it open?',
          options: [
            {
              text: 'Always leave excavation units open for future re-examination',
              correct: false,
              explanation: 'Leaving units open causes erosion, animal disturbance, and weather damage. This destroys the remaining site integrity of unexcavated areas.'
            },
            {
              text: 'Never backfill - leave excavation open to let rain drain and prevent standing water',
              correct: false,
              explanation: 'Open excavations are damaged by weather and become erosion hazards. Proper backfilling protects remaining deposits.'
            },
            {
              text: 'Backfill excavated areas with original soil from that location, maintaining stratigraphy documentation for future reference',
              correct: true,
              explanation: 'Perfect! Backfilling protects remaining deposits, prevents erosion, but maintaining detailed documentation allows future archaeologists to reexamine the site if needed.'
            },
            {
              text: 'Backfill with any available soil - the excavation is already done',
              correct: false,
              explanation: 'Using non-original soil changes the site geology and makes future examination difficult. Using original, documented soil is important.'
            }
          ]
        },
        {
          id: 8,
          question: 'Photography Standards',
          scenario: 'You\'re photographing an artifact in place before removal. What elements are essential for maintaining documentation integrity?',
          options: [
            {
              text: 'Just take a general photo of the artifact and the surrounding area',
              correct: false,
              explanation: 'Informal photos lack scale reference and precise documentation. Archaeological photographs require specific standards.'
            },
            {
              text: 'Include scale (scale bar or ruler), artifact ID label, directional marker (north arrow), and clear lighting showing detail',
              correct: true,
              explanation: 'Excellent! Proper archaeological photography standards include scale, labels, orientation, and professional lighting - enabling future researchers to understand and verify your documentation.'
            },
            {
              text: 'Use high zoom to get close detail without scale reference',
              correct: false,
              explanation: 'Zoomed detail photos are useful but must be supplemented with scaled, labeled photographs showing context and location.'
            },
            {
              text: 'Photograph only after artifacts are removed from context',
              correct: false,
              explanation: 'This loses the most valuable information - the artifact\'s position and association with surrounding features. IN SITU photography is essential.'
            }
          ]
        }
      ]
    },
    3: {
      level: 3,
      topic: 'Expert Site Management',
      questions: [
        {
          id: 1,
          question: 'Multi-Factor Site Assessment',
          scenario: 'A waterlogged site shows excellent artifact preservation BUT has contaminated groundwater from modern agricultural runoff. What preservation factors must you balance?',
          options: [
            {
              text: 'The waterlogged environment is good enough - contamination doesn\'t matter for preservation',
              correct: false,
              explanation: 'Chemical contamination actively degrades artifacts and compromises scientific analysis. It\'s a real preservation threat despite the anaerobic environment.'
            },
            {
              text: 'Excavate immediately before contamination gets worse',
              correct: false,
              explanation: 'Hasty excavation loses documentation and scientific rigor. The problem requires strategic planning.'
            },
            {
              text: 'Assess contaminant source, movement rate, and impact on artifacts; implement hydrogeological solutions while conducting systematic documented excavation',
              correct: true,
              explanation: 'Perfect! Expert site management requires understanding multiple preservation factors (hydrology, chemistry, biology) and coordinating solutions while maintaining scientific standards.'
            },
            {
              text: 'Leave the site undisturbed to preserve it completely',
              correct: false,
              explanation: 'While preservation in place is ideal when possible, ongoing contamination will eventually destroy artifacts. Strategic intervention is sometimes necessary.'
            }
          ]
        },
        {
          id: 2,
          question: 'Climate Adaptation Strategy',
          scenario: 'Your site has excellent preservation conditions (stable moisture, pH, temperature) but is threatened by climate change (increasing rainfall, temperature fluctuation). What\'s the expert approach?',
          options: [
            {
              text: 'Excavate everything immediately before conditions change',
              correct: false,
              explanation: 'Panic excavation compromises documentation and wastes irreplaceable archaeological data. Better to assess and plan.'
            },
            {
              text: 'Model how climate change will affect site preservation conditions, implement targeted interventions (drainage, monitoring, protective structures) if needed, and proceed strategically',
              correct: true,
              explanation: 'Excellent! Expert management involves predictive analysis, targeted interventions, and flexible response - not reactive panic.'
            },
            {
              text: 'Do nothing - climate is beyond human control anyway',
              correct: false,
              explanation: 'While we can\'t stop climate change entirely, we can adapt site preservation strategies. Archaeologists can implement protective measures.'
            },
            {
              text: 'Accelerate excavation schedules across the region to save sites from climate change',
              correct: false,
              explanation: 'Accelerated excavation loses documentation quality. Strategic, careful approach is better than rushed work.'
            }
          ]
        },
        {
          id: 3,
          question: 'Microbial Ecology Impact',
          scenario: 'Laboratory analysis of waterlogged organic artifacts shows active microbial colonies (anaerobic bacteria) that are slowly decomposing materials. How do you preserve site integrity?',
          options: [
            {
              text: 'Sterilize excavated artifacts immediately in the lab',
              correct: false,
              explanation: 'While sterilization stops decay of excavated artifacts, site deposits are still being degraded. The site itself needs intervention.'
            },
            {
              text: 'Test in-situ treatments (biocides, environmental modification) that preserve microbial data while slowing decay without sterilizing the entire site',
              correct: true,
              explanation: 'Perfect! Expert management balances preservation of artifacts WITH preservation of microbial/scientific data. In-situ solutions are more sophisticated than full sterilization.'
            },
            {
              text: 'All anaerobic bacteria are harmful - excavate immediately and sterilize everything',
              correct: false,
              explanation: 'Actually, many anaerobic bacteria are preservative (they prevent aerobic decay). The issue is controlling HARMFUL decay organisms specifically.'
            },
            {
              text: 'Microbes are unavoidable - just document and accept artifact loss',
              correct: false,
              explanation: 'While complete sterilization is impossible and undesirable, expert management can strategically control decay processes and preserve both artifacts and scientific data.'
            }
          ]
        },
        {
          id: 4,
          question: 'Taphonomic Interpretation',
          scenario: 'A faunal assemblage (animal bones) shows unusual patterns: some bones preserved perfectly, others completely decomposed despite being in the same layer. What expert interpretation is needed?',
          options: [
            {
              text: 'The perfectly preserved bones are older than the decomposed ones',
              correct: false,
              explanation: 'Age alone doesn\'t explain preservation variation. Taphonomic (post-depositional) processes affect different bones differently.'
            },
            {
              text: 'Analyze differences in bone size, composition, burial depth, and microenvironment to understand how post-depositional processes selectively preserved some bones while degrading others',
              correct: true,
              explanation: 'Excellent! Taphonomic analysis explains why different artifacts preserve differently in the same deposit, revealing complex site formation processes and preservation history.'
            },
            {
              text: 'All bones in the same layer must have equal preservation',
              correct: false,
              explanation: 'This is incorrect. Different materials preserve differently due to intrinsic properties (density, mineral composition) and varied micro-environmental conditions.'
            },
            {
              text: 'The site must have experienced multiple episodes of flooding that selectively preserved bones',
              correct: false,
              explanation: 'While flooding history matters, taphonomic variation usually reflects bone-specific properties and microenvironment differences, not just flooding events.'
            }
          ]
        },
        {
          id: 5,
          question: 'Restoring Disturbed Sites',
          scenario: 'You\'re excavating a site that was previously looted (holes dug by treasure hunters that destroyed stratigraphy in some areas). How do you maintain scientific integrity in the undisturbed portions?',
          options: [
            {
              text: 'Focus only on the looted areas to investigate what\'s left',
              correct: false,
              explanation: 'Looted areas are chaotic. Better to focus on systematic documentation of undisturbed areas that still have integrity.'
            },
            {
              text: 'Systematically excavate only undisturbed sections with full documentation; document looted areas separately to understand past disturbance patterns',
              correct: true,
              explanation: 'Perfect! Expert management preserves what CAN be preserved systematically while documenting how previous disturbance affected the site - yielding maximum scientific value from a compromised deposit.'
            },
            {
              text: 'Abandon the site since it\'s already been looted',
              correct: false,
              explanation: 'Even looted sites retain significant undisturbed areas and data. The information that remains is valuable and worth systematic study.'
            },
            {
              text: 'Randomly excavate everywhere to find what the looters might have missed',
              correct: false,
              explanation: 'Random excavation creates additional damage. Systematic work in remaining undisturbed areas is far more valuable.'
            }
          ]
        },
        {
          id: 6,
          question: 'Preservation in Perpetuity',
          scenario: 'After excavation, you must decide: repository storage at high risk from flooding/theft, or in-situ preservation leaving artifacts buried. What expert approach preserves site integrity long-term?',
          options: [
            {
              text: 'Always excavate and store in repositories for maximum access and study',
              correct: false,
              explanation: 'While repositories enable research, not all sites can be safely stored. In-situ preservation is sometimes better for long-term integrity.'
            },
            {
              text: 'Always leave deposits in place - excavation destroys them',
              correct: false,
              explanation: 'While in-situ preservation is ideal when possible, some sites face destruction from looting, development, or environmental degradation.'
            },
            {
              text: 'Assess long-term preservation threats to both excavated artifacts AND deposits; selectively excavate high-risk sites while leaving stable sites for future technology/study',
              correct: true,
              explanation: 'Brilliant! Expert management requires predictive assessment of threats to both options, making strategic decisions based on specific site circumstances and future research capabilities.'
            },
            {
              text: 'Store everything in the country of origin regardless of local conditions',
              correct: false,
              explanation: 'While repatriation is important, preservation decisions require assessing actual storage conditions, which vary by institution.'
            }
          ]
        },
        {
          id: 7,
          question: 'Multi-Disciplinary Integration',
          scenario: 'Your site has buried wooden structures (requiring dendrochronology), pollen deposits (requiring palynology), and bone assemblages (requiring zooarchaeology). How do you preserve site integrity for all analyses?',
          options: [
            {
              text: 'Excavate wood, pollen, and bones separately with specialists in each field',
              correct: false,
              explanation: 'Separate excavation loses crucial stratigraphic and contextual relationships between deposits. Integration is essential.'
            },
            {
              text: 'Systematically excavate with all specialist team members present; document spatial relationships between all materials; preserve contextual associations for integrated analysis',
              correct: true,
              explanation: 'Perfect! Multi-disciplinary site integrity requires coordinated excavation where all specialists work together, preserving associations that individual specialists need for comprehensive analysis.'
            },
            {
              text: 'Excavate everything archaeologically first, then specialists examine artifacts later',
              correct: false,
              explanation: 'This loses specialists\' input at crucial times. In-situ specialist observation enables better sampling and documentation decisions.'
            },
            {
              text: 'Let each specialist excavate their materials independently',
              correct: false,
              explanation: 'Independent excavation creates chaos and destroys the stratigraphic and spatial data that integrates different analyses.'
            }
          ]
        },
        {
          id: 8,
          question: 'Post-Excavation Stewardship',
          scenario: 'You excavated and documented a site 20 years ago. New analytical techniques now make previously useless materials valuable. How do you maintain site integrity through time?',
          options: [
            {
              text: 'Those materials are useless now - re-excavate the site for new analysis',
              correct: false,
              explanation: 'Re-excavation destroys what remains and duplicates work. Archived materials and documentation are irreplaceable.'
            },
            {
              text: 'The documentation is complete - those artifacts are a loss for future research',
              correct: false,
              explanation: 'Excellent documentation from the past, combined with archived materials, enables future researchers to conduct new analyses without re-excavation.'
            },
            {
              text: 'Maintain meticulous archives of excavation documentation, artifacts, and field notes; ensure future archaeologists can access and reanalyze materials with original context preserved',
              correct: true,
              explanation: 'Excellent! Long-term site integrity extends decades beyond excavation. Proper curation and archive maintenance enables future research that current excavators couldn\'t anticipate.'
            },
            {
              text: 'Artifact storage is too expensive - discard materials after initial analysis',
              correct: false,
              explanation: 'This destroys irreplaceable data. Proper curation, while expensive, is essential for maintaining site integrity as knowledge and methods advance.'
            }
          ]
        },
        {
          id: 9,
          question: 'Community and Indigenous Preservation Rights',
          scenario: 'A site is sacred to local Indigenous communities who request non-excavation preservation and control of their cultural heritage. How do you balance this with scientific study?',
          options: [
            {
              text: 'Scientific research takes priority - excavate and study thoroughly',
              correct: false,
              explanation: 'Modern archaeology recognizes Indigenous rights and knowledge. Unilateral scientific decisions violate cultural preservation and ethics.'
            },
            {
              text: 'Never conduct any research - let communities decide completely',
              correct: false,
              explanation: 'While Indigenous rights are paramount, some communities DO want collaborative research. The approach must be negotiated.'
            },
            {
              text: 'Engage in respectful dialogue with Indigenous communities to understand preservation priorities; pursue collaborative research models that balance scientific and cultural preservation goals',
              correct: true,
              explanation: 'Perfect! Modern site integrity includes respecting Indigenous sovereignty, knowledge systems, and preservation priorities. Collaboration, not imposition, is the ethical approach.'
            },
            {
              text: 'Communities don\'t understand preservation science - explain why excavation is necessary',
              correct: false,
              explanation: 'This approach is disrespectful. Communities have sophisticated preservation knowledge and valid cultural/spiritual preservation priorities.'
            }
          ]
        },
        {
          id: 10,
          question: 'Adaptive Management Over Time',
          scenario: 'Your preservation plan from 10 years ago is now obsolete due to climate change, new discoveries, and budget limitations. What\'s the expert approach?',
          options: [
            {
              text: 'Stick to the original plan - changing it shows weakness',
              correct: false,
              explanation: 'Rigid adherence to outdated plans compromises site integrity. Expert management requires adaptive response to new conditions.'
            },
            {
              text: 'Reassess threats, incorporate new climate data and scientific knowledge, consult stakeholders, revise preservation strategies as conditions change',
              correct: true,
              explanation: 'Brilliant! Site integrity management is ADAPTIVE - requiring ongoing assessment, revision, and response to new information. Flexibility and responsiveness are expert qualities.'
            },
            {
              text: 'Abandon the site and start fresh elsewhere',
              correct: false,
              explanation: 'Too much invested work and knowledge exists about this site. Adaptive management to changing conditions is more valuable.'
            },
            {
              text: 'Expert plans are permanent and don\'t need revision',
              correct: false,
              explanation: 'This is false. Archaeology is a science - new information requires updating plans. Site preservation is ongoing, not one-time.'
            }
          ]
        }
      ]
    }
  };

  const levelConfigs: Record<number, GameLevel> = {
    1: {
      level: 1,
      pairs: 3,
      artifacts: [artifactDatabase[1], artifactDatabase[2], artifactDatabase[3]]
    },
    2: {
      level: 2,
      pairs: 4,
      artifacts: [artifactDatabase[4], artifactDatabase[5], artifactDatabase[6], artifactDatabase[7]]
    },
    3: {
      level: 3,
      pairs: 5,
      artifacts: [artifactDatabase[5], artifactDatabase[8], artifactDatabase[9], artifactDatabase[1], artifactDatabase[4]]
    }
  };

  const moveLimit: Record<number, number> = {
    1: 8,   // Level 1: 8 moves max (6 cards, 3 pairs)
    2: 10,  // Level 2: 10 moves max (8 cards, 4 pairs)
    3: 12   // Level 3: 12 moves max (10 cards, 5 pairs)
  };

  const initializeLevel = (level: number) => {
    setCurrentLevel(level);
    setScore(0);
    setMoves(0);
    setStartTime(Date.now());
    setShowFacts(false);

    if (selectedGame === 'memory') {
      // Memory game initialization
      const config = levelConfigs[level];
      const cardArray: Card[] = [];
      
      // Create pairs of cards
      config.artifacts.forEach((artifact, index) => {
        cardArray.push({
          id: index * 2,
          artifactId: artifact.id,
          isFlipped: false,
          isMatched: false
        });
        cardArray.push({
          id: index * 2 + 1,
          artifactId: artifact.id,
          isFlipped: false,
          isMatched: false
        });
      });

      // Shuffle cards
      for (let i = cardArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cardArray[i], cardArray[j]] = [cardArray[j], cardArray[i]];
      }

      setCards(cardArray);
      setFlipped([]);
      setMatched([]);
      setGameState('playing');
    } else if (selectedGame === 'siteIntegrity') {
      // Site Integrity game initialization
      setCurrentQuestion(0);
      setAnsweredQuestions([]);
      setSelectedAnswer(null);
      setGameState('playing');
    }
  };

  const handleCardClick = (index: number) => {
    if (flipped.includes(index) || matched.includes(index)) return;
    if (flipped.length === 2) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const newMoveCount = moves + 1;
      const currentMoveLimit = moveLimit[currentLevel] || 15;
      
      // Check if move limit exceeded
      if (newMoveCount > currentMoveLimit) {
        setMoves(newMoveCount);
        setTimeout(() => {
          setGameState('finished');
          addScoreToLeaderboard(user?.displayName || 'Anonymous', score);
        }, 1000);
        return;
      }
      
      setMoves(newMoveCount);
      
      const firstCard = cards[newFlipped[0]];
      const secondCard = cards[newFlipped[1]];

      if (firstCard.artifactId === secondCard.artifactId) {
        // Match found!
        const newMatched = [...matched, newFlipped[0], newFlipped[1]];
        setMatched(newMatched);
        
        const artifact = artifactDatabase[firstCard.artifactId];
        const basePoints = artifact.basePoints;
        const pointMultiplier = levelConfigs[currentLevel]?.level || 1;
        const earnedPoints = basePoints * pointMultiplier;
        
        setScore(score + earnedPoints);
        setMatchedArtifact(artifact);
        setShowFacts(true);

        setTimeout(() => {
          setFlipped([]);
          
          if (newMatched.length === cards.length) {
            setTimeout(() => completeLevel(), 500);
          }
        }, 2000);
      } else {
        // No match
        setTimeout(() => {
          setFlipped([]);
        }, 1000);
      }
    }
  };

  const handleSiteIntegrityAnswer = (optionIndex: number) => {
    if (selectedAnswer !== null) return; // Already answered this question

    const currentQuestionData = siteIntegrityQuestions[currentLevel]?.questions[currentQuestion];
    if (!currentQuestionData) return;

    setSelectedAnswer(optionIndex);
    const isCorrect = currentQuestionData.options[optionIndex].correct;
    
    // Add to answered questions
    const newAnswered = [...answeredQuestions, { questionId: currentQuestion, correct: isCorrect }];
    setAnsweredQuestions(newAnswered);

    // Calculate score
    if (isCorrect) {
      const points = 100 + (currentLevel * 50); // Base points plus level bonus
      setScore(score + points);
    }

    // Move to next question after delay
    setTimeout(() => {
      const nextQuestionIndex = currentQuestion + 1;
      const totalQuestions = siteIntegrityQuestions[currentLevel]?.questions.length || 5;

      if (nextQuestionIndex < totalQuestions) {
        setCurrentQuestion(nextQuestionIndex);
        setSelectedAnswer(null);
      } else {
        // Level complete
        setTimeout(() => completeSiteIntegrityLevel(newAnswered), 500);
      }
    }, 1500);
  };

  const completeSiteIntegrityLevel = (answered: { questionId: number; correct: boolean }[]) => {
    // Calculate accuracy
    const correctCount = answered.filter(a => a.correct).length;
    const accuracy = (correctCount / answered.length) * 100;
    
    // Bonus for accuracy
    if (accuracy >= 90) {
      setScore(prev => prev + 500); // Excellent performance bonus
    } else if (accuracy >= 70) {
      setScore(prev => prev + 300); // Good performance bonus
    } else if (accuracy >= 50) {
      setScore(prev => prev + 100); // Passing bonus
    }

    localStorage.setItem(`siteIntegrityLevel${currentLevel}Stats`, JSON.stringify({
      level: currentLevel,
      correctAnswers: correctCount,
      totalQuestions: answered.length,
      accuracy: Math.round(accuracy)
    }));

    setGameState('levelComplete');
  };

  const completeLevel = () => {
    // Calculate time taken in seconds
    const timeTaken = (Date.now() - startTime) / 1000;
    
    // Calculate move efficiency multiplier
    const currentMoveLimit = moveLimit[currentLevel] || 8;
    const movesRatio = moves / currentMoveLimit;
    let moveMultiplier = 1;
    
    if (movesRatio <= 0.5) {
      moveMultiplier = 2.0;  // Used 50% or less of moves = 2x bonus
    } else if (movesRatio <= 0.7) {
      moveMultiplier = 1.5;  // Used 50-70% of moves = 1.5x bonus
    } else if (movesRatio <= 1.0) {
      moveMultiplier = 1.0;  // Used up to 100% of moves = no bonus
    }
    
    // Calculate time efficiency multiplier (based on level)
    let timeMultiplier = 1;
    const timeThresholds: Record<number, { excellent: number; good: number }> = {
      1: { excellent: 20, good: 35 },   // Level 1: under 20s = excellent, under 35s = good
      2: { excellent: 35, good: 60 },   // Level 2: under 35s = excellent, under 60s = good
      3: { excellent: 50, good: 90 }    // Level 3: under 50s = excellent, under 90s = good
    };
    
    const threshold = timeThresholds[currentLevel] || { excellent: 30, good: 60 };
    
    if (timeTaken <= threshold.excellent) {
      timeMultiplier = 1.5;  // Excellent speed = 1.5x bonus
    } else if (timeTaken <= threshold.good) {
      timeMultiplier = 1.2;  // Good speed = 1.2x bonus
    } else {
      timeMultiplier = 1.0;  // Slower = no bonus
    }
    
    // Apply multipliers to score
    const totalMultiplier = moveMultiplier * timeMultiplier;
    const bonusScore = Math.floor(score * (totalMultiplier - 1));
    const finalScore = score + bonusScore;
    setScore(finalScore);
    
    // Store level completion stats
    const levelStats = {
      timeTaken: Math.round(timeTaken),
      moves,
      moveLimit: currentMoveLimit,
      moveMultiplier,
      timeMultiplier,
      totalMultiplier,
      bonusScore
    };
    
    localStorage.setItem(`level${currentLevel}Stats`, JSON.stringify(levelStats));
    setGameState('levelComplete');
  };

  const nextLevel = () => {
    if (currentLevel < 3) {
      initializeLevel(currentLevel + 1);
    } else {
      setGameState('finished');
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return '#95a5a6';
      case 'uncommon': return '#2ecc71';
      case 'rare': return '#3498db';
      case 'legendary': return '#f39c12';
      default: return '#95a5a6';
    }
  };

  if (gameState === 'levelSelect') {
    return (
      <div className="game-container">
        <nav className="navbar">
          <div className="nav-content">
            <h1>🏛️ Relics Reimagined</h1>
            <div className="nav-right">
              <span className="user-info">Welcome, {user?.displayName || 'Explorer'}!</span>
              <button className="back-btn" onClick={() => navigate('/dashboard')}>← Back</button>
            </div>
          </div>
        </nav>

        <div className="game-content">
          {selectedGame === null ? (
            <div className="game-selection">
              <h2>🎮 Choose Your Archaeological Adventure</h2>
              <p>Learn archaeology through interactive games and master the key concepts of archaeological preservation</p>
              
              <div className="games-grid">
                <div className="game-card" onClick={() => setSelectedGame('memory')}>
                  <div className="game-card-subtitle">Memory Game</div>
                  <div className="game-icon">🧩</div>
                  <h3>Artifact Memory Challenge</h3>
                  <p>Test your memory and learn about ancient artifacts. Match pairs of identical artifacts while discovering fascinating facts about archaeological preservation, site integrity, and historical context.</p>
                  <ul className="game-features">
                    <li>🏜️ 3 Progressive Difficulty Levels</li>
                    <li>📚 Learn facts about 9 different artifacts</li>
                    <li>⏱️ Timed challenges with scoring</li>
                    <li>🏆 Compete on the leaderboard</li>
                  </ul>
                  <button className="select-game-btn">Play Now →</button>
                </div>

                <div className="game-card site-integrity" onClick={() => setSelectedGame('siteIntegrity')}>
                  <div className="game-card-subtitle">Learning Game</div>
                  <div className="game-icon">🏗️</div>
                  <h3>Site Integrity Challenge</h3>
                  <p>Understand what site integrity means and why it's crucial in archaeology. Site integrity is the preservation and wholeness of an archaeological site. Master excavation practices and environmental factors that protect artifacts.</p>
                  <ul className="game-features">
                    <li>🌍 Learn about environmental preservation</li>
                    <li>🔬 Master excavation protocols</li>
                    <li>⚙️ Expert-level site management</li>
                    <li>📊 Immediate feedback on answers</li>
                  </ul>
                  <button className="select-game-btn">Play Now →</button>
                </div>
              </div>
            </div>
          ) : selectedGame === 'memory' ? (
            <div className="level-select">
              <h2>🎮 Artifact Memory Challenge</h2>
              <p className="level-subtitle">Match pairs of identical artifacts and learn fascinating facts</p>

              <div className="levels-grid">
                <div className="level-card" onClick={() => initializeLevel(1)}>
                  <div className="level-number">LEVEL 1</div>
                  <div className="level-emoji">🏜️</div>
                  <h3>Novice Archaeologist</h3>
                  <p className="level-description">Match 3 pairs of ancient artifacts</p>
                  <div className="level-stats">
                    <div className="stat">Cards: 6</div>
                    <div className="stat">Pairs: 3</div>
                    <div className="stat">Difficulty: Easy</div>
                  </div>
                  <button className="play-btn">Start Game</button>
                </div>

                <div className="level-card" onClick={() => initializeLevel(2)}>
                  <div className="level-number">LEVEL 2</div>
                  <div className="level-emoji">🏛️</div>
                  <h3>Expert Archaeologist</h3>
                  <p className="level-description">Match 4 pairs of treasures</p>
                  <div className="level-stats">
                    <div className="stat">Cards: 8</div>
                    <div className="stat">Pairs: 4</div>
                    <div className="stat">Difficulty: Medium</div>
                  </div>
                  <button className="play-btn">Start Game</button>
                </div>

                <div className="level-card" onClick={() => initializeLevel(3)}>
                  <div className="level-number">LEVEL 3</div>
                  <div className="level-emoji">👑</div>
                  <h3>Master Archaeologist</h3>
                  <p className="level-description">Match 5 pairs of rare artifacts</p>
                  <div className="level-stats">
                    <div className="stat">Cards: 10</div>
                    <div className="stat">Pairs: 5</div>
                    <div className="stat">Difficulty: Hard</div>
                  </div>
                  <button className="play-btn">Start Game</button>
                </div>
              </div>

              <button className="back-selection-btn" onClick={() => setSelectedGame(null)}>
                ← Back to Game Selection
              </button>
            </div>
          ) : (
            <div className="level-select">
              <h2>🏗️ Site Integrity Challenge</h2>
              <p className="level-subtitle">Master the preservation and wholeness of archaeological sites</p>

              <div className="levels-grid">
                <div className="level-card" onClick={() => initializeLevel(1)}>
                  <div className="level-number">LEVEL 1</div>
                  <div className="level-emoji">🌍</div>
                  <h3>Site Preservation Basics</h3>
                  <p className="level-description">Learn environmental factors that protect artifacts</p>
                  <div className="level-stats">
                    <div className="stat">Questions: 5</div>
                    <div className="stat">Difficulty: Easy</div>
                    <div className="stat">Focus: Climate & Soil</div>
                  </div>
                  <button className="play-btn">Start Game</button>
                </div>

                <div className="level-card" onClick={() => initializeLevel(2)}>
                  <div className="level-number">LEVEL 2</div>
                  <div className="level-emoji">🔬</div>
                  <h3>Excavation Protocols</h3>
                  <p className="level-description">Master correct digging and documentation methods</p>
                  <div className="level-stats">
                    <div className="stat">Questions: 8</div>
                    <div className="stat">Difficulty: Medium</div>
                    <div className="stat">Focus: Techniques</div>
                  </div>
                  <button className="play-btn">Start Game</button>
                </div>

                <div className="level-card" onClick={() => initializeLevel(3)}>
                  <div className="level-number">LEVEL 3</div>
                  <div className="level-emoji">🏛️</div>
                  <h3>Expert Site Management</h3>
                  <p className="level-description">Handle complex preservation challenges</p>
                  <div className="level-stats">
                    <div className="stat">Questions: 10</div>
                    <div className="stat">Difficulty: Hard</div>
                    <div className="stat">Focus: All Topics</div>
                  </div>
                  <button className="play-btn">Start Game</button>
                </div>
              </div>

              <button className="back-selection-btn" onClick={() => setSelectedGame(null)}>
                ← Back to Game Selection
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (gameState === 'playing') {
    // Memory Game
    if (selectedGame === 'memory') {
      const pairsMatched = matched.length / 2;
      const totalPairs = levelConfigs[currentLevel]?.pairs || 3;
      const currentMoveLimit = moveLimit[currentLevel] || 15;
      const movesRemaining = Math.max(0, currentMoveLimit - moves);

      return (
        <div className="game-container">
          <nav className="navbar">
            <div className="nav-content">
              <h1>🎮 Memory Match - Level {currentLevel}</h1>
              <div className="nav-right">
                <span className="user-info">Score: {score} | Moves: {moves}</span>
              </div>
            </div>
          </nav>

          <div className="game-content">
            <div className="match-game">
              <div className="game-header">
                <h2>🔍 Find the Matching Pairs</h2>
                <div className="game-stats">
                  <div className="stat-box">
                    <div className="stat-label">Pairs Found</div>
                    <div className="stat-value">{pairsMatched}/{totalPairs}</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-label">Moves</div>
                    <div className="stat-value">{moves}/{currentMoveLimit}</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-label">Score</div>
                    <div className="stat-value">{score}</div>
                  </div>
                </div>
              </div>

              <div className="card-grid" style={{
                gridTemplateColumns: `repeat(${Math.ceil(Math.sqrt(cards.length))}, 1fr)`
              }}>
                {cards.map((card, index) => (
                  <div
                    key={index}
                    className={`memory-card ${flipped.includes(index) || matched.includes(index) ? 'flipped' : ''} ${matched.includes(index) ? 'matched' : ''}`}
                    onClick={() => handleCardClick(index)}
                  >
                    <div className="card-inner">
                      <div className="card-front">?</div>
                      <div className="card-back">
                        {artifactDatabase[card.artifactId].emoji}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {movesRemaining <= 5 && movesRemaining > 0 && (
                <div className="warning-message" style={{ color: '#ff6b6b', marginTop: '20px', textAlign: 'center', fontSize: '18px', fontWeight: 'bold' }}>
                  ⚠️ Only {movesRemaining} move{movesRemaining === 1 ? '' : 's'} remaining!
                </div>
              )}

              {showFacts && matchedArtifact && (
                <div className="facts-modal">
                  <div className="facts-content">
                    <div className="facts-header">
                      <div className="facts-emoji">{matchedArtifact.emoji}</div>
                      <h3>{matchedArtifact.name}</h3>
                      <div className="rarity-badge" style={{ backgroundColor: getRarityColor(matchedArtifact.rarity) }}>
                        {matchedArtifact.rarity.toUpperCase()}
                      </div>
                    </div>
                    
                    <div className="facts-list">
                      <div className="fact-item">
                        <div className="fact-label">📍 Origin</div>
                        <div className="fact-text">{matchedArtifact.facts.origin}</div>
                      </div>
                      <div className="fact-item">
                        <div className="fact-label">🏛️ Site Impact</div>
                        <div className="fact-text">{matchedArtifact.facts.siteImpact}</div>
                      </div>
                      <div className="fact-item">
                        <div className="fact-label">🌍 Cultural Significance</div>
                        <div className="fact-text">{matchedArtifact.facts.culturalSignificance}</div>
                      </div>
                      <div className="fact-item">
                        <div className="fact-label">⏰ Time Period</div>
                        <div className="fact-text">{matchedArtifact.facts.historicalPeriod}</div>
                      </div>
                      <div className="fact-item">
                        <div className="fact-label">💡 Fun Fact</div>
                        <div className="fact-text">{matchedArtifact.facts.additionalFact}</div>
                      </div>
                    </div>

                    <button className="close-facts-btn" onClick={() => setShowFacts(false)}>
                      Continue ✓
                    </button>
                  </div>
                </div>
              )}

              <div className="action-buttons">
                <button className="back-btn" onClick={() => {
                  setGameState('levelSelect');
                  setShowFacts(false);
                }}>← Back to Levels</button>
                <button className="back-btn" onClick={() => navigate('/dashboard')}>← Back to Dashboard</button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Site Integrity Game
    if (selectedGame === 'siteIntegrity') {
      const questionsData = siteIntegrityQuestions[currentLevel];
      const currentQuestionData = questionsData?.questions[currentQuestion];
      const totalQuestions = questionsData?.questions.length || 5;
      const answeredCount = answeredQuestions.length;

      return (
        <div className="game-container">
          <nav className="navbar">
            <div className="nav-content">
              <h1>🏗️ Site Integrity Challenge - Level {currentLevel}</h1>
              <div className="nav-right">
                <span className="user-info">Score: {score} | Question {answeredCount + 1}/{totalQuestions}</span>
              </div>
            </div>
          </nav>

          <div className="game-content">
            <div className="match-game">
              {currentQuestionData && (
                <div className="site-integrity-game">
                  <div className="game-header">
                    <h2>{questionsData?.topic}</h2>
                    <div className="game-stats">
                      <div className="stat-box">
                        <div className="stat-label">Progress</div>
                        <div className="stat-value">{answeredCount}/{totalQuestions}</div>
                      </div>
                      <div className="stat-box">
                        <div className="stat-label">Accuracy</div>
                        <div className="stat-value">{answeredQuestions.filter(a => a.correct).length}/{answeredCount}</div>
                      </div>
                      <div className="stat-box">
                        <div className="stat-label">Score</div>
                        <div className="stat-value">{score}</div>
                      </div>
                    </div>
                  </div>

                  <div className="question-container">
                    <div className="question-number">Question {answeredCount + 1} of {totalQuestions}</div>
                    <h3 className="question-title">{currentQuestionData.question}</h3>
                    <p className="question-scenario">{currentQuestionData.scenario}</p>

                    <div className="options-list">
                      {currentQuestionData.options.map((option, index) => (
                        <button
                          key={index}
                          className={`option-button ${selectedAnswer === index ? (option.correct ? 'correct' : 'incorrect') : ''} ${selectedAnswer !== null ? 'answered' : ''}`}
                          onClick={() => handleSiteIntegrityAnswer(index)}
                          disabled={selectedAnswer !== null}
                        >
                          <div className="option-text">{option.text}</div>
                          {selectedAnswer === index && (
                            <div className="option-feedback">
                              {option.correct ? '✓ Correct!' : '✗ Incorrect'}
                              <p className="option-explanation">{option.explanation}</p>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>

                    {selectedAnswer !== null && (
                      <div className="continuation-message">
                        Next question loading...
                      </div>
                    )}
                  </div>

                  <div className="action-buttons">
                    <button className="back-btn" onClick={() => {
                      setGameState('levelSelect');
                      setCurrentQuestion(0);
                      setAnsweredQuestions([]);
                      setSelectedAnswer(null);
                    }}>← Back to Levels</button>
                    <button className="back-btn" onClick={() => navigate('/dashboard')}>← Back to Dashboard</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return null;
  }

  if (gameState === 'levelComplete') {
    if (selectedGame === 'memory') {
      // Memory game completion screen
      const timeElapsed = Math.floor((Date.now() - startTime) / 1000);
      const totalPairs = levelConfigs[currentLevel]?.pairs || 3;
      
      // Retrieve stored stats from completeLevel calculation
      const levelStatsStr = localStorage.getItem(`level${currentLevel}Stats`);
      const levelStats = levelStatsStr ? JSON.parse(levelStatsStr) : {
        moveMultiplier: 1,
        timeMultiplier: 1,
        totalMultiplier: 1
      };

      return (
        <div className="game-container">
          <nav className="navbar">
            <div className="nav-content">
              <h1>🏛️ Relics Reimagined</h1>
              <div className="nav-right">
                <span className="user-info">Welcome, {user?.displayName || 'Explorer'}!</span>
              </div>
            </div>
          </nav>

          <div className="game-content">
            <div className="completion-screen">
              <div className="completion-header success">
                <div className="completion-emoji">🎉</div>
                <h2>Level Complete!</h2>
                <p className="completion-subtitle">Perfect match! You've mastered this level!</p>
              </div>

              <div className="completion-stats">
                <div className="stats-row">
                  <div className="completion-stat">
                    <div className="stat-label">Pairs Matched</div>
                    <div className="stat-value">{totalPairs}/{totalPairs}</div>
                  </div>
                  <div className="completion-stat">
                    <div className="stat-label">Total Moves</div>
                    <div className="stat-value">{moves}</div>
                  </div>
                  <div className="completion-stat">
                    <div className="stat-label">Time</div>
                    <div className="stat-value">{timeElapsed}s</div>
                  </div>
                  <div className="completion-stat">
                    <div className="stat-label">Score</div>
                    <div className="stat-value highlight">{score}</div>
                  </div>
                </div>

                <div className="multiplier-breakdown">
                  <h3>🎯 Scoring Breakdown</h3>
                  <div className="multiplier-row">
                    <span className={`multiplier-label ${levelStats.moveMultiplier > 1 ? 'bonus' : ''}`}>
                      Moves Efficiency: {levelStats.moveMultiplier.toFixed(1)}x
                    </span>
                    <span className="multiplier-desc">
                      {levelStats.moveMultiplier === 2.0 && '⭐ Excellent! Used ≤50% of moves'}
                      {levelStats.moveMultiplier === 1.5 && '✨ Great! Used 50-70% of moves'}
                      {levelStats.moveMultiplier === 1.0 && 'Used majority of moves'}
                    </span>
                  </div>
                  <div className="multiplier-row">
                    <span className={`multiplier-label ${levelStats.timeMultiplier > 1 ? 'bonus' : ''}`}>
                      Speed Bonus: {levelStats.timeMultiplier.toFixed(1)}x
                    </span>
                    <span className="multiplier-desc">
                      {levelStats.timeMultiplier === 1.5 && '⚡ Lightning fast!'}
                      {levelStats.timeMultiplier === 1.2 && '🚀 Very quick!'}
                      {levelStats.timeMultiplier === 1.0 && '✓ Steady pace'}
                    </span>
                  </div>
                  <div className="multiplier-row total">
                    <span className="multiplier-label total-multiplier">
                      Total Multiplier: {levelStats.totalMultiplier.toFixed(2)}x
                    </span>
                  </div>
                </div>
              </div>

            <div className="completion-buttons">
              {currentLevel < 3 ? (
                <>
                  <button className="continue-btn" onClick={nextLevel}>
                    Continue to Level {currentLevel + 1} →
                  </button>
                  <button className="back-btn" onClick={() => setGameState('levelSelect')}>
                    ← Back to Levels
                  </button>
                </>
              ) : (
                <>
                  <button className="continue-btn" onClick={() => setGameState('finished')}>
                    🎊 Complete All Levels!
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      );
    } else if (selectedGame === 'siteIntegrity') {
      // Site Integrity game completion screen
      const siteIntegrityStatsStr = localStorage.getItem(`siteIntegrityLevel${currentLevel}Stats`);
      const siteIntegrityStats = siteIntegrityStatsStr ? JSON.parse(siteIntegrityStatsStr) : {
        correctAnswers: 0,
        totalQuestions: 5,
        accuracy: 0
      };

      return (
        <div className="game-container">
          <nav className="navbar">
            <div className="nav-content">
              <h1>🏗️ Site Integrity Challenge</h1>
              <div className="nav-right">
                <span className="user-info">Welcome, {user?.displayName || 'Explorer'}!</span>
              </div>
            </div>
          </nav>

          <div className="game-content">
            <div className="completion-screen">
              <div className="completion-header success">
                <div className="completion-emoji">🎉</div>
                <h2>Level Complete!</h2>
                <p className="completion-subtitle">Great job mastering the concepts!</p>
              </div>

              <div className="completion-stats">
                <div className="stats-row">
                  <div className="completion-stat">
                    <div className="stat-label">Correct Answers</div>
                    <div className="stat-value">{siteIntegrityStats.correctAnswers}/{siteIntegrityStats.totalQuestions}</div>
                  </div>
                  <div className="completion-stat">
                    <div className="stat-label">Accuracy</div>
                    <div className="stat-value">{siteIntegrityStats.accuracy}%</div>
                  </div>
                  <div className="completion-stat">
                    <div className="stat-label">Questions</div>
                    <div className="stat-value">{siteIntegrityStats.totalQuestions}</div>
                  </div>
                  <div className="completion-stat">
                    <div className="stat-label">Score</div>
                    <div className="stat-value highlight">{score}</div>
                  </div>
                </div>

                <div className="multiplier-breakdown">
                  <h3>📊 Performance Summary</h3>
                  <div className="multiplier-row">
                    <span className={`multiplier-label ${siteIntegrityStats.accuracy >= 90 ? 'bonus' : ''}`}>
                      Accuracy Rating
                    </span>
                    <span className="multiplier-desc">
                      {siteIntegrityStats.accuracy >= 90 && '⭐ Excellent - Mastered the concepts!'}
                      {siteIntegrityStats.accuracy >= 70 && siteIntegrityStats.accuracy < 90 && '✨ Great - Strong understanding'}
                      {siteIntegrityStats.accuracy >= 50 && siteIntegrityStats.accuracy < 70 && '✓ Good - Basic understanding'}
                      {siteIntegrityStats.accuracy < 50 && '📚 Review - Consider reviewing the material'}
                    </span>
                  </div>
                  <div className="multiplier-row">
                    <span className="multiplier-label">
                      Correct Answers: {siteIntegrityStats.correctAnswers}/{siteIntegrityStats.totalQuestions}
                    </span>
                  </div>
                </div>
              </div>

              <div className="completion-buttons">
                {currentLevel < 3 ? (
                  <>
                    <button className="continue-btn" onClick={nextLevel}>
                      Continue to Level {currentLevel + 1} →
                    </button>
                    <button className="back-btn" onClick={() => setGameState('levelSelect')}>
                      ← Back to Levels
                    </button>
                  </>
                ) : (
                  <>
                    <button className="continue-btn" onClick={() => setGameState('finished')}>
                      🎊 Complete All Levels!
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  if (gameState === 'finished') {
    if (selectedGame === 'memory') {
      // Memory game finished screen
      const currentMoveLimit = moveLimit[currentLevel] || 15;
      const movedExceededLimit = moves > currentMoveLimit;

      return (
        <div className="game-container">
          <nav className="navbar">
            <div className="nav-content">
              <h1>🏛️ Relics Reimagined</h1>
              <div className="nav-right">
                <span className="user-info">Welcome, {user?.displayName || 'Explorer'}!</span>
              </div>
            </div>
          </nav>

          <div className="game-content">
            <div className="completion-screen finish">
              {movedExceededLimit ? (
                // Game Over - Move Limit Exceeded
                <>
                  <div className="completion-header failure">
                    <div className="completion-emoji large">😅</div>
                    <h2>Out of Moves!</h2>
                    <p className="completion-subtitle">You exceeded the move limit for this level.</p>
                  </div>

                  <div className="final-stats">
                    <div className="final-score">
                      <div className="score-label">Final Score</div>
                      <div className="score-value">{score}</div>
                    </div>
                    <div className="achievement-message">
                      You used {moves} moves but the limit was {currentMoveLimit}. Try to match pairs more carefully and use fewer moves!
                    </div>
                  </div>

                  <div className="action-buttons final">
                    <button className="play-again-btn" onClick={() => {
                      setGameState('levelSelect');
                      setScore(0);
                      setMoves(0);
                    }}>
                      🔄 Try Again
                    </button>
                    <button className="dashboard-btn" onClick={() => {
                      updateUserScore(score);
                      navigate('/leaderboard');
                    }}>
                      📊 View Leaderboard
                    </button>
                  </div>
              </>
            ) : (
              // Game Won
              <>
                <div className="completion-header success">
                  <div className="completion-emoji large">👑</div>
                  <h2>Master Archaeologist!</h2>
                  <p className="completion-subtitle">You've completed all memory challenges!</p>
                </div>

                <div className="final-stats">
                  <div className="final-score">
                    <div className="score-label">Final Score</div>
                    <div className="score-value">{score}</div>
                  </div>
                  <div className="achievement-message">
                    🏆 Congratulations! You've matched all artifacts and learned incredible facts about ancient civilizations!
                  </div>
                </div>

                <div className="action-buttons final">
                  <button className="play-again-btn" onClick={() => {
                    setGameState('levelSelect');
                    setScore(0);
                    setMoves(0);
                  }}>
                    🔄 Play Again
                  </button>
                  <button className="dashboard-btn" onClick={() => {
                    updateUserScore(score);
                    addScoreToLeaderboard(user?.displayName || 'Anonymous', score);
                    navigate('/leaderboard');
                  }}>
                    📊 View Leaderboard
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      );
    } else if (selectedGame === 'siteIntegrity') {
      // Site Integrity finished screen
      const totalCorrect = answeredQuestions.filter(q => q.correct).length;
      const totalQuestions = answeredQuestions.length;
      const accuracy = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;

      return (
        <div className="game-container">
          <nav className="navbar">
            <div className="nav-content">
              <h1>🏗️ Site Integrity Challenge - Complete!</h1>
              <div className="nav-right">
                <span className="user-info">Welcome, {user?.displayName || 'Explorer'}!</span>
              </div>
            </div>
          </nav>

          <div className="game-content">
            <div className="completion-screen finish">
              <div className="completion-header success">
                <div className="completion-emoji large">👑</div>
                <h2>Site Integrity Expert!</h2>
                <p className="completion-subtitle">You've completed all Site Integrity challenges!</p>
              </div>

              <div className="final-stats">
                <div className="final-score">
                  <div className="score-label">Final Score</div>
                  <div className="score-value">{score}</div>
                </div>
                <div className="achievement-message">
                  🏆 Excellent work! You've mastered the preservation and wholeness of archaeological sites. You understand the critical importance of site integrity for archaeological research!
                </div>
                <div className="achievement-detail">
                  Overall Accuracy: {Math.round(accuracy)}% | Total Correct: {totalCorrect} out of {totalQuestions}
                </div>
              </div>

              <div className="action-buttons final">
                <button className="play-again-btn" onClick={() => {
                  setGameState('levelSelect');
                  setScore(0);
                  setCurrentQuestion(0);
                  setAnsweredQuestions([]);
                  setSelectedAnswer(null);
                }}>
                  🔄 Play Again
                </button>
                <button className="dashboard-btn" onClick={() => {
                  updateUserScore(score);
                  addScoreToLeaderboard(user?.displayName || 'Anonymous', score);
                  navigate('/leaderboard');
                }}>
                  📊 View Leaderboard
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  return null;
};

export default Game;
