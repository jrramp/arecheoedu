import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { saveArtifactConfig } from '../utils/artifactGenerator';
import { parsePPTX, parsePDF } from '../utils/pptxParser';
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

const Curriculum: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [files, setFiles] = useState<CurriculumFile[]>([]);

  const [selectedFile, setSelectedFile] = useState<CurriculumFile | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [fileInput, setFileInput] = useState<File | null>(null);
  const [googleSlidesName, setGoogleSlidesName] = useState<string>('');
  const [googleSlidesEmbedUrl, setGoogleSlidesEmbedUrl] = useState<string>('');
  const [googleSlidesPreQuiz, setGoogleSlidesPreQuiz] = useState<string>('');
  const [googleSlidesPostQuiz, setGoogleSlidesPostQuiz] = useState<string>('');
  const [quizLinks, setQuizLinks] = useState<QuizLinks>({});
  const [editingQuizId, setEditingQuizId] = useState<string | null>(null);
  const [tempPreUrl, setTempPreUrl] = useState<string>('');
  const [tempPostUrl, setTempPostUrl] = useState<string>('');
  const [tempGoogleSlidesUrl, setTempGoogleSlidesUrl] = useState<string>('');
  const [editingArtifactId, setEditingArtifactId] = useState<string | null>(null);
  const [artifactTopic, setArtifactTopic] = useState<string>('');
  const [artifactSubtopics, setArtifactSubtopics] = useState<string>('');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileInput(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!fileInput) return;

    const fileExtension = fileInput.name.split('.').pop()?.toLowerCase();
    
    // Create new file entry
    const newFile: CurriculumFile = {
      id: Date.now().toString(),
      name: fileInput.name.replace('.pptx', '').replace('.ppt', '').replace('.pdf', ''),
      uploadedAt: new Date().toISOString().split('T')[0],
      slides: [
        { 
          id: 1, 
          title: 'Loading Content...', 
          content: `File uploaded: ${fileInput.name}\n\nProcessing ${fileExtension?.toUpperCase()} file...` 
        },
      ]
    };

    setFiles([...files, newFile]);
    setSelectedFile(newFile);
    setCurrentSlide(0);
    setFileInput(null);

    // Parse the file
    if (fileExtension === 'pdf') {
      parsePDF(fileInput).then(slides => {
        setFiles(prev => prev.map(f => 
          f.id === newFile.id ? { ...f, slides: slides.length > 0 ? slides : f.slides } : f
        ));
      });
    } else if (fileExtension === 'pptx' || fileExtension === 'ppt') {
      parsePPTX(fileInput).then(slides => {
        setFiles(prev => prev.map(f => 
          f.id === newFile.id ? { ...f, slides: slides.length > 0 ? slides : f.slides } : f
        ));
      });
    }
  };

  const handleAddGoogleSlides = () => {
    if (!googleSlidesName.trim() || !googleSlidesEmbedUrl.trim()) {
      alert('Please enter both a presentation name and Google Slides URL');
      return;
    }

    // Extract presentation ID from various Google Slides URL formats
    let embedUrl = googleSlidesEmbedUrl;
    
    // Match presentation ID from edit, view, or preview URLs
    const idMatch = googleSlidesEmbedUrl.match(/\/presentation\/d\/([a-zA-Z0-9-_]+)/);
    if (idMatch && idMatch[1]) {
      const presentationId = idMatch[1];
      embedUrl = `https://docs.google.com/presentation/d/${presentationId}/embed?start=false&loop=false&delayms=3000`;
    }

    // Create new presentation entry with Google Slides
    const newPresentation: CurriculumFile = {
      id: Date.now().toString(),
      name: googleSlidesName,
      uploadedAt: new Date().toISOString().split('T')[0],
      slides: [
        { 
          id: 1, 
          title: googleSlidesName, 
          content: 'Google Slides presentation - view the embedded presentation above' 
        },
      ]
    };

    // Add the Google Slides URL and quiz URLs to quiz links
    setQuizLinks({
      ...quizLinks,
      [newPresentation.id]: {
        preQuizUrl: googleSlidesPreQuiz,
        postQuizUrl: googleSlidesPostQuiz,
        googleSlidesUrl: embedUrl
      }
    });

    setFiles([...files, newPresentation]);
    setSelectedFile(newPresentation);
    setCurrentSlide(0);
    setGoogleSlidesName('');
    setGoogleSlidesEmbedUrl('');
    setGoogleSlidesPreQuiz('');
    setGoogleSlidesPostQuiz('');
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

  const deleteFile = (id: string) => {
    setFiles(files.filter(f => f.id !== id));
    if (selectedFile?.id === id) {
      setSelectedFile(null);
      setCurrentSlide(0);
    }
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
          <h1>🏛️ Relics Reimagined</h1>
          <div className="nav-right">
            <span className="user-info">Welcome, {user?.displayName || 'Explorer'}!</span>
            <button className="back-btn" onClick={() => navigate('/dashboard')}>← Back</button>
          </div>
        </div>
      </nav>

      <div className="curriculum-content">
        <h2>📚 Curriculum & Learning Materials</h2>
        <p className="subtitle">Upload and view PowerPoint presentations about archaeology</p>

        <div className="curriculum-layout">
          {/* Left Panel: File List */}
          <div className="files-panel">
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
                        {file.slides.length} slides • {file.uploadedAt}
                      </div>
                    </div>
                    <button
                      className="delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteFile(file.id);
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel: Slide Viewer */}
          <div className="viewer-panel">
            {selectedFile ? (
              <>
                <div className="slide-viewer">
                  <h3 className="presentation-title">📊 {selectedFile.name}</h3>
                  
                  {/* Google Slides Embed Display */}
                  {getQuizLinks(selectedFile.id).googleSlidesUrl && (
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
                  )}

                  {/* Fallback Slide Display (for non-Google Slides presentations) */}
                  {!getQuizLinks(selectedFile.id).googleSlidesUrl && (
                    <div className="slide-content">
                      <div className="slide">
                        <div className="slide-title">
                          {selectedFile.slides[currentSlide].title}
                        </div>
                        <div className="slide-body">
                          {selectedFile.slides[currentSlide].content}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Slide Controls (only show if not Google Slides) */}
                  {!getQuizLinks(selectedFile.id).googleSlidesUrl && (
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
                            <a href={getQuizLinks(selectedFile.id).preQuizUrl} target="_blank" rel="noopener noreferrer" className="quiz-link pre-quiz">
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
                            <a href={getQuizLinks(selectedFile.id).postQuizUrl} target="_blank" rel="noopener noreferrer" className="quiz-link post-quiz">
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
                        <button className="edit-quiz-btn" onClick={() => startEditingQuiz(selectedFile.id)}>
                          ✎ Edit Links
                        </button>
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
