"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectCropHealth = void 0;
const generative_ai_1 = require("@google/generative-ai");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)(); // Initialize environment variables
const geminiApiKey = process.env.GEMINI_API_KEY;
if (!geminiApiKey) {
    throw new Error("GEMINI_API_KEY is not defined in environment variables");
}
const genAI = new generative_ai_1.GoogleGenerativeAI(geminiApiKey);
const plantHealthDatabase = {
    tomato: {
        diseases: [
            {
                name: "Late Blight",
                symptoms: "Dark lesions on leaves, fruit rot, and stem blight.",
                treatment: "Use fungicides, remove infected plants, crop rotation.",
                causes: ["Phytophthora infestans fungus", "Cool, wet conditions"],
            },
            {
                name: "Early Blight",
                symptoms: "Brown spots on older leaves with concentric rings.",
                treatment: "Remove infected leaves, use fungicides, and improve air circulation.",
                causes: ["Alternaria solani fungus", "Warm, humid conditions"],
            },
        ],
    },
    potato: {
        diseases: [
            {
                name: "Potato Scab",
                symptoms: "Rough, corky lesions on tuber surface.",
                treatment: "Maintain soil pH around 5.2 to 5.5, use resistant varieties.",
                causes: ["Streptomyces bacteria", "High soil pH", "Dry soil"],
            },
        ],
    },
    // Add more plants and their diseases/pests here
};
function bufferToBase64(buffer) {
    return buffer.toString("base64");
}
const detectCropHealth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const imageFile = req.file;
        if (!imageFile) {
            res.status(400).json({ error: "No image provided" });
            return;
        }
        const base64Image = bufferToBase64(imageFile.buffer);
        const mimeType = imageFile.mimetype;
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        // --- PROMPT ENGINEERING: Requesting content in English, Hindi, and Odia with emphasis ---
        const prompt = `Analyze the plant in this image.
        Identify the plant species.
        Determine if there are any plant diseases or pests present.
        
        If a disease or pest is detected:
        - Provide its name in English, Hindi, and Odia. For Odia, ensure the translation is accurate and uses appropriate agricultural/biological terminology common in Odisha.
        - Describe the symptoms for diseases or damage caused by pests in English, Hindi, and Odia. Pay special attention to clarity and accuracy in Odia for descriptive terms.
        - Offer treatment recommendations for diseases or control methods for pests as an array of distinct points/sentences in English, Hindi, and Odia. Each point in Odia should be practical and culturally relevant if possible.
        - Explain the causes for diseases or the biology/life cycle for pests as an array of distinct points/sentences in English, Hindi, and Odia. The Odia translation should be precise and scientifically correct.
        
        If no disease or pest is detected, state "No disease or pest detected" in English, Hindi, and Odia.
        
        Provide the information in a JSON format with the following structure:
        {
          "plant_name": {
            "en": "string",
            "hi": "string",
            "or": "string" // Odia
          },
          "issue_detected": boolean,
          "issue_type": "string", // "disease", "pest", or "none"
          "issue_info": {
            "name": {
              "en": "string",
              "hi": "string",
              "or": "string"
            },
            "symptoms_or_damage": {
              "en": "string",
              "hi": "string",
              "or": "string"
            },
            "treatment_or_control": {
              "en": ["string"],
              "hi": ["string"],
              "or": ["string"] // Odia
            },
            "causes_or_biology": {
              "en": ["string"],
              "hi": ["string"],
              "or": ["string"] // Odia
            }
          },
          "gemini_raw_description": "string"
        }
        
        Ensure the JSON is valid and well-formed. DO NOT include any Markdown formatting (like bolding with **, italics with *, or lists with -) within the JSON string values themselves. DO NOT wrap the JSON object in any markdown code blocks (e.g., \`\`\`json). Just output the raw JSON object.`;
        const result = yield model.generateContent({
            contents: [
                {
                    role: "user",
                    parts: [
                        {
                            inlineData: {
                                mimeType,
                                data: base64Image,
                            },
                        },
                        {
                            text: prompt,
                        },
                    ],
                },
            ],
        });
        const geminiResponseText = result.response.text();
        let geminiParsedResult;
        try {
            const jsonMatch = geminiResponseText.match(/```json\n([\s\S]*?)\n```/);
            let jsonString = '';
            if (jsonMatch && jsonMatch[1]) {
                jsonString = jsonMatch[1].trim();
            }
            else {
                jsonString = geminiResponseText.trim();
            }
            geminiParsedResult = JSON.parse(jsonString);
        }
        catch (parseError) {
            console.error("Failed to parse Gemini JSON response:", parseError);
            geminiParsedResult = {
                plant_name: { en: "Unknown Plant", hi: "अज्ञात पौधा", or: "ଅଜ୍ଞାତ ଉଦ୍ଭିଦ" },
                issue_detected: false,
                issue_type: "none",
                issue_info: {
                    name: { en: "N/A", hi: "लागू नहीं", or: "ଲାଗୁ ନୁହେଁ" },
                    symptoms_or_damage: { en: "N/A", hi: "लागू नहीं", or: "ଲାଗୁ ନୁହେଁ" },
                    treatment_or_control: {
                        en: ["No specific treatment or control recommendations."],
                        hi: ["कोई विशिष्ट उपचार या नियंत्रण सुझाव नहीं।"],
                        or: ["କୌଣସି ନିର୍ଦ୍ଦିଷ୍ଟ ଚିକିତ୍ସା କିମ୍ବା ନିୟନ୍ତ୍ରଣ ସୁପାରିଶ ନାହିଁ ।"]
                    },
                    causes_or_biology: {
                        en: ["No specific causes or biology information available."],
                        hi: ["कोई विशिष्ट कारण या जीव विज्ञान संबंधी जानकारी उपलब्ध नहीं।"],
                        or: ["କୌଣସି ନିର୍ଦ୍ଦିଷ୍ଟ କାରଣ କିମ୍ବା ଜୀବ ବିଜ୍ଞାନ ସୂଚନା ଉପଲବ୍ଧ ନାହିଁ ।"]
                    }
                },
                gemini_raw_description: geminiResponseText
            };
        }
        // --- Logic to combine with local database info (still only English) ---
        // If you want local DB to also support Hindi/Odia, you'd need to add 'hi'/'or' fields to `HealthIssueInfo`
        // and populate them in your `plantHealthDatabase`.
        // Updated local DB matching logic with proper type checking
        let matchedDBInfo = "Not in local DB";
        if (geminiParsedResult.issue_detected &&
            geminiParsedResult.issue_type === "disease" &&
            ((_b = (_a = geminiParsedResult.issue_info) === null || _a === void 0 ? void 0 : _a.name) === null || _b === void 0 ? void 0 : _b.en) && // Check English name exists
            ((_c = geminiParsedResult.plant_name) === null || _c === void 0 ? void 0 : _c.en) // Check plant name exists
        ) {
            const detectedIssueName = geminiParsedResult.issue_info.name.en;
            const detectedPlantName = geminiParsedResult.plant_name.en.toLowerCase();
            // Check if plant exists in database
            const plantData = plantHealthDatabase[detectedPlantName];
            if (plantData) {
                const matchedDisease = plantData.diseases.find(disease => detectedIssueName.toLowerCase().includes(disease.name.toLowerCase()) ||
                    disease.name.toLowerCase().includes(detectedIssueName.toLowerCase()));
                if (matchedDisease) {
                    matchedDBInfo = matchedDisease;
                }
            }
        }
        // Prepare the final response object for the frontend
        // When using local DB info, override only English fields; keep Gemini's Hindi/Odia
        const finalResponse = {
            plant_name: geminiParsedResult.plant_name || { en: "Unknown Plant", hi: "अज्ञात पौधा", or: "ଅଜ୍ଞାତ ଉଦ୍ଭିଦ" },
            issue_detected: geminiParsedResult.issue_detected || false,
            issue_type: geminiParsedResult.issue_type || "none",
            issue_info: geminiParsedResult.issue_info || {
                name: { en: "N/A", hi: "लागू नहीं", or: "ଲାଗୁ ନୁହେଁ" },
                symptoms_or_damage: { en: "N/A", hi: "लागू नहीं", or: "ଲାଗୁ ନୁହେଁ" },
                treatment_or_control: {
                    en: ["No specific treatment or control recommendations."],
                    hi: ["कोई विशिष्ट उपचार या नियंत्रण सुझाव नहीं।"],
                    or: ["କୌଣସି ନିର୍ଦ୍ଦିଷ୍ଟ ଚିକିତ୍ସା କିମ୍ବା ନିୟନ୍ତ୍ରଣ ସୁପାରିଶ ନାହିଁ ।"]
                },
                causes_or_biology: {
                    en: ["No specific causes or biology information available."],
                    hi: ["कोई विशिष्ट कारण या जीव विज्ञान संबंधी जानकारी उपलब्ध नहीं।"],
                    or: ["କୌଣସି ନିର୍ଦ୍ଦିଷ୍ଟ କାରଣ କିମ୍ବା ଜୀବ ବିଜ୍ଞାନ ସୂଚନା ଉପଲବ୍ଧ ନାହିଁ ।"]
                }
            },
            gemini_raw_description: geminiParsedResult.gemini_raw_description || ""
        };
        res.status(200).json({
            result: [finalResponse],
        });
    }
    catch (error) {
        console.error("Unhandled error in crop health detection:", error);
        res.status(500).json({
            error: "Internal server error",
            details: error instanceof Error ? error.message : "Unexpected error",
        });
    }
});
exports.detectCropHealth = detectCropHealth;
