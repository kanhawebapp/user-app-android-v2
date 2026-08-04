import {
  normalizeGeneralLifePrediction,
  isGeneralLifePredictionEmpty,
  GENERAL_LIFE_SECTIONS,
} from '../src/features/free-services/utils/generalLifePrediction';
import {
  isGeneralLifePredictionCard,
  buildGeneralLifePredictionPayload,
} from '../src/features/free-services/utils/kundliService';
import {buildBirthPayload} from '../src/features/free-services/utils/freeServiceForm';

describe('generalLifePrediction', () => {
  it('normalises array-valued sections in display order', () => {
    const data = normalizeGeneralLifePrediction({
      physical: ['Strong and agile.'],
      character: ['Optimistic.'],
      education: ['Good in academics.'],
      family: ['Supportive.'],
      health: ['Generally good.'],
    });

    expect(data.sections.map(s => s.key)).toEqual([
      'physical',
      'character',
      'education',
      'family',
      'health',
    ]);
    expect(data.sections[0].paragraphs).toEqual(['Strong and agile.']);
    expect(data.sections[1].paragraphs).toEqual(['Optimistic.']);
    expect(data.sections[4].paragraphs).toEqual(['Generally good.']);
  });

  it('accepts a plain string section and caps the key case-insensitively', () => {
    const data = normalizeGeneralLifePrediction({
      Physical: 'Tall and active.',
    });

    const physical = data.sections.find(s => s.key === 'physical');
    expect(physical?.paragraphs).toEqual(['Tall and active.']);
  });

  it('keeps missing sections as empty lists', () => {
    const data = normalizeGeneralLifePrediction({});

    expect(data.sections).toHaveLength(GENERAL_LIFE_SECTIONS.length);
    data.sections.forEach(section => {
      expect(section.paragraphs).toEqual([]);
    });
  });

  it('is empty when the report has no content', () => {
    expect(isGeneralLifePredictionEmpty(null)).toBe(true);
    expect(isGeneralLifePredictionEmpty(normalizeGeneralLifePrediction({}))).toBe(
      true,
    );
    expect(
      isGeneralLifePredictionEmpty(
        normalizeGeneralLifePrediction({health: ['Good']}),
      ),
    ).toBe(false);
  });

  it('matches the General Life Prediction card by name', () => {
    expect(
      isGeneralLifePredictionCard('General Life Prediction'),
    ).toBe(true);
    expect(
      isGeneralLifePredictionCard('Get to know about your nature'),
    ).toBe(false);
    expect(isGeneralLifePredictionCard('Birth Chart')).toBe(false);
  });

  it('builds the report payload from the Kundli payload with gender', () => {
    const birthPayload = {
      ...buildBirthPayload({date: '15/08/2024', time: '09:30 PM'}, 28.61, 77.2, 5.5),
      address: 'New Delhi, India',
    };

    const reportPayload = buildGeneralLifePredictionPayload(birthPayload);
    expect(reportPayload.day).toBe(15);
    expect(reportPayload.gender).toBe('male');

    const femalePayload = buildGeneralLifePredictionPayload({
      ...birthPayload,
      gender: 'female',
    });
    expect(femalePayload.gender).toBe('female');
  });

  it('defaults the birth payload gender to male', () => {
    const payload = buildBirthPayload(
      {date: '01/01/2024', time: '08:15 AM'},
      1,
      1,
      0,
    );
    expect(payload.gender).toBe('male');
  });
});
