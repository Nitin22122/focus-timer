import React, { useState } from 'react';
import '../styles/SubjectSelector.css';

interface SubjectSelectorProps {
  currentSubject: string;
  subjects: string[];
  onSubjectChange: (subject: string) => void;
}

export const SubjectSelector: React.FC<SubjectSelectorProps> = ({
  currentSubject,
  subjects,
  onSubjectChange
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newSubject, setNewSubject] = useState('');

  const handleAddSubject = () => {
    if (newSubject.trim() && !subjects.includes(newSubject.trim())) {
      // This will be handled by the engine
      onSubjectChange(newSubject.trim());
      setNewSubject('');
      setIsAdding(false);
    }
  };

  return (
    <div className="subject-selector">
      <div className="subject-display">
        <label>CURRENT STUDY SUBJECT</label>
        <select
          value={currentSubject}
          onChange={(e) => onSubjectChange(e.target.value)}
          className="subject-select"
        >
          {subjects.map((subject) => (
            <option key={subject} value={subject}>
              {subject}
            </option>
          ))}
        </select>
      </div>

      {isAdding ? (
        <div className="subject-add">
          <input
            type="text"
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            placeholder="Enter new subject"
            className="subject-input"
            onKeyPress={(e) => e.key === 'Enter' && handleAddSubject()}
          />
          <button onClick={handleAddSubject} className="subject-add-btn">
            Add
          </button>
          <button 
            onClick={() => setIsAdding(false)} 
            className="subject-cancel-btn"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button 
          onClick={() => setIsAdding(true)} 
          className="subject-add-trigger"
        >
          + Add Subject
        </button>
      )}
    </div>
  );
};