import pdfParse from 'pdf-parse';
import Assignment from '../models/AiAssignment.js';
import Assign from '../models/Assignment.js'
import { GoogleGenerativeAI } from '@google/generative-ai';
import generatePrompt from '../config/geminiPrompt.js';
import cloudinary from '../config/cloudinary.js';
import streamifier from 'streamifier';
import axios from 'axios';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'models/gemini-1.5-pro' });

/**
 * Upload PDF to Cloudinary (memoryStorage buffer)
 */
export const uploadAssignment = async (req, res) => {
    try {
        const { studentId, subject } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        if (!studentId || !subject) {
            return res.status(400).json({ error: 'Missing studentId or subject' });
        }

        // Upload from memory using streamifier
        const uploadStream = () =>
            new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        resource_type: 'raw',
                        folder: 'assignments',
                    },
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result);
                    }
                );
                streamifier.createReadStream(file.buffer).pipe(stream);
            });

        const result = await uploadStream();

        const assignment = new Assignment({
            studentId,
            subject,
            pdfUrl: result.secure_url,
            public_id: result.public_id,
        });

        await assignment.save();

        res.json({ success: true, assignment });
    } catch (err) {
        console.error('Upload Error:', err);
        res.status(500).json({ error: 'Failed to upload assignment' });
    }
};

function parseOnlyAnswers(text, maxAnswers = Infinity) {
    const lines = text.split('\n').filter(Boolean);
    const answers = [];
    let currentAnswer = '';

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Check for lines starting with "Q" followed by a number
        if (/^Q\d+:/.test(line)) {
            if (currentAnswer) {
                answers.push(currentAnswer.trim());
                if (answers.length >= maxAnswers) break; // Stop if enough answers
            }
            currentAnswer = ''; // Reset for next answer
        } else {
            currentAnswer += line + ' ';
        }
    }

    if (currentAnswer && answers.length < maxAnswers) {
        answers.push(currentAnswer.trim());
    }

    return answers;
}

// Evaluate Assignment
// function parseOnlyAnswers(text) {
//     const lines = text.split('\n').filter(Boolean);
//     const answers = [];
//     let currentAnswer = '';

//     lines.forEach((line) => {
//         if (line.trim().startsWith('Q')) {
//             if (currentAnswer) {
//                 answers.push(currentAnswer.trim());
//             }
//             currentAnswer = ''; // Reset on each Q
//         } else {
//             currentAnswer += line + ' ';
//         }
//     });

//     if (currentAnswer) {
//         answers.push(currentAnswer.trim());
//     }
//     return answers;
// }
// function parseOnlyAnswers(text) {
//     const questionPattern = /^Q\d+:/i;
//     const lines = text.split('\n');
//     const answers = [];
//     let currentAnswer = '';

//     lines.forEach((line) => {
//         if (questionPattern.test(line.trim())) {
//             if (currentAnswer) {
//                 answers.push(currentAnswer.trim());
//             }
//             currentAnswer = ''; // Start new answer
//         } else {
//             currentAnswer += ' ' + line.trim();
//         }
//     });

//     if (currentAnswer) {
//         answers.push(currentAnswer.trim());
//     }

//     return answers;
// }
function createParsedQAPairs(teacherQuestions, studentAnswers) {
    const parsed = [];

    for (let i = 0; i < teacherQuestions.length; i++) {
        parsed.push({
            question: teacherQuestions[i],
            answer: studentAnswers[i] || "No answer submitted."
        });
    }

    return parsed;
}
export const evaluateAssignment = async (req, res) => {
    try {
        const { id } = req.params;
        const assignment = await Assignment.findById(id);

        if (!assignment) {
            return res.status(404).json({ error: 'Assignment not found' });
        }
        // const teacherQuestions = await Assignment.findById(assignment._id).select('questions');
        const teacherassign=await Assign.findById(assignment.assignmentId);
        const teacherQuestions = teacherassign.questions || [];
        console.log(teacherQuestions);

        // Step 1: Download the PDF from Cloudinary
        let pdfResponse;
        try {
            pdfResponse = await axios.get(assignment.pdfUrl, {
                responseType: 'arraybuffer',
            });
        } catch (downloadError) {
            console.error('PDF Download Error:', downloadError);
            return res.status(500).json({ error: 'Failed to download PDF' });
        }

        // Step 2: Extract PDF text
        const pdfBuffer = Buffer.from(pdfResponse.data);
        let pdfData;
        try {
            pdfData = await pdfParse(pdfBuffer);
        } catch (parseError) {
            console.error('PDF Parsing Error:', parseError);
            return res.status(500).json({ error: 'Failed to parse PDF content' });
        }

        // Step 3: Parse Q&A pairs
        // const parsedQA = parseQA(pdfData.text);
        const textFromPDF = pdfData.text;
        const studentAnswers = parseOnlyAnswers(textFromPDF, teacherQuestions.length);
        //    // PDF parsing
         
        
        const fullAnswers = teacherQuestions.map((question, index) => {
            const answer = studentAnswers[index] || "No answer submitted";
            return {
                question,
                answer,
            };
        });


        // Step 4: Generate Gemini prompt and send
        
        const prompt = generatePrompt(fullAnswers);
        let geminiResponse;
        try {
            const result = await model.generateContent(prompt);
            console.log(result);
            const rawText = await result.response.text();
            console.log(rawText);
            const cleanText = rawText.replace(/```json|```/g, '').trim();
            geminiResponse = JSON.parse(cleanText);
            // geminiResponse = JSON.parse(result.response.text());
        } catch (geminiError) {
            console.error('Gemini API Error:', geminiError);
            return res.status(500).json({ error: 'Failed to process evaluation with Gemini API' });
        }

        // Step 5: Save results in DB
        assignment.evaluation = geminiResponse;
        assignment.status = 'evaluated';
        await assignment.save();

        res.json({ success: true, evaluation: geminiResponse });
    } catch (err) {
        console.error('Evaluation Error:', err);
        res.status(500).json({ error: 'Evaluation failed' });
    }
};



/**
 * Simple parser for Q & A format in PDFs
 */
// function parseQA(text) {
//     const lines = text.split('\n').filter(Boolean);
//     const qaPairs = [];
//     let currentQ = '', currentA = '';

//     lines.forEach((line) => {
//         if (line.trim().startsWith('Q')) {
//             if (currentQ && currentA) {
//                 qaPairs.push({ question: currentQ.trim(), answer: currentA.trim() });
//             }
//             currentQ = line;
//             currentA = '';
//         } else {
//             currentA += line + ' ';
//         }
//     });

//     if (currentQ && currentA) {
//         qaPairs.push({ question: currentQ.trim(), answer: currentA.trim() });
//     }
//     return qaPairs;
// }  
