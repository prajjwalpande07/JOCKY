import React, { useState } from 'react';
import { ShieldAlert, CheckCircle, XCircle, MessageSquarePlus, Clock, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { Finding } from '../../types';
import { RiskBadge } from '../common/RiskBadge';

interface FindingCardProps {
  finding: Finding;
  onStatusChange?: (id: string, status: 'confirmed' | 'false_positive' | 'under_review', note?: string) => void;
  onViewEvidence?: (finding: Finding) => void;
  onViewTimeline?: (finding: Finding) => void;
}

export const FindingCard: React.FC<FindingCardProps> = ({
  finding,
  onStatusChange,
  onViewEvidence,
  onViewTimeline
}) => {
  const [expanded, setExpanded] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);

  const handleAddNote = () => {
    if (newNote.trim() && onStatusChange) {
      onStatusChange(finding.id, finding.status, newNote.trim());
      setNewNote('');
      setShowNoteInput(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-card hover:shadow-card-hover transition-all space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <RiskBadge level={finding.severity} size="md" />
            <span className="text-xs font-mono font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              {finding.ruleId}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Confidence: {finding.confidence}%
            </span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${
              finding.status === 'confirmed'
                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                : finding.status === 'false_positive'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}>
              Status: {finding.status.replace('_', ' ')}
            </span>
          </div>
          <h3 className="text-sm md:text-base font-bold text-slate-900 pt-1">
            {finding.title}
          </h3>
          <p className="text-xs text-slate-500">
            Detected: {finding.detectedAt} • Associated Rule: <span className="font-semibold text-slate-700">{finding.ruleName}</span>
          </p>
        </div>
      </div>

      <p className="text-xs md:text-sm text-slate-700 leading-relaxed bg-slate-50/70 p-3 rounded-lg border border-slate-100">
        {finding.description}
      </p>

      <div className="flex items-center gap-6 text-xs text-slate-600 font-medium pt-1">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          <span>Related Evidence: <strong className="text-slate-900">{finding.relatedEvidenceCount}</strong></span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-purple-500" />
          <span>Related Events: <strong className="text-slate-900">{finding.relatedEventsCount}</strong></span>
        </div>
      </div>

      <div className="bg-amber-50/40 border border-amber-200/60 rounded-lg p-3 text-xs">
        <span className="font-bold text-amber-900">Forensic Recommendation: </span>
        <span className="text-slate-700">{finding.recommendation}</span>
      </div>

      {/* Investigator Notes */}
      {finding.investigatorNotes && finding.investigatorNotes.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            <span>Investigator Notes ({finding.investigatorNotes.length})</span>
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          {expanded && (
            <div className="space-y-1.5 pl-2 border-l-2 border-slate-200">
              {finding.investigatorNotes.map((note, idx) => (
                <p key={idx} className="text-xs text-slate-600 italic">
                  "{note}"
                </p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between flex-wrap gap-2 pt-3 border-t border-slate-100">
        <div className="flex items-center gap-2">
          {onViewEvidence && (
            <button
              onClick={() => onViewEvidence(finding)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              View Evidence
            </button>
          )}
          {onViewTimeline && (
            <button
              onClick={() => onViewTimeline(finding)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors"
            >
              <Clock className="w-3.5 h-3.5" />
              View Timeline
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {onStatusChange && (
            <>
              <button
                onClick={() => onStatusChange(finding.id, 'confirmed')}
                className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  finding.status === 'confirmed'
                    ? 'bg-rose-600 text-white'
                    : 'text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200'
                }`}
              >
                <CheckCircle className="w-3.5 h-3.5" />
                Mark Confirmed
              </button>
              <button
                onClick={() => onStatusChange(finding.id, 'false_positive')}
                className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  finding.status === 'false_positive'
                    ? 'bg-emerald-600 text-white'
                    : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200'
                }`}
              >
                <XCircle className="w-3.5 h-3.5" />
                Mark False Positive
              </button>
              <button
                onClick={() => setShowNoteInput(!showNoteInput)}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors"
              >
                <MessageSquarePlus className="w-3.5 h-3.5 text-slate-500" />
                Add Note
              </button>
            </>
          )}
        </div>
      </div>

      {showNoteInput && (
        <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200 flex gap-2">
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Enter investigator observations or triage context..."
            className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
          />
          <button
            onClick={handleAddNote}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-md"
          >
            Save Note
          </button>
        </div>
      )}
    </div>
  );
};
