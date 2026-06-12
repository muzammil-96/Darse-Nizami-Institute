import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageCircle, Send, User, CheckCircle, ChevronDown, Book, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface QABoardProps {
  classId: string;
  books: string[];
}

interface Reply {
  id: string;
  author: string;
  role: "instructor" | "student";
  content: string;
  date: string;
}

interface Question {
  id: string;
  title: string;
  content: string;
  book: string;
  author: string;
  date: string;
  resolved: boolean;
  replies: Reply[];
}

export function QABoard({ classId, books }: QABoardProps) {
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "q1",
      title: "Clarification on types of Murakkab",
      content: "Could someone explain the exact difference between Murakkab Mufid and Ghayr Mufid with some examples from our recent lecture?",
      book: books[0] || "General",
      author: "Abdullah",
      date: "2 hours ago",
      resolved: true,
      replies: [
        {
          id: "r1",
          author: "Ustad Rahman",
          role: "instructor",
          content: "Walikum Assalam Abdullah. A Murakkab Mufid is a complete sentence giving a clear meaning (e.g., Zaid is standing). A Ghayr Mufid is incomplete (e.g., The book of Zaid). Review section 2 of the uploaded PDF for more examples.",
          date: "1 hour ago",
        }
      ]
    },
    {
      id: "q2",
      title: "Is it required to memorize the poem in Chapter 3?",
      content: "I am having trouble with the Arabic pronunciation. Are we expected to memorize the entire verse for the exam?",
      book: books[1] || "General",
      author: "Omar",
      date: "Yesterday",
      resolved: false,
      replies: []
    }
  ]);

  const [showAskForm, setShowAskForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [selectedBook, setSelectedBook] = useState(books[0] || "General");
  const [expandedQId, setExpandedQId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const handleAskQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newQ: Question = {
      id: `q${Date.now()}`,
      title: newTitle,
      content: newContent,
      book: selectedBook,
      author: "Student (You)",
      date: "Just now",
      resolved: false,
      replies: []
    };

    setQuestions([newQ, ...questions]);
    setShowAskForm(false);
    setNewTitle("");
    setNewContent("");
  };

  const handleReply = (qId: string) => {
    if (!replyContent.trim()) return;
    
    setQuestions(questions.map(q => {
      if (q.id === qId) {
        return {
          ...q,
          replies: [...q.replies, {
            id: `r${Date.now()}`,
            author: "Student (You)",
            role: "student",
            content: replyContent,
            date: "Just now"
          }]
        };
      }
      return q;
    }));
    setReplyContent("");
  };

  return (
    <div className="flex flex-col h-full bg-midnight-ink/30 rounded-xl border border-glass-border overflow-hidden">
      <div className="p-6 border-b border-glass-border flex justify-between items-center bg-midnight-ink/50">
        <div>
          <h3 className="text-xl font-playfair text-parchment flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-gold-primary" />
            Class Discussion Board
          </h3>
          <p className="text-sm text-parchment/60 mt-1">Ask questions and discuss topics with instructors and peers.</p>
        </div>
        <button
          onClick={() => setShowAskForm(true)}
          className="px-6 py-2 bg-gold-primary hover:bg-gold-light text-midnight-ink font-semibold rounded transition-colors shadow-lg"
        >
          Ask a Question
        </button>
      </div>

      <AnimatePresence>
        {showAskForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-b border-glass-border overflow-hidden bg-glass-white"
          >
            <form onSubmit={handleAskQuestion} className="p-6 space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-gold-light font-playfair text-lg">New Question</h4>
                <button type="button" onClick={() => setShowAskForm(false)} className="text-parchment/40 hover:text-parchment">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm text-parchment/70 mb-1">Question Title</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-midnight-ink border border-glass-border rounded px-4 py-2 text-parchment focus:border-gold-primary outline-none"
                    placeholder="Briefly summarize your question"
                  />
                </div>
                <div>
                  <label className="block text-sm text-parchment/70 mb-1">Related Book</label>
                  <select
                    value={selectedBook}
                    onChange={(e) => setSelectedBook(e.target.value)}
                    className="w-full bg-midnight-ink border border-glass-border rounded px-4 py-2 text-parchment focus:border-gold-primary outline-none"
                  >
                    {books.map(b => <option key={b} value={b}>{b}</option>)}
                    <option value="General">General Class Topic</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-parchment/70 mb-1">Details</label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  rows={4}
                  className="w-full bg-midnight-ink border border-glass-border rounded px-4 py-2 text-parchment focus:border-gold-primary outline-none resize-none"
                  placeholder="Explain what you are struggling with..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAskForm(false)}
                  className="px-4 py-2 text-sm text-parchment/70 hover:text-parchment"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-accent hover:bg-emerald-light text-white rounded text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Post Question
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {questions.length === 0 ? (
          <div className="text-center py-10 text-parchment/40">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>No questions yet. Be the first to ask!</p>
          </div>
        ) : (
          questions.map((q) => (
            <div key={q.id} className="bg-midnight-ink/50 border border-glass-border rounded-lg overflow-hidden transition-colors hover:border-gold-primary/30">
              <div 
                className="p-5 cursor-pointer"
                onClick={() => setExpandedQId(expandedQId === q.id ? null : q.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    {q.resolved && <CheckCircle className="w-4 h-4 text-emerald-light" />}
                    <h4 className={cn("text-lg font-medium", q.resolved ? "text-parchment" : "text-gold-light")}>
                      {q.title}
                    </h4>
                  </div>
                  <span className="text-xs text-parchment/40">{q.date}</span>
                </div>
                
                <p className="text-sm text-parchment/70 line-clamp-2 mb-4">{q.content}</p>
                
                <div className="flex justify-between items-center text-xs text-parchment/50">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5" />
                      {q.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Book className="w-3.5 h-3.5" />
                      <span className="font-arabic" dir="rtl">{q.book}</span>
                    </span>
                  </div>
                  <span className="flex items-center gap-1 text-gold-primary font-medium">
                    {q.replies.length} Replies
                    <ChevronDown className={cn("w-4 h-4 transition-transform", expandedQId === q.id ? "rotate-180" : "")} />
                  </span>
                </div>
              </div>

              <AnimatePresence>
                {expandedQId === q.id && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    className="overflow-hidden border-t border-glass-border bg-midnight-ink/30"
                  >
                    <div className="p-5 space-y-4">
                      {q.replies.map(r => (
                        <div key={r.id} className="flex gap-3">
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                            r.role === "instructor" ? "bg-gold-primary text-midnight-ink" : "bg-glass-border text-parchment"
                          )}>
                            <User className="w-4 h-4" />
                          </div>
                          <div className="flex-1 bg-midnight-ink border border-glass-border rounded-lg p-3">
                            <div className="flex justify-between items-center mb-1">
                              <span className={cn(
                                "text-xs font-semibold px-2 py-0.5 rounded uppercase tracking-wider",
                                r.role === "instructor" ? "bg-gold-primary/20 text-gold-light" : "bg-glass-white text-parchment/60"
                              )}>
                                {r.role === "instructor" ? "Instructor" : "Student"}
                              </span>
                              <span className="text-xs text-parchment/40">{r.date}</span>
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm font-medium text-parchment">{r.author}</span>
                            </div>
                            <p className="text-sm text-parchment/80 leading-relaxed">{r.content}</p>
                          </div>
                        </div>
                      ))}

                      <div className="flex gap-3 mt-4 pt-4 border-t border-glass-border">
                        <div className="w-8 h-8 rounded-full bg-glass-border flex items-center justify-center shrink-0 text-parchment">
                          <User className="w-4 h-4" />
                        </div>
                        <div className="flex-1 relative">
                          <input
                            type="text"
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleReply(q.id)}
                            placeholder="Write a reply..."
                            className="w-full bg-midnight-ink border border-glass-border rounded-full pl-4 pr-12 py-2 text-sm text-parchment outline-none focus:border-gold-primary"
                          />
                          <button
                            onClick={() => handleReply(q.id)}
                            className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 bg-gold-primary text-midnight-ink rounded-full hover:bg-gold-light transition-colors"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
