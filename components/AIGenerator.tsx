import React, { useState } from 'react';
import { generateQuestionsAI } from '../services/geminiService';
import { Sparkles, Download, Copy, Loader2, FileText, CheckCircle2, PlayCircle, Trophy, RotateCcw, XCircle } from 'lucide-react';
import { Question } from '../types';
import { useLanguage } from '../LanguageContext';

const AIGenerator: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [count, setCount] = useState(5);
  const [difficulty, setDifficulty] = useState('MEDIUM');
  const [stage, setStage] = useState('PREP');
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const { t } = useLanguage();

  // Quiz Mode State
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleGenerate = async () => {
    if (!topic) return;
    setLoading(true);
    // Reset Quiz state
    setIsQuizMode(false);
    setQuizSubmitted(false);
    setUserAnswers({});
    
    try {
      const generated = await generateQuestionsAI(topic, count, stage, difficulty);
      setQuestions(generated);
    } catch (error) {
      console.error(error);
      alert('Error generating content');
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = () => {
    setIsQuizMode(true);
    setQuizSubmitted(false);
    setUserAnswers({});
  };

  const handleAnswerSelect = (questionId: string, optionIndex: number) => {
    if (quizSubmitted) return;
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleSubmitQuiz = () => {
    let correctCount = 0;
    questions.forEach(q => {
      if (userAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setQuizSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-darkgray border border-gold-700/30 rounded-xl p-6 shadow-lg shadow-black/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-full bg-gold-500/10 border border-gold-500/20">
            <Sparkles className="w-6 h-6 text-gold-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{t('aiGenerator')}</h2>
            <p className="text-gray-400 text-sm">Create and simulate exams using AI</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Controls */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Topic</label>
              <textarea 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter topic..."
                className="w-full h-32 bg-black/40 border border-gray-700 rounded-lg p-3 text-white focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none resize-none"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Count</label>
                <input 
                  type="number" 
                  min="1" 
                  max="50"
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  className="w-full bg-black/40 border border-gray-700 rounded-lg p-2 text-white focus:border-gold-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Stage</label>
                <select 
                  value={stage}
                  onChange={(e) => setStage(e.target.value)}
                  className="w-full bg-black/40 border border-gray-700 rounded-lg p-2 text-white focus:border-gold-500 outline-none"
                >
                  <option value="PRIMARY">Primary</option>
                  <option value="PREP">Prep</option>
                  <option value="SECONDARY">Secondary</option>
                </select>
              </div>
            </div>

            <div>
               <label className="block text-sm font-medium text-gray-300 mb-1">Difficulty</label>
               <div className="flex gap-2 bg-black/40 p-1 rounded-lg border border-gray-700">
                  {['EASY', 'MEDIUM', 'HARD'].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setDifficulty(lvl)}
                      className={`flex-1 py-2 text-xs font-bold rounded transition-colors ${
                        difficulty === lvl ? 'bg-gold-600 text-black' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
               </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !topic}
              className="w-full py-3 bg-gradient-to-r from-gold-600 to-gold-500 text-black font-bold rounded-lg hover:from-gold-500 hover:to-gold-400 transition-all shadow-lg shadow-gold-900/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Sparkles className="w-5 h-5" />}
              {loading ? 'Generating...' : 'Generate Questions'}
            </button>
          </div>

          {/* Results / Quiz Area */}
          <div className="bg-black/20 rounded-xl p-4 border border-white/5 overflow-y-auto max-h-[500px] scrollbar-thin relative">
            {questions.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-500">
                <FileText className="w-12 h-12 mb-2 opacity-20" />
                <p>Questions will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                 <div className="flex justify-between items-center mb-4 sticky top-0 bg-darkgray z-10 p-2 border-b border-gray-700">
                    <h3 className="text-white font-bold">
                       {isQuizMode ? (quizSubmitted ? `${t('score')}: ${score}/${questions.length}` : t('startQuiz')) : `Questions (${questions.length})`}
                    </h3>
                    {!isQuizMode ? (
                        <button onClick={handleStartQuiz} className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-sm flex items-center gap-1">
                            <PlayCircle className="w-4 h-4" /> {t('startQuiz')}
                        </button>
                    ) : quizSubmitted && (
                        <button onClick={handleStartQuiz} className="text-gray-400 hover:text-white flex items-center gap-1 text-sm">
                            <RotateCcw className="w-4 h-4" /> {t('tryAgain')}
                        </button>
                    )}
                 </div>

                 {questions.map((q, idx) => {
                   const userAnswer = userAnswers[q.id];
                   const isCorrect = userAnswer === q.correctAnswer;
                   
                   return (
                     <div key={q.id} className={`p-4 rounded-lg border transition-colors ${
                        isQuizMode && quizSubmitted
                          ? isCorrect 
                             ? 'bg-green-900/10 border-green-500/50' 
                             : 'bg-red-900/10 border-red-500/50'
                          : 'bg-darkgray border-gray-800'
                     }`}>
                       <div className="flex justify-between gap-2 mb-2">
                         <span className="text-gold-500 font-bold text-sm">Q{idx+1}</span>
                         {isQuizMode && quizSubmitted && (
                            isCorrect 
                              ? <span className="text-green-400 text-xs flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> {t('correct')}</span>
                              : <span className="text-red-400 text-xs flex items-center gap-1"><XCircle className="w-3 h-3" /> {t('wrong')}</span>
                         )}
                       </div>
                       <p className="text-white mb-3 text-sm font-semibold">{q.text}</p>
                       
                       <div className="space-y-1">
                         {q.options.map((opt, i) => {
                           let optionClass = "bg-black/30 text-gray-400 border-transparent";
                           if (isQuizMode) {
                              if (quizSubmitted) {
                                  if (i === q.correctAnswer) optionClass = "bg-green-900/30 text-green-200 border-green-500/50";
                                  else if (i === userAnswer) optionClass = "bg-red-900/30 text-red-200 border-red-500/50";
                              } else {
                                  if (i === userAnswer) optionClass = "bg-gold-600/20 text-gold-200 border-gold-500";
                                  else optionClass = "bg-black/30 text-gray-400 hover:bg-white/5 cursor-pointer";
                              }
                           } else {
                              // View mode
                              if (i === q.correctAnswer) optionClass = "bg-green-900/20 text-green-200 border-green-800";
                           }

                           return (
                             <div 
                               key={i} 
                               onClick={() => isQuizMode && handleAnswerSelect(q.id, i)}
                               className={`p-2 rounded text-xs flex items-center justify-between border ${optionClass}`}
                             >
                                <span>{opt}</span>
                                {isQuizMode ? (
                                   <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${i === userAnswer ? 'border-gold-500 bg-gold-500' : 'border-gray-600'}`}>
                                      {i === userAnswer && <div className="w-2 h-2 bg-black rounded-full" />}
                                   </div>
                                ) : (
                                   i === q.correctAnswer && <CheckCircle2 className="w-3 h-3 text-green-500" />
                                )}
                             </div>
                           );
                         })}
                       </div>
                       
                       {(!isQuizMode || quizSubmitted) && (
                           <p className="mt-2 text-xs text-gray-500 border-t border-gray-800 pt-2 animate-fadeIn">
                             <span className="text-gold-700">Explanation: </span> {q.explanation}
                           </p>
                       )}
                     </div>
                   );
                 })}

                 {isQuizMode && !quizSubmitted && (
                    <button 
                      onClick={handleSubmitQuiz}
                      className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg shadow-lg flex items-center justify-center gap-2"
                    >
                       <CheckCircle2 className="w-5 h-5" /> {t('submitQuiz')}
                    </button>
                 )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIGenerator;
