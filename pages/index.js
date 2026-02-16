// pages/index.js
import React, { useState, useRef, useEffect } from 'react';
import { Upload, FileText, Trash2, Send, AlertCircle, Loader, Search, Globe, ExternalLink, Book, Video } from 'lucide-react';

export default function RealDonaldTrumpAI() {
  const [documents, setDocuments] = useState([]);
  const [webSources, setWebSources] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isScraping, setIsScraping] = useState(false);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [avatarActive, setAvatarActive] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [videoGeneratingFor, setVideoGeneratingFor] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    
    for (const file of files) {
      if (file.type === 'application/pdf' || file.type === 'text/plain' || file.name.endsWith('.md')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (file.type === 'application/pdf') {
            const base64 = event.target.result.split(',')[1];
            setDocuments(prev => [...prev, {
              name: file.name,
              type: 'pdf',
              content: base64,
              size: file.size
            }]);
          } else {
            setDocuments(prev => [...prev, {
              name: file.name,
              type: 'text',
              content: event.target.result,
              size: file.size
            }]);
          }
        };
        
        if (file.type === 'application/pdf') {
          reader.readAsDataURL(file);
        } else {
          reader.readAsText(file);
        }
      }
    }
    
    e.target.value = '';
  };

  const removeDocument = (index) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const removeWebSource = (index) => {
    setWebSources(prev => prev.filter((_, i) => i !== index));
  };

  const scrapeWebInformation = async () => {
    setIsScraping(true);
    try {
      const searchQueries = [
        'Donald Trump policy positions 2024',
        'Donald Trump official statements',
        'Donald Trump Truth Social recent posts',
        'Donald Trump interview transcripts'
      ];

      // Call backend API instead of direct API call
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ queries: searchQueries })
      });

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      
      if (data.sources) {
        setWebSources(prev => [...prev, ...data.sources]);
      }
      
    } catch (error) {
      console.error('Error scraping web:', error);
      alert('Web search failed. Please try again.');
    } finally {
      setIsScraping(false);
    }
  };

  const activateAvatar = () => {
    if (documents.length === 0 && webSources.length === 0) {
      return;
    }
    setAvatarActive(true);
    setMessages([{
      role: 'system',
      content: `AVATAR ACTIVATED: Donald J. Trump\n\nData Sources:\n• Documents: ${documents.length}\n• Web Sources: ${webSources.length}\n\nThis AI avatar responds based solely on documented public information. All statements are sourced from uploaded documents and verified web sources. This is a simulation for voter education purposes.`
    }]);
  };

  const generateVideo = async (messageText, messageIndex) => {
    setIsGeneratingVideo(true);
    setVideoGeneratingFor(messageIndex);
    
    try {
      // Step 1: Load Trump image
      const imageResponse = await fetch('/trump.jpg');
      const imageBlob = await imageResponse.blob();
      const reader = new FileReader();
      
      const imageBase64 = await new Promise((resolve, reject) => {
        reader.onloadend = () => {
          const base64 = reader.result.split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(imageBlob);
      });

      // Step 2: Create video task
      const createResponse = await fetch('/api/video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create',
          text: messageText,
          imageBase64: imageBase64
        })
      });

      if (!createResponse.ok) {
        throw new Error('Failed to create video task');
      }

      const { taskId } = await createResponse.json();

      // Step 3: Poll for completion
      let videoUrl = null;
      let attempts = 0;
      const maxAttempts = 60; // 5 minutes max

      while (!videoUrl && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
        
        const statusResponse = await fetch('/api/video', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'check',
            taskId: taskId
          })
        });

        if (!statusResponse.ok) {
          throw new Error('Status check failed');
        }

        const statusData = await statusResponse.json();
        
        if (statusData.status === 'completed' && statusData.videoUrl) {
          videoUrl = statusData.videoUrl;
        } else if (statusData.status === 'failed') {
          throw new Error('Video generation failed');
        }
        
        attempts++;
      }

      if (videoUrl) {
        setMessages(prev => prev.map((msg, idx) => 
          idx === messageIndex 
            ? { ...msg, videoUrl } 
            : msg
        ));
      } else {
        throw new Error('Video generation timed out');
      }

    } catch (error) {
      console.error('Error generating video:', error);
      alert(`Video generation failed: ${error.message}`);
    } finally {
      setIsGeneratingVideo(false);
      setVideoGeneratingFor(null);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isProcessing) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsProcessing(true);

    try {
      // Build system prompt
      let systemPrompt = `You are an AI avatar representing Donald J. Trump for educational and voter information purposes. You must respond based ONLY on the information provided in the documents and web sources below.

CRITICAL INSTRUCTIONS:
1. Answer questions based solely on documented evidence
2. Cite your sources by referencing document names or URLs
3. If information isn't in the provided sources, clearly state that
4. Maintain a factual, informational tone
5. When presenting Trump's positions, quote or paraphrase from sources and cite them
6. Do not make up information or speculate
7. Format citations as: [Source: document name or URL]

AVAILABLE INFORMATION:

`;

      if (documents.length > 0) {
        systemPrompt += `UPLOADED DOCUMENTS:\n`;
        for (const doc of documents) {
          systemPrompt += `\n--- ${doc.name} ---\n`;
          if (doc.type === 'text') {
            systemPrompt += doc.content + '\n';
          } else if (doc.type === 'pdf') {
            systemPrompt += '[PDF content will be provided]\n';
          }
        }
      }

      if (webSources.length > 0) {
        systemPrompt += `\nWEB SOURCES:\n`;
        for (const source of webSources) {
          systemPrompt += `\n--- ${source.title} ---\nURL: ${source.url}\nSummary: ${source.summary}\n`;
        }
      }

      systemPrompt += `\nNow answer the following question based on the above sources. Always cite which source you're drawing from.`;

      // Build conversation history
      const apiMessages = [];
      
      messages.forEach(msg => {
        if (msg.role !== 'system') {
          apiMessages.push({
            role: msg.role,
            content: msg.content
          });
        }
      });
      
      apiMessages.push({
        role: 'user',
        content: userMessage
      });

      // Call backend API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: apiMessages,
          systemPrompt: systemPrompt,
          documents: documents.filter(d => d.type === 'pdf')
        })
      });

      if (!response.ok) {
        throw new Error('Chat request failed');
      }

      const data = await response.json();
      
      if (data.content && data.content[0]) {
        const aiResponse = data.content[0].text;
        setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
      } else {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: 'Error: Unable to generate response. Please try again.' 
        }]);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Error: ${error.message}` 
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const resetAvatar = () => {
    setAvatarActive(false);
    setMessages([]);
  };

  if (showDisclaimer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8 font-sans flex items-center justify-center">
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@400;500;600;700&display=swap');
          
          .title-font { font-family: 'Playfair Display', serif; }
          .body-font { font-family: 'Inter', sans-serif; }
        `}</style>
        
        <div className="max-w-2xl bg-white rounded-xl shadow-2xl p-8 border border-slate-200">
          <div className="text-center mb-6">
            <AlertCircle className="mx-auto mb-4 text-blue-600" size={48} />
            <h1 className="title-font text-4xl font-black mb-2 text-slate-900">
              realdonaldtrump.ai
            </h1>
            <p className="body-font text-slate-600 font-semibold">
              AI-Powered Political Information Tool
            </p>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-6 rounded-r-lg">
            <h2 className="body-font font-bold text-lg text-slate-900 mb-3">
              Important Disclaimer
            </h2>
            <ul className="body-font text-slate-700 space-y-2 text-sm leading-relaxed">
              <li>• This is an <strong>AI simulation</strong>, not Donald Trump or an official representative</li>
              <li>• All responses are based on <strong>publicly documented information only</strong></li>
              <li>• This tool is for <strong>educational and voter information purposes</strong></li>
              <li>• Sources are cited for all statements made by the AI</li>
              <li>• This is not endorsed by or affiliated with Donald Trump, his campaign, or any political organization</li>
              <li>• Users should verify important information through official sources</li>
            </ul>
          </div>

          <div className="bg-slate-50 p-6 rounded-lg mb-6">
            <h3 className="body-font font-semibold text-slate-900 mb-2">
              What This Tool Does:
            </h3>
            <p className="body-font text-slate-700 text-sm leading-relaxed mb-3">
              Upload documents or scrape web sources about Donald Trump's policies, statements, and positions. 
              Ask questions and receive factual answers based on documented evidence with proper citations.
            </p>
            <p className="body-font text-slate-700 text-sm leading-relaxed">
              This helps voters make informed decisions by providing easy access to a candidate's documented record.
            </p>
          </div>

          <div className="flex items-start space-x-3 mb-6">
            <input
              type="checkbox"
              id="accept"
              className="mt-1"
              onChange={(e) => e.target.checked && setShowDisclaimer(false)}
            />
            <label htmlFor="accept" className="body-font text-sm text-slate-700">
              I understand this is an AI simulation for educational purposes, and I will verify important information through official sources.
            </label>
          </div>

          <button
            onClick={() => setShowDisclaimer(false)}
            className="w-full bg-blue-600 text-white body-font font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continue to Tool
          </button>
        </div>
      </div>
    );
  }

  if (!avatarActive) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8 font-sans">
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@400;500;600;700&display=swap');
          
          .title-font { font-family: 'Playfair Display', serif; }
          .body-font { font-family: 'Inter', sans-serif; }
        `}</style>
        
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="title-font text-5xl font-black mb-2 text-slate-900">
              realdonaldtrump.ai
            </h1>
            <p className="body-font text-slate-600 text-lg">
              Fact-Based Political Information • Source-Verified Answers • AI Video Avatar
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Web Sources Section */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
              <div className="flex items-center mb-4">
                <Globe className="text-blue-600 mr-3" size={24} />
                <h2 className="body-font font-bold text-xl text-slate-900">
                  Web Sources
                </h2>
              </div>
              
              <p className="body-font text-slate-600 text-sm mb-4">
                Automatically search for recent statements, policy positions, and official documents from verified sources.
              </p>

              <button
                onClick={scrapeWebInformation}
                disabled={isScraping}
                className="w-full bg-blue-600 text-white body-font font-semibold py-3 rounded-lg hover:bg-blue-700 disabled:bg-slate-400 transition-colors flex items-center justify-center"
              >
                {isScraping ? (
                  <>
                    <Loader className="animate-spin mr-2" size={18} />
                    Searching Web...
                  </>
                ) : (
                  <>
                    <Search className="mr-2" size={18} />
                    Search Web Sources
                  </>
                )}
              </button>

              {webSources.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="body-font text-slate-700 font-semibold text-sm">
                    {webSources.length} Sources Found
                  </p>
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {webSources.map((source, index) => (
                      <div
                        key={index}
                        className="flex items-start justify-between bg-slate-50 border border-slate-200 rounded p-3 group hover:border-blue-300 transition-all"
                      >
                        <div className="flex-1 min-w-0 pr-2">
                          <p className="body-font text-slate-800 font-medium text-sm truncate mb-1">
                            {source.title}
                          </p>
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="body-font text-blue-600 text-xs hover:underline flex items-center"
                          >
                            <ExternalLink size={12} className="mr-1" />
                            View Source
                          </a>
                        </div>
                        <button
                          onClick={() => removeWebSource(index)}
                          className="text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Document Upload Section */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
              <div className="flex items-center mb-4">
                <Book className="text-blue-600 mr-3" size={24} />
                <h2 className="body-font font-bold text-xl text-slate-900">
                  Upload Documents
                </h2>
              </div>
              
              <p className="body-font text-slate-600 text-sm mb-4">
                Add your own documents: speeches, policy papers, transcripts, or any official materials.
              </p>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.txt,.md"
                onChange={handleFileUpload}
                className="hidden"
              />
              
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-blue-300 rounded-lg p-6 hover:border-blue-500 hover:bg-blue-50 transition-all group"
              >
                <Upload className="mx-auto mb-2 text-blue-600 group-hover:scale-110 transition-transform" size={32} />
                <p className="body-font text-slate-700 font-medium text-sm">
                  Click to Upload
                </p>
                <p className="body-font text-slate-500 text-xs">
                  PDF, TXT, or MD files
                </p>
              </button>

              {documents.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="body-font text-slate-700 font-semibold text-sm">
                    {documents.length} Document{documents.length !== 1 ? 's' : ''} Uploaded
                  </p>
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {documents.map((doc, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded p-3 group hover:border-blue-300 transition-all"
                      >
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <FileText className="text-blue-600 flex-shrink-0" size={18} />
                          <div className="flex-1 min-w-0">
                            <p className="body-font text-slate-800 font-medium text-sm truncate">
                              {doc.name}
                            </p>
                            <p className="body-font text-slate-500 text-xs">
                              {(doc.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeDocument(index)}
                          className="text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={activateAvatar}
            disabled={documents.length === 0 && webSources.length === 0}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white body-font font-bold text-xl py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed transition-all shadow-lg"
          >
            {documents.length === 0 && webSources.length === 0
              ? 'Add Sources to Continue'
              : 'Activate AI Avatar →'}
          </button>

          <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="body-font text-amber-900 text-sm">
              <strong>Reminder:</strong> This AI provides information based on documented sources only. 
              Always verify important information through official channels. This tool is not affiliated with any political campaign.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Chat Interface
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col font-sans">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@400;500;600;700&display=swap');
        
        .title-font { font-family: 'Playfair Display', serif; }
        .body-font { font-family: 'Inter', sans-serif; }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .message-enter {
          animation: fade-in-up 0.3s ease-out;
        }
      `}</style>
      
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-4 shadow-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h2 className="title-font text-2xl font-black text-slate-900">
              realdonaldtrump.ai
            </h2>
            <p className="body-font text-slate-600 text-sm mt-1">
              {documents.length + webSources.length} sources loaded • AI Video Avatar Ready
            </p>
          </div>
          <button
            onClick={resetAvatar}
            className="body-font text-sm px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-100 transition-all font-medium"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message-enter ${
                message.role === 'system'
                  ? 'bg-blue-50 border border-blue-200 p-4 rounded-lg'
                  : message.role === 'user'
                  ? 'ml-auto max-w-[75%]'
                  : 'mr-auto max-w-[75%]'
              }`}
            >
              {message.role === 'system' ? (
                <div>
                  <p className="body-font text-blue-700 font-semibold text-sm mb-2">
                    System Message
                  </p>
                  <p className="body-font text-slate-700 whitespace-pre-wrap text-sm leading-relaxed">
                    {message.content}
                  </p>
                </div>
              ) : message.role === 'user' ? (
                <div className="bg-slate-200 border border-slate-300 rounded-lg p-4">
                  <p className="body-font text-slate-600 font-semibold text-xs mb-1">
                    Your Question
                  </p>
                  <p className="body-font text-slate-900">
                    {message.content}
                  </p>
                </div>
              ) : (
                <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
                  <p className="body-font text-blue-700 font-semibold text-xs mb-2">
                    AI Response (Based on Sources)
                  </p>
                  <p className="body-font text-slate-800 leading-relaxed whitespace-pre-wrap mb-3">
                    {message.content}
                  </p>
                  
                  {message.videoUrl ? (
                    <div className="mt-4">
                      <video 
                        controls 
                        className="w-full rounded-lg"
                        src={message.videoUrl}
                      />
                    </div>
                  ) : (
                    <button
                      onClick={() => generateVideo(message.content, index)}
                      disabled={isGeneratingVideo}
                      className="flex items-center space-x-2 text-sm bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:bg-slate-400 transition-colors"
                    >
                      {isGeneratingVideo && videoGeneratingFor === index ? (
                        <>
                          <Loader className="animate-spin" size={16} />
                          <span>Generating Video...</span>
                        </>
                      ) : (
                        <>
                          <Video size={16} />
                          <span>Generate Video Response</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
          
          {isProcessing && (
            <div className="mr-auto max-w-[75%] bg-white border border-slate-200 rounded-lg p-4 shadow-sm message-enter">
              <p className="body-font text-blue-700 font-semibold text-xs mb-2">
                AI Response (Based on Sources)
              </p>
              <div className="flex items-center space-x-2">
                <Loader className="animate-spin text-blue-600" size={16} />
                <p className="body-font text-slate-600 italic">Analyzing sources...</p>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-slate-200 p-4 shadow-lg sticky bottom-0">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end space-x-3 mb-2">
            <div className="flex-1">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about policies, positions, statements..."
                rows={2}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-3 text-slate-900 body-font focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none transition-all"
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isProcessing}
              className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all"
            >
              <Send size={20} />
            </button>
          </div>
          <p className="body-font text-slate-500 text-xs">
            Press Enter to send • Click "Generate Video Response" to create AI talking head video
          </p>
        </div>
      </div>
    </div>
  );
}
