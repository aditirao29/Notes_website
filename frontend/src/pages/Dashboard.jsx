import React, {useEffect,useMemo,useState} from "react";
import './Dashboard.css';
import toggle from '../assets/night-mode.png'
import { FaChevronDown, FaSearch, FaPlus, FaFolder, FaFile, FaFolderOpen, FaBars, FaTimes } from 'react-icons/fa';
import API from "../api";
import Editor from "../components/Editor";

function Dashboard() {
  const [folders,setFolders] = useState([]);
  const [notes,setNotes] = useState([]);
  const [selectedFolderId,setSelectedFolderId] = useState(null);
  const [selectedNote,setSelectedNote] = useState(null);
  const [inlineEditFolderId,setInlineEditFolderId] = useState(null);
  const [inlineEditNoteId,setInlineEditNoteId] = useState(null);
  const [studiesOpen, setStudiesOpen] = useState(true);
  const [todoOpen, setTodoOpen] = useState(false);
  const [journalOpen, setJournalOpen] = useState(false);
  const [otherOpen, setOtherOpen] = useState(false);
  const [showNewFolderMenu, setShowNewFolderMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    loadRoot();
  },[]);
  
  async function loadRoot() {
    const {data} = await API.get("/folders");
    setFolders(data || []);
    setNotes([]);
    setSelectedFolderId(null);
    setSelectedNote(null);
  }

  async function loadFolder(folderId) {
    const {data} = await API.get(`/folders/${folderId}`);
    setNotes(data.notes || []);
    setSelectedFolderId(folderId);
    setSelectedNote(null);
    // Close mobile menu when folder is selected
    setIsMobileMenuOpen(false);
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNewFolder = async (category) => {
    try {
      const res = await API.post("/folders", { name: "Untitled Folder", category });
      await loadRoot();
      setInlineEditFolderId(res.data._id);
      setShowNewFolderMenu(false);
    } catch (err) {
      console.error("Error creating folder:", err);
    }
  };

  async function renameFolder(id,newName) {
    if(!newName.trim())
      newName = "Untitled";
    const {data} = await API.patch(`/folders/${id}`,{name:newName});
    setFolders((prev) => prev.map((f) => (f._id===id ? data:f)));
    setInlineEditFolderId(null);
  }

  async function handleNewNote() {
    if(!selectedFolderId)
      return;
    
    const selectedFolder = folders.find(f => f._id === selectedFolderId);
    const isTodoFolder = selectedFolder?.category === "todo";
    
    const noteData = {
      title: "Untitled",
      folder: selectedFolderId,
    };
    
    if (isTodoFolder) {
      noteData.checklistItems = [{ id: Date.now(), text: "", completed: false }];
    } else {
      noteData.content = "";
    }
    
    const {data} = await API.post("/notes", noteData);
    setNotes((prev) => [data, ...prev]);
    setInlineEditNoteId(data._id);
    setSelectedNote(data);
  }

  async function renameNote(id,newTitle) {
    if(!newTitle.trim())
      newTitle = 'Untitled';
    const {data} = await API.patch(`/notes/${id}`,{title:newTitle});
    setNotes((prev) => prev.map((n) => (n._id === id ? data : n)));
    setSelectedNote((n) => (n && n._id === id ? data : n));
    setInlineEditNoteId(null);
  }

  const renderFolderList = (category, open, toggleOpen, title) => (
    <>
      <div className="section-title" onClick={toggleOpen}>
        <span className="section-title-text">
          {open ? <FaFolderOpen className="section-icon" /> : <FaFolder className="section-icon" />}
          {title}
        </span>
        <FaChevronDown className={`chevron ${open ? "open" : ""}`} />
      </div>
      {open && (
        <div className="folder-list-nested">
          {folders.filter((f) => f.category === category).map((f) => (
            <div
              key={f._id}
              className={`folder-item ${
                selectedFolderId === f._id ? "active" : ""
              }`}
              onClick={() => loadFolder(f._id)}
            >
              <div className="folder-item-content">
                <FaFolder className="folder-icon" />
                {inlineEditFolderId === f._id ? (
                  <input
                    className="folder-edit-input"
                    autoFocus
                    defaultValue={f.name}
                    onClick={(e) => e.stopPropagation()}
                    onBlur={(e) => renameFolder(f._id, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") e.currentTarget.blur();
                      if (e.key === "Escape") setInlineEditFolderId(null);
                    }}
                  />
                ) : (
                  <span
                    className="folder-name"
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      setInlineEditFolderId(f._id);
                    }}
                  >
                    {f.name}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );

  const breadcrumbs = useMemo(() => {
    if (!selectedFolderId) return ["My Folders"];
    const selectedFolder = folders.find(f => f._id === selectedFolderId);
    return ["My Folders", selectedFolder ? selectedFolder.name : "Unknown Folder"];
  }, [selectedFolderId, folders]);

  return (
    <div className="dashboard-container">
      {isMobileMenuOpen && (
        <div 
          className="sidebar-overlay active" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      <aside className={`sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="mobile-sidebar-header">
          <button 
            className="mobile-close-btn"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <FaTimes />
          </button>
        </div>
        <div className="new-folder-wrapper">
          <button 
            className="new-folder-btn" 
            onClick={() => setShowNewFolderMenu(!showNewFolderMenu)}
          >
            + New Folder
          </button>

          {showNewFolderMenu && (
            <div className="new-folder-menu">
              <div onClick={() => handleNewFolder("studies")}>New Study Folder</div>
              <div onClick={() => handleNewFolder("todo")}>New To-Do List</div>
              <div onClick={() => handleNewFolder("journal")}>New Daily Journal</div>
              <div onClick={() => handleNewFolder("other")}>Other Folder</div>
            </div>
          )}
        </div>

        <hr/>
        <nav className="folder-nav">
          {renderFolderList("studies",studiesOpen, () => setStudiesOpen(!studiesOpen),"Studies")}
          {renderFolderList("todo", todoOpen, () => setTodoOpen(!todoOpen), "To-Do Lists")}
          {renderFolderList("journal", journalOpen, () => setJournalOpen(!journalOpen),"Daily Journal")}
          {renderFolderList("other", otherOpen, () => setOtherOpen(!otherOpen),"Other Folders")}
          
          <div className="other-items">
            <p>Saved PDFs (?)</p>
            <p>Trash</p>
          </div>
        </nav>
      </aside>

      <main className="main-content">
        <header className="top-bar">
          <button 
            className="mobile-menu-btn"
            onClick={toggleMobileMenu}
          >
            <FaBars />
          </button>
          <img className="dark" src={toggle} alt="light dark toggle icon" />
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input 
              type="text" 
              placeholder={`Search in '${selectedFolderId ? folders.find(f => f._id === selectedFolderId)?.name || 'Folder' : 'All Folders'}'`} 
            />
          </div>
          <div className="profile-photo" />
        </header>

        {selectedFolderId ? (
          <section className="content-area">
            <div className="breadcrumb-nav">
              {breadcrumbs.map((crumb, index) => (
                <span key={index} className="breadcrumb-item">
                  {crumb}
                  {index < breadcrumbs.length - 1 && <span className="breadcrumb-separator">›</span>}
                </span>
              ))}
            </div>
            <div className="content-main">
              <div className="left-pane">
              <div className="notes-toolbar">
                <button className="new-note-btn" onClick={handleNewNote}>
                  <FaPlus style={{ marginRight: 6 }} />
                  New File
                </button>
              </div>

              <ul className="notes-list">
                {notes.map((n) => (
                  <li
                    key={n._id}
                    className={`note-row ${
                      selectedNote && selectedNote._id === n._id
                        ? "selected"
                        : ""
                    }`}
                    onClick={() => setSelectedNote(n)}
                  >
                    <div className="note-item-content">
                      <FaFile className="note-icon" />
                      {inlineEditNoteId === n._id ? (
                        <input
                          className="note-edit-input"
                          autoFocus
                          defaultValue={n.title}
                          onClick={(e) => e.stopPropagation()}
                          onBlur={(e) => renameNote(n._id, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") e.currentTarget.blur();
                            if (e.key === "Escape") setInlineEditNoteId(null);
                          }}
                        />
                      ) : (
                        <span
                          className="note-title"
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            setInlineEditNoteId(n._id);
                          }}
                        >
                          {n.title}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
                {notes.length === 0 && (
                  <div className="empty-notes">
                    <FaFile className="empty-icon" />
                    <span>No files yet. Create one →</span>
                  </div>
                )}
              </ul>
            </div>

            <div className="editor-pane">
              {selectedNote ? (
                <Editor
                  note={selectedNote}
                  folder={folders.find(f => f._id === selectedFolderId)}
                  onChange={async (updated) => {
                    setSelectedNote((prev) => ({ ...prev, ...updated }));
                    await API.patch(`/notes/${selectedNote._id}`, updated);
                    setNotes((prev) =>
                      prev.map((n) =>
                        n._id === selectedNote._id ? { ...n, ...updated } : n
                      )
                    );
                    // Clear inline edit state when title changes from editor
                    if (updated.title && inlineEditNoteId === selectedNote._id) {
                      setInlineEditNoteId(null);
                    }
                  }}
                />
              ) : (
                <div className="empty-state">
                  <h1>Select or create a file</h1>
                  <div className="folder-icon" />
                </div>
              )}
              </div>
            </div>
          </section>
        ) : (
          <section className="empty-state">
            <h1 id="placeholder-text">Create New Folder</h1>
            <h1 id="placeholder-text">to Start</h1>
            <i className="fi fi-tr-folder-open"></i>
          </section>
        )}
      </main>
    </div>
  );
}

export default Dashboard;          