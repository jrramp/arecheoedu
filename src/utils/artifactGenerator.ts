import type { ArtifactData } from '../pages/Game';

export interface ArtifactGeneratorConfig {
  topic: string;
  subtopics: string[];
}

export const generateArtifacts = (config: ArtifactGeneratorConfig): Record<number, ArtifactData> => {
  const { topic, subtopics } = config;
  const baseArtifacts: Record<number, ArtifactData> = {};

  // Create 9 artifacts based on the topic and subtopics
  const artifactTemplates = [
    {
      rarity: 'common',
      basePoints: 10,
      iconIndex: 0,
    },
    {
      rarity: 'common',
      basePoints: 15,
      iconIndex: 1,
    },
    {
      rarity: 'uncommon',
      basePoints: 25,
      iconIndex: 2,
    },
    {
      rarity: 'uncommon',
      basePoints: 30,
      iconIndex: 3,
    },
    {
      rarity: 'rare',
      basePoints: 50,
      iconIndex: 4,
    },
    {
      rarity: 'uncommon',
      basePoints: 35,
      iconIndex: 5,
    },
    {
      rarity: 'rare',
      basePoints: 75,
      iconIndex: 6,
    },
    {
      rarity: 'rare',
      basePoints: 60,
      iconIndex: 7,
    },
    {
      rarity: 'legendary',
      basePoints: 100,
      iconIndex: 8,
    },
  ];

  const emojis = ['🏺', '🔨', '🦴', '⚔️', '💚', '📋', '👑', '📜', '🎯'];

  for (let i = 1; i <= 9; i++) {
    const template = artifactTemplates[i - 1];
    const subtopic = subtopics[Math.min(i - 1, subtopics.length - 1)];

    baseArtifacts[i] = {
      id: i,
      name: `${topic} - ${subtopic} #${i}`,
      emoji: emojis[i - 1],
      rarity: template.rarity as 'common' | 'uncommon' | 'rare' | 'legendary',
      basePoints: template.basePoints,
      facts: {
        origin: `This artifact demonstrates key principles of ${subtopic} within the broader field of ${topic}.`,
        siteImpact: `Understanding ${subtopic} helps archaeologists and researchers contextualize findings and maintain accurate records of ${topic}-related evidence.`,
        culturalSignificance: `The study of ${subtopic} is crucial to comprehending how ${topic} influenced ancient and modern civilizations.`,
        historicalPeriod: `${topic} has been studied and applied throughout history, with major developments in understanding occurring across multiple time periods.`,
        additionalFact: `Key aspect of ${subtopic}: This artifact exemplifies the interconnection between ${topic} and archaeological preservation, site integrity, and cultural heritage documentation.`,
      },
    };
  }

  return baseArtifacts;
};

export const saveArtifactConfig = (config: ArtifactGeneratorConfig) => {
  localStorage.setItem('artifactConfig', JSON.stringify(config));
};

export const loadArtifactConfig = (): ArtifactGeneratorConfig | null => {
  const saved = localStorage.getItem('artifactConfig');
  return saved ? JSON.parse(saved) : null;
};
