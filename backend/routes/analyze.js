import express from 'express';
import formidable from 'formidable';
import fs from 'fs';
import axios from 'axios';
import Product from '../models/Product.js';

const router = express.Router();


// Gemini returns human-readable concern strings like "Dark spots (moderate)".
// The DB stores short lowercase tags. This map bridges the two.
const CONCERN_KEYWORD_MAP = {
  'dark spot':   'dark spots',
  'pigmentation':'pigmentation',
  'acne':        'acne',
  'breakout':    'acne',
  'blemish':     'acne',
  'pore':        'pores',
  'oily':        'oiliness',
  'oil':         'oiliness',
  'dry':         'dryness',
  'dehydrat':    'dryness',
  'sensitiv':    'sensitivity',
  'redness':     'redness',
  'fine line':   'fine lines',
  'wrinkle':     'fine lines',
  'texture':     'texture',
  'rough':       'texture',
  'dull':        'dullness',
  'glow':        'dullness',
  'uneven':      'pigmentation',
  'spot':        'dark spots',
};

/**
 * Maps a raw Gemini concern string to one or more DB concern tags.
 * e.g. "Dark spots (moderate)" → ["dark spots"]
 *      "Uneven texture (mild)"  → ["pigmentation", "texture"]
 */
function mapConcernToDbTags(rawConcern) {
  const lower = rawConcern.toLowerCase();
  const matched = new Set();
  for (const [keyword, tag] of Object.entries(CONCERN_KEYWORD_MAP)) {
    if (lower.includes(keyword)) matched.add(tag);
  }
  return [...matched];
}

// Route 

router.post('/', async (req, res) => {
  try {
    const form = formidable({
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024
    });

    const [fields, files] = await form.parse(req);

    // The entire survey comes as one JSON string — we parse it back into an object
    const surveyRaw = Array.isArray(fields.survey) ? fields.survey[0] : fields.survey;
    const photo = Array.isArray(files.photo) ? files.photo[0] : files.photo;

    let survey = {};
    try {
      survey = JSON.parse(surveyRaw || '{}');
    } catch (surveyParseError) {
      console.error('[analyze] Invalid survey JSON:', String(surveyRaw).slice(0, 120));
      return res.status(400).json({ success: false, message: 'Invalid survey data.' });
    }

    if (!photo || !photo.filepath) {
      console.error('[analyze] No photo received in request.');
      return res.status(400).json({ success: false, message: 'No photo uploaded.' });
    }

    // Fallback mime type if formidable fails to detect it
    const mimeType = photo.mimetype || 'image/jpeg';

    // Build a readable summary of the survey answers for Gemini
    const surveyContext = `
- Age: ${survey.age || 'not specified'}
- Skin feel: ${survey.skinFeel || 'not specified'}
- Main concern: ${survey.mainConcern || 'not specified'}
- Breakout frequency: ${survey.breakouts || 'not specified'}
- Skin sensitivity: ${survey.sensitivity || 'not specified'}
- Sunscreen use: ${survey.sunscreen || 'not specified'}
- Sleep: ${survey.sleep || 'not specified'}
- Stress level: ${survey.stress || 'not specified'}
`;

    // Read the photo from its temporary path and convert to base64
    const photoBuffer = fs.readFileSync(photo.filepath);
    const base64Image = photoBuffer.toString('base64');

    // Build the prompt
    const prompt = `You are a certified cosmetic dermatologist AI assistant.
Your task is to perform a cosmetic skin assessment based on:
1) A front-face image
2) User survey data

Important:
- Do NOT make medical diagnoses.
- Do NOT exaggerate.
- Base analysis only on visible signs and provided information.
- If uncertain, state "cannot determine from image."
- Tone: Professional, reassuring, realistic. Make the user feel supported and informed.

User survey context:
${surveyContext}

The JSON you return has two clearly separated purposes:
- WEBSITE fields: shown instantly on the results page — scores, quick summary, concern tags, ingredient names only.
- EMAIL fields: sent in the full report email — deeper analysis, routines with explanations, lifestyle tips, closing message.

Score scale reference — follow this exactly when assigning numeric values:
- hydration:     0 = severely dry         → 100 = well hydrated          (higher = better)
- texture:       0 = very rough/uneven    → 100 = very smooth            (higher = better)
- pores:         0 = very enlarged        → 100 = minimally visible      (higher = better)
- darkSpots:     0 = none visible         → 100 = severe hyperpigmentation  (lower = better)
- fineLines:     0 = none visible         → 100 = very prominent         (lower = better)
- oilProduction: 0 = no excess oil        → 100 = extremely oily         (lower = better)
- sensitivity:   0 = not reactive at all  → 100 = extremely reactive     (lower = better)
- pigmentation:  0 = perfectly even tone  → 100 = significant unevenness (lower = better)

Return ONLY a valid JSON object with no extra text or markdown:
{
  "website": {
    "overallScore": 72,
    "hydration": 68,
    "texture": 71,
    "darkSpots": 45,
    "fineLines": 30,
    "pores": 55,
    "oilProduction": 65,
    "sensitivity": 40,
    "pigmentation": 55,
    "concerns": ["Dark spots (moderate)", "Uneven texture (mild)"],
    "summary": "1-2 sentence teaser — professional, reassuring, and just enough to make the user curious about the full report.",
    "ingredientNames": ["Niacinamide", "Hyaluronic Acid", "Salicylic Acid"],
    "avoidNames": ["Alcohol-based toners", "Heavy oils"]
  },

  "email": {
    "emailSummary": "3-4 sentences written warmly and directly to the user. Reference their specific skin type, their main concern from the survey, and one encouraging insight. This is the first thing they read in the email so make it feel personal and reassuring.",

    "detailedExamination": "4-5 sentences describing in detail what was visually observed in the photo. Cover texture quality, pore behavior, hydration signals, pigmentation patterns, under-eye condition, and overall skin health impression. Write like a dermatologist explaining findings to a patient — clinical but kind.",

    "skinOverview": {
      "estimatedSkinType": "Combination",
      "hydrationLevel": "Moderate",
      "oilProduction": "High in T-zone",
      "sensitivityIndicators": "Mild redness around nose",
      "textureQuality": "Slightly uneven",
      "poreVisibility": "Moderate",
      "pigmentationLevel": "Mild hyperpigmentation",
      "estimatedSkinAge": "Early 20s (cosmetic estimate only)"
    },

    "keyObservations": {
      "acnePresence": "Mild comedonal acne on forehead",
      "rednessAreas": "Around nose and chin",
      "pigmentationClusters": "Left cheek",
      "fineLinesVisibility": "Cannot determine from image",
      "underEyeCondition": "Mild darkening",
      "elasticityAppearance": "Good"
    },

    "rootCauseAnalysis": "2-3 sentences connecting the visible concerns to the user's lifestyle answers — sleep, stress, sunscreen habits. Help the user understand WHY their skin looks this way, not just what it looks like.",

    "morningRoutine": [
      { "step": "Gentle Foaming Cleanser", "why": "Removes overnight sebum without disrupting the skin barrier." },
      { "step": "Niacinamide Serum", "why": "Reduces redness and regulates oil production." },
      { "step": "Lightweight Moisturizer", "why": "Maintains hydration without clogging pores." },
      { "step": "SPF 30+ Sunscreen", "why": "Prevents further pigmentation and protects the barrier." }
    ],

    "eveningRoutine": [
      { "step": "Micellar Water or Oil Cleanser", "why": "Removes SPF and daily buildup gently." },
      { "step": "Gentle Cleanser", "why": "Second cleanse to ensure a clean base." },
      { "step": "BHA Exfoliant (2-3x per week)", "why": "Unclogs pores and smooths texture over time." },
      { "step": "Barrier Repair Moisturizer", "why": "Restores the skin barrier and locks in moisture overnight." }
    ],

    "ingredients": [
      { "name": "Niacinamide", "benefit": "Reduces redness, minimizes pores, and regulates sebum production." },
      { "name": "Hyaluronic Acid", "benefit": "Draws moisture into the skin for lasting hydration." },
      { "name": "Salicylic Acid", "benefit": "Exfoliates inside the pore to reduce breakouts and congestion." }
    ],

    "avoid": [
      { "ingredient": "Alcohol-based toners", "reason": "Strips the skin barrier and worsens sensitivity over time." },
      { "ingredient": "Heavy oils", "reason": "Can clog pores and increase congestion on combination skin." }
    ],

    "lifestyleTips": [
      { "tip": "Aim for 7-9 hours of sleep", "impact": "Poor sleep elevates cortisol which directly triggers inflammation and breakouts." },
      { "tip": "Apply SPF every morning without exception", "impact": "Prevents dark spots from deepening and protects against premature skin aging." },
      { "tip": "Drink at least 8 glasses of water daily", "impact": "Improves skin elasticity and reduces the appearance of dullness and fine lines." }
    ],

    "closing": "One warm, encouraging, personalized sentence based on the user's main concern and survey answers. End on a positive and motivating note."
  }
}`;

    if (!process.env.GEMINI_KEY) {
      console.error('[analyze] GEMINI_KEY is missing in environment variables.');
      return res.status(500).json({ success: false, message: 'AI service is not configured.' });
    }

    // Call Gemini Vision API
    const geminiResponse = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_KEY}`,
      {
        contents: [{
          parts: [
            { text: prompt },
            { inlineData: { mimeType, data: base64Image } }
          ]
        }],
        generationConfig: {
          responseMimeType: 'application/json'
        }
      }
    );

    // Extract and parse Gemini's response
    const rawText = geminiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      console.error('[analyze] Gemini returned no text:', JSON.stringify(geminiResponse.data));
      return res.status(500).json({ success: false, message: 'No response from AI model.' });
    }

    const clean = rawText.replace(/```json|```/g, '').trim();

    let skinResults;
    try {
      skinResults = JSON.parse(clean);
    } catch (parseError) {
      console.error('[analyze] Failed to parse Gemini JSON. Output was:\n', clean.slice(0, 400));
      return res.status(500).json({ success: false, message: 'Failed to parse AI response.' });
    }

    if (!skinResults?.website) {
      console.error('[analyze] Response missing "website" key:', JSON.stringify(skinResults).slice(0, 200));
      return res.status(500).json({ success: false, message: 'Unexpected AI response structure.' });
    }

    //Product matching 
    // Map Gemini's human-readable concern strings → DB concern tags,
    // then score and rank products by how many tags they share with the user.

    const rawConcerns = Array.isArray(skinResults.website.concerns)
      ? skinResults.website.concerns
      : [];

    // Deduplicated set of DB-compatible concern tags from Gemini output
    const detectedConcerns = [
      ...new Set(rawConcerns.flatMap(mapConcernToDbTags))
    ];

    // Derive skin type tags from the survey answer
    const normalizedSkinFeel = String(survey.skinFeel || '').toLowerCase();
    const preferredSkinTypes = new Set(['all']);
    if (normalizedSkinFeel.includes('dry'))                                                          preferredSkinTypes.add('dry');
    if (normalizedSkinFeel.includes('oily') || normalizedSkinFeel.includes('shiny'))                 preferredSkinTypes.add('oily');
    if (normalizedSkinFeel.includes('combination') || normalizedSkinFeel.includes('sometimes oily')) preferredSkinTypes.add('combination');
    if (normalizedSkinFeel.includes('sensitive'))                                                    preferredSkinTypes.add('sensitive');
    if (normalizedSkinFeel.includes('balanced') || normalizedSkinFeel.includes('normal'))            preferredSkinTypes.add('normal');

    const skinTypeArray = [...preferredSkinTypes];

    let recommendations = [];
    try {
      // Aggregate pipeline: match → score by tag overlap → sort → limit
      // Products that cover the most of the user's detected concerns and
      // skin types bubble to the top. The relevanceScore field is stripped
      // before sending to the client.
      recommendations = await Product.aggregate([
        {
          $match: {
            $or: [
              { concerns:  { $in: detectedConcerns } },
              { skinTypes: { $in: skinTypeArray     } }
            ]
          }
        },
        {
          $addFields: {
            relevanceScore: {
              $add: [
                {
                  $size: {
                    $ifNull: [{ $setIntersection: ['$concerns',  detectedConcerns] }, []]
                  }
                },
                {
                  $size: {
                    $ifNull: [{ $setIntersection: ['$skinTypes', skinTypeArray]    }, []]
                  }
                }
              ]
            }
          }
        },
        { $sort:    { relevanceScore: -1 } },
        { $limit:   6                      },
        { $project: { relevanceScore: 0   } }
      ]);
    } catch (dbError) {
      // AI result is still usable even if product DB lookup fails
      console.error('[analyze] Product lookup failed:', dbError.message);
    }

    res.json({
      success: true,
      user: survey,
      results: skinResults,
      recommendations
    });

  } catch (error) {
    const upstreamMessage = error?.response?.data
      ? JSON.stringify(error.response.data).slice(0, 500)
      : error.message;
    console.error('Analysis error:', upstreamMessage);

    const status = error?.response?.status;
    const apiMessage = error?.response?.data?.error?.message || '';
    if (status === 429) {
      const retryMatch = apiMessage.match(/retry in\s+([\d.]+)s/i);
      const retryAfterSeconds = retryMatch ? Math.ceil(Number(retryMatch[1])) : null;
      const retryHint = retryAfterSeconds
        ? `Please retry in about ${retryAfterSeconds} seconds.`
        : 'Please retry in a short while.';

      return res.status(429).json({
        success: false,
        message: `Gemini API quota exceeded. ${retryHint}`,
        retryAfterSeconds
      });
    }

    res.status(500).json({
      success: false,
      message: 'Analysis failed. Please try again.'
    });
  }
});

export default router;
