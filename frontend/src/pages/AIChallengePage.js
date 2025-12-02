import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import { Zap, Loader2, AlertTriangle, CheckCircle2, XCircle, Award } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function AIChallengePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [llmConfigured, setLlmConfigured] = useState(false);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [generatedQuiz, setGeneratedQuiz] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('phishing');
  const [numQuestions, setNumQuestions] = useState(10);
  const [difficulty, setDifficulty] = useState('medium');
  const [challengeMode, setChallengeMode] = useState('quiz'); // quiz, conversation, scenario
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [conversation, setConversation] = useState([]);
  const [userResponse, setUserResponse] = useState('');

  useEffect(() => {
    checkLLMConfig();
  }, []);

  const checkLLMConfig = async () => {
    try {
      const token = localStorage.getItem('soceng_token');
      const response = await axios.get(`${API}/llm/config`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const hasEnabled = response.data.some(config => config.enabled);
      setLlmConfigured(hasEnabled);

      if (!hasEnabled) {
        toast.error('Please configure LLM API key in Settings first');
      }
    } catch (error) {
      console.error('Failed to check LLM config', error);
    } finally {
      setLoading(false);
    }
  };

  const generateQuiz = async () => {
    if (!llmConfigured) {
      toast.error('LLM not configured. Go to Settings → LLM Configuration');
      navigate('/settings');
      return;
    }

    setGenerating(true);
    setGeneratedQuiz(null);
    setQuizAnswers({});
    setCurrentQuestionIdx(0);
    setShowResults(false);

    try {
      const token = localStorage.getItem('soceng_token');

      const prompt = `You are a social engineering quiz generator for security awareness training.

Generate ${numQuestions} realistic multiple-choice questions about ${selectedCategory} attacks in Indonesian language.

Each question should test ability to recognize social engineering tactics.

Format your response as JSON:
{
  "quiz_title": "Brief title for this quiz",
  "category": "${selectedCategory}",
  "difficulty": "${difficulty}",
  "questions": [
    {
      "id": "q1",
      "question": "Question text in Indonesian",
      "options": [
        {"text": "Option A", "correct": false},
        {"text": "Option B", "correct": true},
        {"text": "Option C", "correct": false},
        {"text": "Option D", "correct": false}
      ],
      "explanation": "Why the correct answer is right",
      "cialdini_principle": "authority|urgency|reciprocity|etc"
    }
  ]
}

Generate exactly ${numQuestions} questions. Mix difficulty and Cialdini principles. Mark clearly as [TRAINING] material.`;

      const response = await axios.post(`${API}/llm/generate`, {
        prompt: prompt,
        context: {
          category: selectedCategory,
          num_questions: numQuestions,
          difficulty: difficulty,
          language: 'id'
        }
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      let quizData;
      try {
        let jsonText = response.data.generated_text;

        console.log('Raw AI response:', jsonText);

        // Step 1: Remove [TRAINING] marker and similar prefixes
        jsonText = jsonText.replace(/\[TRAINING\]\s*/gi, '');
        jsonText = jsonText.replace(/\[TRAINING MATERIAL\]\s*/gi, '');

        // Step 2: Extract JSON from markdown code blocks
        // Match pattern: ```json ... ``` or ``` ... ```
        const codeBlockMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (codeBlockMatch) {
          jsonText = codeBlockMatch[1].trim();
          console.log('Extracted from code block:', jsonText);
        } else {
          // No code block found, try to clean up manually
          jsonText = jsonText.replace(/```json\s*/gi, '').replace(/```\s*/g, '');
        }

        // Step 3: Remove any remaining text before first { or [
        const startMatch = jsonText.search(/[\{\[]/);
        if (startMatch !== -1) {
          jsonText = jsonText.substring(startMatch);
        }

        // Step 4: Remove text after last } or ]
        const endMatch = jsonText.search(/[\}\]][^\}\]]*$/);
        if (endMatch !== -1) {
          jsonText = jsonText.substring(0, endMatch + 1);
        }

        // Step 5: Clean up any remaining whitespace
        jsonText = jsonText.trim();

        console.log('Cleaned JSON text:', jsonText);

        // Step 6: Try to parse
        quizData = JSON.parse(jsonText);

        // Step 7: Validate structure
        if (!quizData.questions || !Array.isArray(quizData.questions)) {
          throw new Error('Invalid quiz structure: missing questions array');
        }

        if (quizData.questions.length === 0) {
          throw new Error('Quiz has no questions');
        }

        // Validate each question has required fields
        quizData.questions.forEach((q, idx) => {
          if (!q.question || !q.options || !Array.isArray(q.options)) {
            throw new Error(`Question ${idx + 1} is missing required fields`);
          }
          if (!q.id) {
            q.id = `q${idx + 1}`;
          }
        });

        console.log('✅ Successfully parsed quiz data:', quizData);

      } catch (parseError) {
        console.error('❌ Parse error:', parseError);
        console.log('Failed to parse response:', response.data.generated_text);

        // Fallback: create basic quiz from text
        toast.error(`AI returned invalid JSON: ${parseError.message}`);

        // Try to salvage what we can
        quizData = {
          quiz_title: `${selectedCategory.toUpperCase()} Quiz`,
          category: selectedCategory,
          difficulty: difficulty,
          questions: []
        };

        // Show error message as first "question"
        quizData.questions.push({
          id: 'error',
          question: '⚠️ AI generation failed. The response could not be parsed.',
          options: [
            { text: 'Try regenerating with different settings', correct: true },
            { text: 'Go back to settings', correct: false }
          ],
          explanation: `Error: ${parseError.message}\n\nRaw response preview: ${response.data.generated_text.substring(0, 300)}...`,
          cialdini_principle: 'error'
        });

        setGenerating(false);
        return;
      }

      setGeneratedQuiz(quizData);
      toast.success(`🤖 Generated ${quizData.questions?.length || 0} questions!`);
    } catch (error) {
      console.error('Failed to generate quiz', error);
      toast.error(`Failed to generate quiz: ${error.response?.data?.detail || error.message}`);
    } finally {
      setGenerating(false);
    }
  };

  const handleAnswerSelect = (questionId, optionIdx) => {
    setQuizAnswers({
      ...quizAnswers,
      [questionId]: optionIdx
    });
  };

  const handleSubmit = () => {
    if (!generatedQuiz) return;

    let correctCount = 0;
    generatedQuiz.questions.forEach(q => {
      const selectedIdx = quizAnswers[q.id];
      if (selectedIdx !== undefined && q.options[selectedIdx]?.correct) {
        correctCount++;
      }
    });

    const finalScore = Math.round((correctCount / generatedQuiz.questions.length) * 100);
    setScore(finalScore);
    setShowResults(true);

    if (finalScore >= 70) {
      toast.success('✅ Excellent work!');
    } else if (finalScore >= 40) {
      toast('⚠️ Good effort, but review the explanations');
    } else {
      toast.error('❌ Need more practice. Review the lessons!');
    }
  };

  const handleNext = () => {
    if (currentQuestionIdx < generatedQuiz.questions.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx(currentQuestionIdx - 1);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  // Results View
  if (showResults && generatedQuiz) {
    const correctCount = generatedQuiz.questions.filter(q => {
      const selectedIdx = quizAnswers[q.id];
      return selectedIdx !== undefined && q.options[selectedIdx]?.correct;
    }).length;

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="glass-panel p-8 text-center">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${score >= 70 ? 'bg-tertiary/20' : score >= 40 ? 'bg-warning/20' : 'bg-destructive/20'
            }`}>
            <Award className={`w-12 h-12 ${score >= 70 ? 'text-tertiary' : score >= 40 ? 'text-warning' : 'text-destructive'
              }`} />
          </div>

          <h2 className="text-3xl font-bold mb-2">Quiz Completed!</h2>
          <p className="text-muted-foreground mb-6">{generatedQuiz.quiz_title}</p>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="glass-panel p-4">
              <div className="text-sm text-muted-foreground uppercase">Score</div>
              <div className={`text-4xl font-bold font-mono ${score >= 70 ? 'text-tertiary' : score >= 40 ? 'text-warning' : 'text-destructive'
                }`}>
                {score}%
              </div>
            </div>
            <div className="glass-panel p-4">
              <div className="text-sm text-muted-foreground uppercase">Correct</div>
              <div className="text-4xl font-bold font-mono text-tertiary">
                {correctCount}/{generatedQuiz.questions.length}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-4">
            <Button onClick={() => {
              setGeneratedQuiz(null);
              setQuizAnswers({});
              setShowResults(false);
              setCurrentQuestionIdx(0);
            }}>
              Generate New Quiz
            </Button>
            <Button variant="outline" onClick={() => {
              setShowResults(false);
              setCurrentQuestionIdx(0);
              setQuizAnswers({});
            }}>
              Retake Quiz
            </Button>
          </div>
        </Card>

        {/* Review */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold">Answer Review</h3>
          {generatedQuiz.questions.map((question, qIdx) => {
            const selectedIdx = quizAnswers[question.id];
            const isCorrect = selectedIdx !== undefined && question.options[selectedIdx]?.correct;

            return (
              <Card key={question.id} className={`glass-panel p-6 ${isCorrect ? 'border-tertiary/30' : 'border-destructive/30'
                }`}>
                <div className="flex items-start space-x-4">
                  {isCorrect ? (
                    <CheckCircle2 className="w-6 h-6 text-tertiary mt-1" />
                  ) : (
                    <XCircle className="w-6 h-6 text-destructive mt-1" />
                  )}

                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="font-bold">Question {qIdx + 1}:</span>
                      <Badge variant="outline" className="text-xs">
                        {question.cialdini_principle}
                      </Badge>
                    </div>
                    <p className="mb-4">{question.question}</p>

                    <div className="space-y-2 mb-4">
                      {question.options.map((option, optIdx) => {
                        const isSelected = selectedIdx === optIdx;
                        const isCorrectOption = option.correct;

                        return (
                          <div
                            key={optIdx}
                            className={`p-3 rounded border ${isCorrectOption
                                ? 'border-tertiary/50 bg-tertiary/10'
                                : isSelected
                                  ? 'border-destructive/50 bg-destructive/10'
                                  : 'border-muted/30'
                              }`}
                          >
                            <div className="flex items-center justify-between">
                              <span>{option.text}</span>
                              {isCorrectOption && <Badge className="bg-tertiary/20 text-tertiary">Correct</Badge>}
                              {isSelected && !isCorrectOption && <Badge className="bg-destructive/20 text-destructive">Your Answer</Badge>}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {question.explanation && (
                      <div className="p-4 bg-muted/20 rounded border border-muted/30">
                        <div className="text-sm font-bold mb-1">💡 Explanation:</div>
                        <p className="text-sm text-muted-foreground">{question.explanation}</p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  // Quiz Playing View
  if (generatedQuiz && !showResults) {
    const currentQuestion = generatedQuiz.questions[currentQuestionIdx];
    const selectedAnswer = quizAnswers[currentQuestion.id];
    const progress = ((currentQuestionIdx + 1) / generatedQuiz.questions.length) * 100;

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="glass-panel p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">{generatedQuiz.quiz_title}</h1>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="outline">{generatedQuiz.category}</Badge>
                <Badge variant="outline">{generatedQuiz.difficulty}</Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Question</div>
              <div className="text-3xl font-bold font-mono text-primary">
                {currentQuestionIdx + 1}/{generatedQuiz.questions.length}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-muted/20 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <Card className="glass-panel p-8">
          <div className="flex items-center space-x-2 mb-4">
            <Badge variant="outline" className="text-xs">
              {currentQuestion.cialdini_principle}
            </Badge>
          </div>

          <h2 className="text-xl font-bold mb-6">
            {currentQuestion.question}
          </h2>

          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswerSelect(currentQuestion.id, idx)}
                className={`w-full p-4 text-left rounded-lg border transition-colors ${selectedAnswer === idx
                    ? 'bg-primary/10 border-primary/50'
                    : 'bg-muted/10 border-muted/30 hover:border-primary/30'
                  }`}
                data-testid={`ai-quiz-option-${idx}`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedAnswer === idx
                      ? 'border-primary bg-primary'
                      : 'border-muted-foreground'
                    }`}>
                    {selectedAnswer === idx && (
                      <div className="w-2 h-2 bg-background rounded-full" />
                    )}
                  </div>
                  <span>{option.text}</span>
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIdx === 0}
          >
            Previous
          </Button>

          <div className="text-sm text-muted-foreground">
            {Object.keys(quizAnswers).length}/{generatedQuiz.questions.length} answered
          </div>

          {currentQuestionIdx < generatedQuiz.questions.length - 1 ? (
            <Button onClick={handleNext}>
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={Object.keys(quizAnswers).length !== generatedQuiz.questions.length}
              className="bg-tertiary hover:bg-tertiary/90 text-background"
              data-testid="submit-ai-quiz-btn"
            >
              Submit Quiz
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Initial Setup View
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">🤖 AI-Generated Challenge</h1>
        <p className="text-muted-foreground font-mono">
          Generate custom social engineering quizzes powered by AI
        </p>
      </div>

      {!llmConfigured && (
        <Card className="glass-panel p-6 border-warning/50">
          <div className="flex items-start space-x-4">
            <AlertTriangle className="w-6 h-6 text-warning mt-1" />
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-2">LLM Not Configured</h3>
              <p className="text-sm text-muted-foreground mb-4">
                You need to configure an LLM API key to use AI-generated challenges.
              </p>
              <Button onClick={() => navigate('/settings')}>
                Go to Settings
              </Button>
            </div>
          </div>
        </Card>
      )}

      {llmConfigured && (
        <Card className="glass-panel p-8">
          <Zap className="w-16 h-16 text-warning mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-center mb-2">Berikan Challenge Soal</h2>
          <p className="text-center text-muted-foreground mb-8">
            AI akan generate soal pilihan ganda tentang social engineering
          </p>

          <div className="space-y-6">
            {/* Mode Selection */}
            <div>
              <label className="block text-sm font-medium mb-3">Mode Simulasi:</label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setChallengeMode('quiz')}
                  className={`p-4 rounded-lg border transition-colors ${challengeMode === 'quiz'
                      ? 'bg-primary text-background border-primary'
                      : 'bg-muted/10 border-muted/30 hover:border-primary/50'
                    }`}
                >
                  <div className="font-bold mb-1">📝 Quiz</div>
                  <div className="text-xs opacity-80">Multiple choice questions</div>
                </button>
                <button
                  onClick={() => setChallengeMode('conversation')}
                  className={`p-4 rounded-lg border transition-colors ${challengeMode === 'conversation'
                      ? 'bg-primary text-background border-primary'
                      : 'bg-muted/10 border-muted/30 hover:border-primary/50'
                    }`}
                >
                  <div className="font-bold mb-1">💬 Percakapan</div>
                  <div className="text-xs opacity-80">Interactive conversation</div>
                </button>
                <button
                  onClick={() => setChallengeMode('scenario')}
                  className={`p-4 rounded-lg border transition-colors ${challengeMode === 'scenario'
                      ? 'bg-primary text-background border-primary'
                      : 'bg-muted/10 border-muted/30 hover:border-primary/50'
                    }`}
                >
                  <div className="font-bold mb-1">🎯 Skenario</div>
                  <div className="text-xs opacity-80">Story-based challenge</div>
                </button>
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium mb-3">Kategori Challenge:</label>
              <div className="grid grid-cols-5 gap-3">
                {['phishing', 'pretexting', 'baiting', 'ceo_fraud', 'tech_support'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-lg border transition-colors text-sm ${selectedCategory === cat
                        ? 'bg-primary text-background border-primary'
                        : 'bg-muted/10 border-muted/30 hover:border-primary/50'
                      }`}
                  >
                    {cat.replace('_', ' ').toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Number of Questions */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Jumlah Soal:</label>
                <Select value={numQuestions.toString()} onValueChange={(val) => setNumQuestions(parseInt(val))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 soal</SelectItem>
                    <SelectItem value="10">10 soal</SelectItem>
                    <SelectItem value="15">15 soal</SelectItem>
                    <SelectItem value="20">20 soal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-sm font-medium mb-2">Tingkat Kesulitan:</label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy (Mudah)</SelectItem>
                    <SelectItem value="medium">Medium (Sedang)</SelectItem>
                    <SelectItem value="hard">Hard (Sulit)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Button
            size="lg"
            onClick={generateQuiz}
            disabled={generating}
            className="w-full mt-8 uppercase tracking-wider"
            data-testid="generate-challenge-btn"
          >
            {generating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Generating {numQuestions} questions...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 mr-2" />
                Generate {numQuestions} Questions
              </>
            )}
          </Button>
        </Card>
      )}
    </div>
  );
}
