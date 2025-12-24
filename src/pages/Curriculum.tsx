import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { saveArtifactConfig } from '../utils/artifactGenerator';
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
  topic?: string;
  subtopics?: string[];
}

interface QuizLinks {
  [fileId: string]: {
    preQuizUrl: string;
    postQuizUrl: string;
  };
}

const Curriculum: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [files, setFiles] = useState<CurriculumFile[]>([
    {
      id: '1',
      name: 'Introduction to Archaeology',
      uploadedAt: '2025-12-20',
      slides: [
        { id: 1, title: 'What is Archaeology?', content: 'Archaeology is the study of past human societies and cultures through physical remains and artifacts.' },
        { id: 2, title: 'Key Concepts', content: 'Understanding stratigraphy, dating methods, and artifact analysis are fundamental to archaeology.' },
        { id: 3, title: 'Famous Archaeologists', content: 'Learn about the pioneers who shaped modern archaeology and their discoveries.' },
      ]
    },
    {
      id: '2',
      name: 'Archaeological Excavation Techniques',
      uploadedAt: '2025-12-18',
      slides: [
        { id: 1, title: 'Excavation Methods', content: 'There are several methods used in archaeology including stratigraphic excavation and grid systems.' },
        { id: 2, title: 'Documentation', content: 'Proper documentation and photography are crucial for recording findings.' },
        { id: 3, title: 'Safety Protocols', content: 'Safety is paramount in all archaeological fieldwork.' },
      ]
    }
  ]);

  const [selectedFile, setSelectedFile] = useState<CurriculumFile | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [fileInput, setFileInput] = useState<File | null>(null);
  const [quizLinks, setQuizLinks] = useState<QuizLinks>({
    '1': {
      preQuizUrl: 'https://forms.gle/example-pre-quiz-1',
      postQuizUrl: 'https://forms.gle/example-post-quiz-1'
    },
    '2': {
      preQuizUrl: 'https://forms.gle/example-pre-quiz-2',
      postQuizUrl: 'https://forms.gle/example-post-quiz-2'
    }
  });
  const [editingQuizId, setEditingQuizId] = useState<string | null>(null);
  const [tempPreUrl, setTempPreUrl] = useState<string>('');
  const [tempPostUrl, setTempPostUrl] = useState<string>('');
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

    // Demo: Create slides from file name
    const newFile: CurriculumFile = {
      id: Date.now().toString(),
      name: fileInput.name.replace('.pptx', '').replace('.ppt', ''),
      uploadedAt: new Date().toISOString().split('T')[0],
      slides: [
        { id: 1, title: 'Slide 1', content: `Content from ${fileInput.name}` },
        { id: 2, title: 'Slide 2', content: 'Additional content' },
        { id: 3, title: 'Slide 3', content: 'More information' },
      ]
    };

    setFiles([...files, newFile]);
    setFileInput(null);
    setSelectedFile(newFile);
    setCurrentSlide(0);
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
    const current = quizLinks[fileId] || { preQuizUrl: '', postQuizUrl: '' };
    setTempPreUrl(current.preQuizUrl);
    setTempPostUrl(current.postQuizUrl);
    setEditingQuizId(fileId);
  };

  const saveQuizLinks = (fileId: string) => {
    setQuizLinks({
      ...quizLinks,
      [fileId]: {
        preQuizUrl: tempPreUrl,
        postQuizUrl: tempPostUrl
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
            <div className="upload-section">
              <h3>📤 Upload Presentation</h3>
              <div className="upload-box">
                <input
                  type="file"
                  accept=".pptx,.ppt,.pdf"
                  onChange={handleFileSelect}
                  id="file-input"
                  style={{ display: 'none' }}
                />
                <label htmlFor="file-input" className="file-label">
                  {fileInput ? fileInput.name : 'Click to select file'}
                </label>
                <button 
                  className="upload-btn"
                  onClick={handleUpload}
                  disabled={!fileInput}
                >
                  📤 Upload
                </button>
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
                          ✎ Edit Quiz Links
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📊</div>
                <h3>No Presentation Selected</h3>
                <p>Choose a presentation from the list to view its slides</p>
                <p style={{ fontSize: '12px', marginTop: '10px', color: '#999' }}>
                  💡 Tip: You can upload PowerPoint (.pptx, .ppt) or PDF files
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
