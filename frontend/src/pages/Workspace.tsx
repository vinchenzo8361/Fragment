import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Upload, 
  ArrowLeft, 
  Layers, 
  Grid, 
  Play, 
  HelpCircle, 
  FileImage, 
  Sparkles,
  Eye,
  SlidersHorizontal,
  CheckCircle2,
  Wand2,
  Trash2,
  Tag
} from 'lucide-react';
import { getProject, uploadImage, deleteImage } from '../api';
import { 
  solve2x2Puzzle, 
  extractAndCleanTiles, 
  generateJigsawPieces 
} from '../puzzleSolver';
import type { SolvedPuzzleResult } from '../puzzleSolver';

const Workspace = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // AI Hint / Guidance
  const [aiPromptHint, setAiPromptHint] = useState('');

  // Puzzle Solver state
  const [solverGridRows, setSolverGridRows] = useState(2);
  const [solverGridCols, setSolverGridCols] = useState(2);
  const [solving, setSolving] = useState(false);
  const [solveResult, setSolveResult] = useState<SolvedPuzzleResult | null>(null);
  const [activeCandidateIdx, setActiveCandidateIdx] = useState(0);
  const [showWhereItGoes, setShowWhereItGoes] = useState(false);
  const [showNumbersOnTiles, setShowNumbersOnTiles] = useState(false);

  // Puzzle Creator state
  const [creatorGridSize, setCreatorGridSize] = useState(4); // 2 to 20
  const [creatorStyle, setCreatorStyle] = useState<'tiles' | 'jigsaw'>('tiles');
  const [createdTiles, setCreatedTiles] = useState<string[]>([]);
  const [generatingCreator, setGeneratingCreator] = useState(false);
  const [showCreatorLabels, setShowCreatorLabels] = useState(false);

  const fetchProject = () => {
    if (id) {
      getProject(id)
        .then(res => setProject(res.data))
        .catch(console.error);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && id) {
      setUploading(true);
      setSolveResult(null);
      setCreatedTiles([]);
      try {
        await uploadImage(id, e.target.files[0]);
        fetchProject();
      } catch (err) {
        console.error(err);
        alert('Image upload failed.');
      } finally {
        setUploading(false);
      }
    }
  };

  const handleDeleteImage = async (e: React.MouseEvent, imgId: string) => {
    e.stopPropagation();
    if (!id) return;
    if (window.confirm('Delete this uploaded image?')) {
      await deleteImage(id, imgId);
      setSelectedImageIndex(0);
      setSolveResult(null);
      setCreatedTiles([]);
      fetchProject();
    }
  };

  const activeImage = project?.images && project.images.length > 0 
    ? project.images[selectedImageIndex] || project.images[0] 
    : null;

  // Run Solver
  const handleSolve = async () => {
    if (!activeImage) return;
    setSolving(true);
    try {
      const imgSrc = activeImage.original_path.startsWith('data:') 
        ? activeImage.original_path 
        : `http://localhost:8000/${activeImage.original_path}`;

      const res = await solve2x2Puzzle(imgSrc, aiPromptHint);
      setSolveResult(res);
      setActiveCandidateIdx(0);
      setShowWhereItGoes(false); // start with clean image
      setShowNumbersOnTiles(false);
    } catch (err) {
      console.error(err);
      alert('Error during solving. Make sure the uploaded image is valid.');
    } finally {
      setSolving(false);
    }
  };

  // Run Puzzle Creator
  const handleGenerateCreatorTiles = async () => {
    if (!activeImage) return;
    setGeneratingCreator(true);
    try {
      const imgSrc = activeImage.original_path.startsWith('data:') 
        ? activeImage.original_path 
        : `http://localhost:8000/${activeImage.original_path}`;

      if (creatorStyle === 'jigsaw') {
        const jigsawUrls = await generateJigsawPieces(imgSrc, creatorGridSize);
        setCreatedTiles(jigsawUrls);
      } else {
        const { tileDataUrls } = await extractAndCleanTiles(imgSrc, creatorGridSize, creatorGridSize);
        setCreatedTiles(tileDataUrls);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingCreator(false);
    }
  };

  if (!project) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
        Loading project workspace...
      </div>
    );
  }

  const isCreatorMode = project.puzzle_type === 'puzzle-creator';

  return (
    <div className="workspace-wrapper">
      {/* Top Application Bar */}
      <div className="workspace-toolbar">
        <div className="workspace-identity">
          <Link to="/projects" className="btn btn-secondary" style={{ padding: '0.35rem 0.6rem' }} title="Back to Projects">
            <ArrowLeft size={15} color="var(--text-primary)" />
          </Link>
          <span className="workspace-title">{project.name}</span>
          <span className="gold-badge">
            {project.puzzle_type.toUpperCase()}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
            {project.id}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
          {isCreatorMode ? (
            <button 
              onClick={handleGenerateCreatorTiles} 
              disabled={!activeImage || generatingCreator}
              className="btn btn-primary" 
              style={{ padding: '0.45rem 1.1rem', fontSize: '0.85rem' }}
            >
              <Wand2 size={15} />
              <span>{generatingCreator ? 'Generating Cut...' : `Generate ${creatorGridSize}×${creatorGridSize} Puzzle`}</span>
            </button>
          ) : (
            <button 
              onClick={handleSolve} 
              disabled={!activeImage || solving}
              className="btn btn-primary" 
              style={{ padding: '0.45rem 1.1rem', fontSize: '0.85rem' }}
            >
              <Play size={15} fill="#fff" color="#fff" />
              <span>{solving ? 'Analyzing Permutations...' : 'Solve & Reconstruct'}</span>
            </button>
          )}
        </div>
      </div>

      {/* 3-Panel IDE Workbench */}
      <div className="workspace-grid-layout">
        {/* Left: Input Assets & AI Hint */}
        <aside className="sidebar-panel">
          <div className="panel-titlebar">
            <span>1. Source Media</span>
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--gold-primary)', fontWeight: 700 }}>
              {project.images ? project.images.length : 0}
            </span>
          </div>

          <div className="panel-scrollable">
            {/* Upload Box */}
            <div className="upload-zone">
              <input 
                type="file" 
                onChange={handleFileUpload} 
                accept="image/*" 
                disabled={uploading}
              />
              <Upload size={22} color="var(--gold-primary)" style={{ marginBottom: '0.4rem' }} />
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#111215' }}>
                {uploading ? 'Processing Image...' : 'Click or Drop Image'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                Auto-strips tabletop & frame borders
              </div>
            </div>

            {/* AI Nudge Input (Available for all solvers) */}
            {!isCreatorMode && (
              <div style={{ background: 'var(--bg-offwhite)', padding: '0.85rem', borderRadius: 8, border: '1px solid var(--border-light)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', fontWeight: 700, color: '#111215', marginBottom: '0.35rem' }}>
                  <Sparkles size={14} color="var(--gold-primary)" />
                  <span>AI Prompt: What is this image?</span>
                </label>
                <input 
                  type="text" 
                  value={aiPromptHint} 
                  onChange={(e) => setAiPromptHint(e.target.value)}
                  placeholder="e.g. blue car in front of mountains"
                  className="form-input"
                  style={{ fontSize: '0.8rem', padding: '0.5rem 0.65rem' }}
                />
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  Instructs the solver on semantic features (sky on top, road at bottom).
                </div>
              </div>
            )}

            {/* List of images with delete support */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {project.images && project.images.length > 0 ? (
                project.images.map((img: any, idx: number) => (
                  <div 
                    key={img.id} 
                    className="image-record-item"
                    onClick={() => {
                      setSelectedImageIndex(idx);
                      setSolveResult(null);
                      setCreatedTiles([]);
                    }}
                    style={{ 
                      cursor: 'pointer',
                      borderColor: selectedImageIndex === idx ? 'var(--gold-primary)' : 'var(--border-light)',
                      backgroundColor: selectedImageIndex === idx ? 'var(--gold-subtle-bg)' : '#ffffff'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 1, overflow: 'hidden' }}>
                      {img.original_path && img.original_path.startsWith('data:') ? (
                        <img 
                          src={img.original_path} 
                          alt="Thumbnail" 
                          style={{ width: 34, height: 34, objectFit: 'cover', borderRadius: 4, border: '1px solid var(--border-light)' }} 
                        />
                      ) : (
                        <FileImage size={20} color="var(--gold-primary)" />
                      )}
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        <div style={{ fontWeight: 600, color: '#111215', fontSize: '0.825rem' }}>{img.filename}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                          {img.width && img.height ? `${img.width}×${img.height} px` : 'Loaded'}
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={(e) => handleDeleteImage(e, img.id)}
                      title="Delete Image"
                      style={{ 
                        background: 'transparent', 
                        border: 'none', 
                        cursor: 'pointer', 
                        color: 'var(--text-muted)',
                        padding: '4px'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '1.25rem 0', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                  No images uploaded yet.
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Center: Live Interactive Canvas Viewport */}
        <main className="canvas-container" style={{ overflow: 'auto', padding: '2rem' }}>
          {activeImage ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem', width: '100%' }}>
              
              {/* Creator Mode View */}
              {isCreatorMode ? (
                createdTiles.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', width: '100%' }}>
                    {/* Toolbar for Creator */}
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', background: '#ffffff', padding: '0.5rem 1rem', borderRadius: 8, border: '1px solid var(--border-light)' }}>
                      <button 
                        onClick={() => setShowCreatorLabels(!showCreatorLabels)}
                        className={`btn ${showCreatorLabels ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
                      >
                        <Tag size={14} />
                        <span>{showCreatorLabels ? 'Hide Piece Numbers' : 'Where Does Each Item Go? (Numbers)'}</span>
                      </button>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {creatorGridSize}×{creatorGridSize} Grid ({createdTiles.length} Pieces)
                      </span>
                    </div>

                    {/* Pieces Container (Pieces keep their natural size and expand outwards instead of shrinking!) */}
                    <div style={{ 
                      display: 'grid',
                      gridTemplateColumns: `repeat(${creatorGridSize}, auto)`,
                      gap: creatorStyle === 'jigsaw' ? '-12px' : '4px',
                      background: '#ffffff',
                      padding: '1.5rem',
                      borderRadius: 12,
                      border: '1px solid var(--border-light)',
                      boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
                      maxWidth: '100%',
                      overflow: 'auto'
                    }}>
                      {createdTiles.map((tile, i) => (
                        <div key={i} style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <img 
                            src={tile} 
                            alt={`Piece ${i + 1}`} 
                            style={{ 
                              width: creatorStyle === 'jigsaw' ? '80px' : '65px',
                              height: creatorStyle === 'jigsaw' ? '80px' : '65px',
                              objectFit: 'contain', 
                              display: 'block' 
                            }} 
                          />
                          {showCreatorLabels && (
                            <div style={{
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)',
                              background: 'rgba(184, 134, 11, 0.95)',
                              color: '#fff',
                              fontWeight: 800,
                              fontSize: '0.75rem',
                              width: '22px',
                              height: '22px',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
                              pointerEvents: 'none'
                            }}>
                              {i + 1}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ 
                      background: '#ffffff', 
                      padding: '0.75rem', 
                      borderRadius: 8, 
                      border: '1px solid var(--border-light)', 
                      boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
                      display: 'inline-block'
                    }}>
                      <img 
                        src={activeImage.original_path.startsWith('data:') ? activeImage.original_path : `http://localhost:8000/${activeImage.original_path}`} 
                        alt="Source"
                        style={{ maxHeight: '55vh', maxWidth: '55vh', objectFit: 'contain' }}
                      />
                    </div>
                    <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      Adjust the slider in the right panel and click <strong>Generate Puzzle Pieces</strong>!
                    </div>
                  </div>
                )
              ) : (
                /* Solver Mode View */
                solveResult ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem', width: '100%' }}>
                    {/* Controls Bar for Solver */}
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', background: '#ffffff', padding: '0.5rem 1rem', borderRadius: 8, border: '1px solid var(--border-light)', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', flexWrap: 'wrap' }}>
                      <button 
                        onClick={() => setShowWhereItGoes(!showWhereItGoes)}
                        className={`btn ${showWhereItGoes ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
                      >
                        <Eye size={14} />
                        <span>{showWhereItGoes ? 'Back to Clean Reconstructed Image' : 'Where Does Each Item Go?'}</span>
                      </button>

                      {showWhereItGoes && (
                        <button 
                          onClick={() => setShowNumbersOnTiles(!showNumbersOnTiles)}
                          className={`btn ${showNumbersOnTiles ? 'btn-primary' : 'btn-secondary'}`}
                          style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
                        >
                          <Tag size={14} />
                          <span>{showNumbersOnTiles ? 'Hide Numbers' : 'Show Piece Numbers [1,2,3,4]'}</span>
                        </button>
                      )}

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        <span style={{ fontWeight: 600 }}>Options:</span>
                        {solveResult.topCandidates.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setActiveCandidateIdx(idx)}
                            style={{
                              padding: '0.25rem 0.65rem',
                              borderRadius: 4,
                              border: activeCandidateIdx === idx ? '1px solid var(--gold-primary)' : '1px solid var(--border-light)',
                              background: activeCandidateIdx === idx ? 'var(--gold-subtle-bg)' : '#ffffff',
                              color: activeCandidateIdx === idx ? 'var(--gold-primary)' : 'var(--text-secondary)',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            Option #{idx + 1}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Side-by-Side Where It Goes View */}
                    {showWhereItGoes ? (
                      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
                        {/* 1. Input Scrambled with Optional Number Badges */}
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', color: '#111215' }}>
                            Scrambled Input Image
                          </div>
                          <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(2, 1fr)', 
                            gap: '3px', 
                            background: '#111215', 
                            padding: '4px', 
                            borderRadius: 8,
                            width: '260px',
                            height: '260px'
                          }}>
                            {solveResult.sourceTiles.map((tile, i) => (
                              <div key={i} style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
                                <img src={tile} alt={`Input Piece ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                {showNumbersOnTiles && (
                                  <div style={{
                                    position: 'absolute',
                                    top: 6,
                                    left: 6,
                                    background: '#d4af37',
                                    color: '#000',
                                    fontWeight: 800,
                                    fontSize: '0.85rem',
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 2px 6px rgba(0,0,0,0.5)'
                                  }}>
                                    {i + 1}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Arrow */}
                        <div style={{ fontSize: '1.8rem', color: 'var(--gold-primary)', fontWeight: 800 }}>➔</div>

                        {/* 2. Solved Layout with Optional Placement Badges */}
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', color: '#111215' }}>
                            Reconstructed Original
                          </div>
                          <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(2, 1fr)', 
                            gap: '0px', 
                            background: '#ffffff', 
                            padding: '2px', 
                            borderRadius: 8,
                            border: '1px solid var(--border-light)',
                            width: '260px',
                            height: '260px'
                          }}>
                            {solveResult.topCandidates[activeCandidateIdx].placement.map((item, slotIdx) => (
                              <div key={slotIdx} style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
                                <img 
                                  src={solveResult.sourceTiles[item.tileIndex]} 
                                  alt={`Placed ${item.tileIndex + 1}`} 
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                />
                                {showNumbersOnTiles && (
                                  <div style={{
                                    position: 'absolute',
                                    top: 6,
                                    left: 6,
                                    background: '#10b981',
                                    color: '#fff',
                                    fontWeight: 800,
                                    fontSize: '0.85rem',
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 2px 6px rgba(0,0,0,0.5)'
                                  }}>
                                    {item.tileIndex + 1}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Pure Clean Reconstructed Image Without Seam Lines */
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ 
                          background: '#ffffff', 
                          padding: '0.5rem', 
                          borderRadius: 8, 
                          border: '1px solid var(--border-light)', 
                          boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
                          display: 'inline-block'
                        }}>
                          <img 
                            src={solveResult.stitchedDataUrl} 
                            alt="Clean Reconstructed Output" 
                            style={{ maxHeight: '68vh', maxWidth: '68vh', objectFit: 'contain', borderRadius: 4 }}
                          />
                        </div>
                        <div style={{ marginTop: '0.65rem', display: 'flex', gap: '0.5rem', justifyContent: 'center', alignItems: 'center' }}>
                          <CheckCircle2 size={16} color="#10b981" />
                          <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#111215' }}>
                            Clean Reconstructed Car (Rank Option #{activeCandidateIdx + 1})
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ 
                      background: '#ffffff', 
                      padding: '0.75rem', 
                      borderRadius: 8, 
                      border: '1px solid var(--border-light)', 
                      boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
                      display: 'inline-block'
                    }}>
                      <img 
                        src={activeImage.original_path.startsWith('data:') ? activeImage.original_path : `http://localhost:8000/${activeImage.original_path}`} 
                        alt={activeImage.filename}
                        style={{ maxHeight: '55vh', maxWidth: '55vh', objectFit: 'contain' }}
                      />
                    </div>
                    <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      Scrambled image loaded. Click <strong>Solve & Reconstruct</strong> to assemble the pieces!
                    </div>
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="canvas-placeholder-box">
              <Grid size={40} color="var(--gold-primary)" style={{ margin: '0 auto 0.75rem' }} />
              <h3 style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.4rem', color: '#111215' }}>
                Reconstruction Canvas
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                Upload any picture or scrambled puzzle on the left panel to begin.
              </p>
            </div>
          )}
        </main>

        {/* Right: Inspector & Mode Controls */}
        <aside className="sidebar-panel-right">
          <div className="panel-titlebar">
            <span>2. {isCreatorMode ? 'Creator Controls' : 'Solver Inspector'}</span>
            <HelpCircle size={15} color="var(--text-secondary)" />
          </div>

          <div className="panel-scrollable">
            {isCreatorMode ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ background: 'var(--bg-offwhite)', padding: '1rem', borderRadius: 8, border: '1px solid var(--border-light)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: 'var(--gold-primary)', fontWeight: 700, fontSize: '0.85rem' }}>
                    <SlidersHorizontal size={16} />
                    <span>Piece Density Slider (2 to 20)</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, color: '#111215', marginBottom: '0.35rem' }}>
                    <span>Grid Size: {creatorGridSize}×{creatorGridSize}</span>
                    <span>{creatorGridSize * creatorGridSize} Total Pieces</span>
                  </div>

                  <input 
                    type="range" 
                    min={2} 
                    max={20} 
                    value={creatorGridSize} 
                    onChange={(e) => setCreatorGridSize(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--gold-primary)', cursor: 'pointer' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    <span>2×2 (4)</span>
                    <span>10×10 (100)</span>
                    <span>20×20 (400)</span>
                  </div>
                </div>

                <div style={{ background: 'var(--bg-offwhite)', padding: '1rem', borderRadius: 8, border: '1px solid var(--border-light)' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#111215', display: 'block', marginBottom: '0.5rem' }}>
                    Piece Cut Style
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      onClick={() => setCreatorStyle('tiles')}
                      className={`btn ${creatorStyle === 'tiles' ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ flex: 1, padding: '0.45rem', fontSize: '0.75rem' }}
                    >
                      Square Tiles
                    </button>
                    <button 
                      onClick={() => setCreatorStyle('jigsaw')}
                      className={`btn ${creatorStyle === 'jigsaw' ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ flex: 1, padding: '0.45rem', fontSize: '0.75rem' }}
                    >
                      Classic Jigsaw (Tabs)
                    </button>
                  </div>
                </div>

                <button 
                  onClick={handleGenerateCreatorTiles}
                  disabled={!activeImage || generatingCreator}
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                >
                  <Wand2 size={16} />
                  <span>Generate Puzzle Pieces</span>
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ background: 'var(--bg-offwhite)', padding: '1rem', borderRadius: 8, border: '1px solid var(--border-light)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem', color: 'var(--gold-primary)', fontWeight: 700, fontSize: '0.85rem' }}>
                    <Grid size={16} />
                    <span>Grid Partition</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Rows</span>
                      <input 
                        type="number" 
                        min={2} 
                        max={10} 
                        value={solverGridRows} 
                        onChange={(e) => {
                          setSolverGridRows(Number(e.target.value));
                          setSolveResult(null);
                        }} 
                        className="form-input" 
                        style={{ padding: '0.35rem 0.5rem', fontSize: '0.85rem', marginTop: '0.2rem' }}
                      />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Columns</span>
                      <input 
                        type="number" 
                        min={2} 
                        max={10} 
                        value={solverGridCols} 
                        onChange={(e) => {
                          setSolverGridCols(Number(e.target.value));
                          setSolveResult(null);
                        }} 
                        className="form-input" 
                        style={{ padding: '0.35rem 0.5rem', fontSize: '0.85rem', marginTop: '0.2rem' }}
                      />
                    </div>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Total pieces: <strong>{solverGridRows * solverGridCols}</strong>
                  </div>
                </div>

                <div style={{ background: 'var(--bg-offwhite)', padding: '1rem', borderRadius: 8, border: '1px solid var(--border-light)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--gold-primary)', fontWeight: 700, fontSize: '0.85rem' }}>
                    <Layers size={16} />
                    <span>Solver Status</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    Grid: <strong>{solverGridRows}×{solverGridCols} ({solverGridRows * solverGridCols} Pieces)</strong><br/>
                    Status: <strong>{solveResult ? 'Solved (Top 5 Ranked)' : 'Awaiting Execution'}</strong>
                  </div>
                </div>

                {solveResult && (
                  <div style={{ background: '#ffffff', padding: '1rem', borderRadius: 8, border: '1px solid var(--border-light)' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#111215', marginBottom: '0.5rem' }}>
                      Reconstructed Placement Map
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {solveResult.topCandidates[activeCandidateIdx].placement.map((item, slotIdx) => (
                        <div key={slotIdx} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0', borderBottom: '1px solid #f0f0f0' }}>
                          <span>Target Slot {slotIdx + 1}</span>
                          <span style={{ fontWeight: 700, color: 'var(--gold-primary)' }}>Source Tile #{item.tileIndex + 1}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Workspace;
