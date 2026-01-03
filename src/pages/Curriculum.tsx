import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Curriculum.css';

interface Slide {
  id: number;
  title: string;
  content: string;
}

interface CurriculumFile {
  id: string;
  name: string;
  uploadedAt: string;
  slides: Slide[];
  preQuizUrl?: string;
  postQuizUrl?: string;
  googleSlidesUrl?: string;
  topic?: string;
  subtopics?: string[];
}

interface QuizLinks {
  [fileId: string]: {
    preQuizUrl: string;
    postQuizUrl: string;
    googleSlidesUrl: string;
  };
}

// Global database storage keys (shared across all users)
// NOTE: Data is now stored in a static JSON file in the public folder
// Uses import.meta.env.BASE_URL to work both locally and on GitHub Pages
const PRESENTATIONS_URL = `${import.meta.env.BASE_URL}presentations.json`;

const Curriculum: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [files, setFiles] = useState<CurriculumFile[]>([]);
  const [quizLinks, setQuizLinks] = useState<QuizLinks>({});
  const [editingQuizId, setEditingQuizId] = useState<string | null>(null);
  const [tempPreUrl, setTempPreUrl] = useState<string>('');
  const [tempPostUrl, setTempPostUrl] = useState<string>('');
  const [tempGoogleSlidesUrl, setTempGoogleSlidesUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<CurriculumFile | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [googleSlidesName, setGoogleSlidesName] = useState<string>('');
  const [googleSlidesEmbedUrl, setGoogleSlidesEmbedUrl] = useState<string>('');
  const [googleSlidesPreQuiz, setGoogleSlidesPreQuiz] = useState<string>('');
  const [googleSlidesPostQuiz, setGoogleSlidesPostQuiz] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Function to load presentations from static file
  const loadPresentations = async () => {
    try {
      setLoading(true);
      console.log('Loading presentations from:', PRESENTATIONS_URL);
      const response = await fetch(PRESENTATIONS_URL);
      console.log('Fetch response status:', response.status);
      
      if (response.ok) {
        const presentations = await response.json();
        console.log('Loaded presentations:', presentations);
        setFiles(presentations);
        
        // If a presentation was selected, update it if it still exists
        setSelectedFile((prevSelected) => {
          if (prevSelected) {
            const updatedSelected = presentations.find((p: CurriculumFile) => p.id === prevSelected.id);
            return updatedSelected || null;
          }
          return null;
        });
        
        // Extract quiz links from presentations
        const quizzes: QuizLinks = {};
        presentations.forEach((p: any) => {
          if (p.preQuizUrl || p.postQuizUrl || p.googleSlidesUrl) {
            quizzes[p.id] = {
              preQuizUrl: p.preQuizUrl || '',
              postQuizUrl: p.postQuizUrl || '',
              googleSlidesUrl: p.googleSlidesUrl || ''
            };
          }
        });
        setQuizLinks(quizzes);
      }
    } catch (error) {
      console.error('Error loading presentations:', error);
      setFiles([]);
      setQuizLinks({});
    } finally {
      setLoading(false);
    }
  };

  // Load presentations on component mount and when user changes
  useEffect(() => {
    loadPresentations();
    
    // Only auto-refresh if no presentation is selected
    // This prevents interrupting user while they're viewing
    const refreshInterval = setInterval(() => {
      if (!selectedFile) {
        loadPresentations();
      }
    }, user?.role === 'admin' ? 15000 : 10000);

    return () => clearInterval(refreshInterval);
  }, [user?.uid, user?.role]);

  // Save presentations to server whenever files change (only for admins)
  useEffect(() => {
    if (files.length === 0 || user?.role !== 'admin') return;
    
    // Note: With static JSON file, presentations are read-only
    // Admins would need to manually edit the public/presentations.json file
    console.log('Admin presentations:', files);
  }, [files, user?.role]);

  // Save quiz links to server whenever they change
  useEffect(() => {
    if (Object.keys(quizLinks).length === 0) return;

    // Note: With static JSON file, quiz links are read-only
    console.log('Updated quiz links:', quizLinks);
  }, [quizLinks]);

  const handleAddGoogleSlides = () => {
    alert('With static JSON file storage, presentations are read-only. To add presentations, please edit the public/presentations.json file and reload the page.');
  };

  const nextSlide = () => {
    if (selectedFile && currentSlide < selectedFile.slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const deleteFile = async (id: string) => {
    // With static JSON file, deletion would require manual file editing
    alert('To delete presentations, please edit the public/presentations.json file and reload the page.');
    console.log('Presentation to delete:', id);
  };

  const toggleFullscreen = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsFullscreen(!isFullscreen);
  };

  const startEditingQuiz = (fileId: string) => {
    const current = quizLinks[fileId] || { preQuizUrl: '', postQuizUrl: '', googleSlidesUrl: '' };
    setTempPreUrl(current.preQuizUrl);
    setTempPostUrl(current.postQuizUrl);
    setTempGoogleSlidesUrl(current.googleSlidesUrl);
    setEditingQuizId(fileId);
  };

  const saveQuizLinks = (fileId: string) => {
    setQuizLinks({
      ...quizLinks,
      [fileId]: {
        preQuizUrl: tempPreUrl,
        postQuizUrl: tempPostUrl,
        googleSlidesUrl: tempGoogleSlidesUrl
      }
    });
    setEditingQuizId(null);
  };

  const getQuizLinks = (fileId: string) => {
    return quizLinks[fileId] || { preQuizUrl: '', postQuizUrl: '' };
  };

  return (
    <div className="curriculum-container">
      <nav className="navbar">
        <div className="nav-content">
          <h1 style={{ cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>🏛️ Relics Reimagined</h1>
          <div className="nav-right">
            <span className="user-info">Welcome, {user?.displayName || 'Explorer'}! <span style={{ fontSize: '12px', color: '#ddd' }}>({user?.role === 'admin' ? '👨‍💼 Admin' : '👤 Customer'})</span></span>
            <button className="refresh-btn" onClick={loadPresentations} title="Refresh presentations">🔄</button>
            <button className="back-btn" onClick={() => navigate('/dashboard')}>← Back</button>
          </div>
        </div>
      </nav>

      <div className="curriculum-content">
        <h2>📚 Curriculum & Learning Materials</h2>
        <p className="subtitle">Upload and view PowerPoint presentations about archaeology</p>

        {loading && <div style={{ textAlign: 'center', padding: '20px', color: '#667eea' }}>⏳ Loading presentations...</div>}

        <div className={`curriculum-layout ${isFullscreen ? 'fullscreen-active' : ''}`}>
          {/* Left Panel: File List */}
          <div className="files-panel">
            {user?.role === 'admin' && (
              <div className="upload-section google-slides-section">
                <h3>🎬 Add Google Slides</h3>
                <div className="upload-box">
                  <input
                    type="text"
                    placeholder="Enter presentation name"
                    value={googleSlidesName}
                    onChange={(e) => setGoogleSlidesName(e.target.value)}
                    className="text-input"
                  />
                  <input
                    type="url"
                    placeholder="Paste Google Slides URL (any format)"
                    value={googleSlidesEmbedUrl}
                    onChange={(e) => setGoogleSlidesEmbedUrl(e.target.value)}
                    className="text-input"
                  />
                  <input
                    type="url"
                    placeholder="Pre-Quiz Google Form URL (optional)"
                    value={googleSlidesPreQuiz}
                    onChange={(e) => setGoogleSlidesPreQuiz(e.target.value)}
                    className="text-input"
                  />
                  <input
                    type="url"
                    placeholder="Post-Quiz Google Form URL (optional)"
                    value={googleSlidesPostQuiz}
                    onChange={(e) => setGoogleSlidesPostQuiz(e.target.value)}
                    className="text-input"
                  />
                  <button 
                    className="upload-btn google-slides-btn"
                    onClick={handleAddGoogleSlides}
                    disabled={!googleSlidesName.trim() || !googleSlidesEmbedUrl.trim()}
                  >
                    ➕ Add Presentation
                  </button>
                  <div className="file-note">
                    <strong>How to use:</strong> Copy the link from Share button (edit/view URL works) - we automatically convert it for embedding
                  </div>
                </div>
              </div>
            )}

            <div className="files-list-section">
              <h3>📁 Available Presentations ({files.length})</h3>
              <div className="files-list">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className={`file-item ${selectedFile?.id === file.id ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedFile(file);
                      setCurrentSlide(0);
                    }}
                  >
                    <div className="file-info">
                      <div className="file-name">📄 {file.name}</div>
                      <div className="file-meta">
                        {file.uploadedAt}
                      </div>
                    </div>
                    {user?.role === 'admin' && (
                      <button
                        className="delete-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteFile(file.id);
                        }}
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel: Slide Viewer */}
          <div className="viewer-panel">
            {selectedFile ? (
              <>
                <div 
                  className={`slide-viewer ${isFullscreen ? 'fullscreen' : ''}`}
                  onClick={(e) => {
                    if (e.target === e.currentTarget) {
                      e.preventDefault();
                      e.stopPropagation();
                    }
                  }}
                >
                  <div className="presentation-header">
                    <h3 className="presentation-title">📊 {selectedFile.name}</h3>
                    <button 
                      type="button"
                      className="fullscreen-btn" 
                      onClick={toggleFullscreen}
                      title="Toggle fullscreen"
                    >
                      {isFullscreen ? '⛶' : '⛶'}
                    </button>
                  </div>
                  
                  {/* Show slides if array is not empty, otherwise show Google Slides embed */}
                  {selectedFile.slides.length > 0 ? (
                    <div 
                      className="slide-content"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (e.target instanceof HTMLAnchorElement) {
                          e.target.click();
                        }
                      }}
                    >
                      <div className="slide">
                        <div className="slide-title">
                          {selectedFile.slides[currentSlide].title}
                        </div>
                        <div className="slide-body">
                          {selectedFile.slides[currentSlide].content}
                        </div>
                      </div>
                    </div>
                  ) : (
                    getQuizLinks(selectedFile.id).googleSlidesUrl && (
                      <div className="google-slides-main-container">
                        <iframe
                          src={getQuizLinks(selectedFile.id).googleSlidesUrl}
                          width="100%"
                          height="600"
                          frameBorder="0"
                          allow="fullscreen; autoplay; presentation"
                          allowFullScreen
                          sandbox="allow-same-origin allow-scripts allow-popups allow-popups-to-escape-sandbox allow-presentation"
                          title="Google Slides Presentation"
                        ></iframe>
                      </div>
                    )
                  )}

                  {/* Slide Controls (only show if slides array is not empty) */}
                  {selectedFile.slides.length > 0 && (
                    <>
                      <div className="slide-controls">
                        <button
                          className="nav-btn"
                          onClick={prevSlide}
                          disabled={currentSlide === 0}
                        >
                          ← Previous
                        </button>
                        <div className="slide-counter">
                          Slide {currentSlide + 1} of {selectedFile.slides.length}
                        </div>
                        <button
                          className="nav-btn"
                          onClick={nextSlide}
                          disabled={currentSlide === selectedFile.slides.length - 1}
                        >
                          Next →
                        </button>
                      </div>

                      <div className="slide-thumbnails">
                        {selectedFile.slides.map((slide, index) => (
                          <div
                            key={slide.id}
                            className={`thumbnail ${index === currentSlide ? 'active' : ''}`}
                            onClick={() => setCurrentSlide(index)}
                          >
                            <div className="thumb-number">{index + 1}</div>
                            <div className="thumb-title">{slide.title}</div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {/* Quiz Section */}
                  <div className="quiz-section">
                    <h3>📋 Assessment Quizzes</h3>
                    {editingQuizId === selectedFile.id ? (
                      <div className="quiz-edit-form">
                        <div className="quiz-input-group">
                          <label>Pre-Quiz Google Form URL:</label>
                          <input
                            type="url"
                            placeholder="https://forms.gle/..."
                            value={tempPreUrl}
                            onChange={(e) => setTempPreUrl(e.target.value)}
                            className="quiz-input"
                          />
                        </div>
                        <div className="quiz-input-group">
                          <label>Post-Quiz Google Form URL:</label>
                          <input
                            type="url"
                            placeholder="https://forms.gle/..."
                            value={tempPostUrl}
                            onChange={(e) => setTempPostUrl(e.target.value)}
                            className="quiz-input"
                          />
                        </div>
                        <div className="quiz-input-group">
                          <label>Google Slides Embed URL:</label>
                          <input
                            type="url"
                            placeholder="https://docs.google.com/presentation/d/YOUR_PRESENTATION_ID/embed"
                            value={tempGoogleSlidesUrl}
                            onChange={(e) => setTempGoogleSlidesUrl(e.target.value)}
                            className="quiz-input"
                          />
                          <small className="input-hint">Copy the embed link from Google Slides (Share → Embed)</small>
                        </div>
                        <div className="quiz-edit-buttons">
                          <button className="save-quiz-btn" onClick={() => saveQuizLinks(selectedFile.id)}>
                            ✓ Save
                          </button>
                          <button className="cancel-quiz-btn" onClick={() => setEditingQuizId(null)}>
                            ✕ Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="quiz-display">
                        <div className="quiz-links">
                          {getQuizLinks(selectedFile.id).preQuizUrl ? (
                            <a 
                              href={getQuizLinks(selectedFile.id).preQuizUrl} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="quiz-link pre-quiz"
                              onClick={() => {}}
                            >
                              <span className="quiz-icon">📝</span>
                              <span className="quiz-text">Take Pre-Quiz</span>
                              <span className="external-icon">↗</span>
                            </a>
                          ) : (
                            <div className="quiz-link no-link">
                              <span className="quiz-icon">📝</span>
                              <span className="quiz-text">Pre-Quiz Not Available</span>
                            </div>
                          )}
                          {getQuizLinks(selectedFile.id).postQuizUrl ? (
                            <a 
                              href={getQuizLinks(selectedFile.id).postQuizUrl} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="quiz-link post-quiz"
                              onClick={() => {}}
                            >
                              <span className="quiz-icon">✅</span>
                              <span className="quiz-text">Take Post-Quiz</span>
                              <span className="external-icon">↗</span>
                            </a>
                          ) : (
                            <div className="quiz-link no-link">
                              <span className="quiz-icon">✅</span>
                              <span className="quiz-text">Post-Quiz Not Available</span>
                            </div>
                          )}
                        </div>
                        {user?.role === 'admin' && (
                          <button className="edit-quiz-btn" onClick={() => startEditingQuiz(selectedFile.id)}>
                            ✎ Edit Links
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📚</div>
                <h3>No Presentation Added Yet</h3>
                <p>Add a Google Slides presentation from the left panel to get started</p>
                <p style={{ fontSize: '12px', marginTop: '10px', color: '#999' }}>
                  💡 Tip: Enter the presentation name and Google Slides embed URL to add it to your curriculum
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Features Info */}
        <div className="features-info">
          <h3>✨ Features</h3>
          <div className="features-grid">
            <div className="feature-box">
              <h4>📤 Upload</h4>
              <p>Upload PowerPoint presentations and PDF files</p>
            </div>
            <div className="feature-box">
              <h4>👁️ View</h4>
              <p>View slides in a clean, easy-to-read format</p>
            </div>
            <div className="feature-box">
              <h4>📊 Navigate</h4>
              <p>Move through slides and jump to specific slides</p>
            </div>
            <div className="feature-box">
              <h4>📚 Learn</h4>
              <p>Educational content about archaeology and history</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Curriculum;
