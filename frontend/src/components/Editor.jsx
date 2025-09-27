import React, { useEffect, useRef, useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import "./Editor.css";

export default function Editor({ note, folder, onChange, onSummarize, isDarkMode }) {
  const isTodoFolder = folder?.category === "todo";
  
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content || ""); 
  const [checklistItems, setChecklistItems] = useState(
    note.checklistItems && note.checklistItems.length > 0
      ? note.checklistItems
      : (isTodoFolder ? [{ id: Date.now(), text: "", completed: false }] : [])
  );
  const [isSummarizing, setIsSummarizing] = useState(false);
  const saveTimer = useRef(null);

  useEffect(() => {
    setTitle(note.title);
    setContent(note.content || "");
    setChecklistItems(
      note.checklistItems && note.checklistItems.length > 0
        ? note.checklistItems
        : (folder?.category === "todo" ? [{ id: Date.now(), text: "", completed: false }] : [])
    );
    setIsSummarizing(false);
  }, [note._id, folder]);

  useEffect(() => {
    if (!onChange) return;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      // Logic for saving based on folder type
      if (isTodoFolder) {
        onChange({ title, checklistItems });
      } else {
        onChange({ title, content });
      }
    }, 500);
    return () => clearTimeout(saveTimer.current);
  }, [title, content, checklistItems, isTodoFolder]);

  const handleSummarize = async () => {
    if (isSummarizing || !note.content) return;
    setIsSummarizing(true);
    try {
      await onSummarize(note._id);
    } finally {
      setIsSummarizing(false);
    }
  };

  const addChecklistItem = () => {
    const newItem = { id: Date.now(), text: "", completed: false };
    setChecklistItems([...checklistItems, newItem]);
  };

  const updateChecklistItem = (id, updates) => {
    setChecklistItems(items =>
      items.map(item => item.id === id ? { ...item, ...updates } : item)
    );
  };

  const removeChecklistItem = (id) => {
    setChecklistItems(items => items.filter(item => item.id !== id));
  };

  const toggleChecklistItem = (id) => {
    updateChecklistItem(id, { completed: !checklistItems.find(item => item.id === id)?.completed });
  };

  if (isTodoFolder) {
    return (
      // Apply dark-mode-editor class if in dark mode
      <div className={`editor-root ${isDarkMode ? 'dark-mode-editor' : ''}`}> 
        <input
          className="editor-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="To-Do List Title"
        />
        <div className="checklist-container">
          {checklistItems.map((item, index) => (
            <div key={item.id} className="checklist-item">
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => toggleChecklistItem(item.id)}
                className="checklist-checkbox"
              />
              <input
                type="text"
                value={item.text}
                onChange={(e) => updateChecklistItem(item.id, { text: e.target.value })}
                placeholder={`Task ${index + 1}`}
                className={`checklist-input ${item.completed ? 'completed' : ''}`}
              />
              <button
                onClick={() => removeChecklistItem(item.id)}
                className="checklist-remove-btn"
                disabled={checklistItems.length === 1}
              >
                <FaTrash />
              </button>
            </div>
          ))}
          <button onClick={addChecklistItem} className="add-checklist-btn">
            <FaPlus />
            Add Task
          </button>
        </div>
      </div>
    );
  }

  return (
    // Apply dark-mode-editor class if in dark mode
    <div className={`editor-root ${isDarkMode ? 'dark-mode-editor' : ''}`}>
      <input
        className="editor-title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />
      <textarea
        className="editor-area lined-paper"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Start typing…"
      />
      <div className="summary-controls">
        <button
          className="summarize-btn"
          onClick={handleSummarize}
          disabled={isSummarizing || !note.content}
        >
          {isSummarizing ? "Summarizing..." : "Generate Summary"}
        </button>
      </div>
    </div>
  );
}