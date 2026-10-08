import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Search, Copy, Check, Terminal, ExternalLink, Code2, Shield, Cpu, FileText, Network, Database } from 'lucide-react';
import { useInvestigation } from '../context/InvestigationContext';

interface DocSection {
  id: string;
  category: string;
  title: string;
  description: string;
  syntax: string;
  parameters: { name: string; type: string; required: boolean; description: string }[];
  example: string;
  crossPlatformNote: string;
}

export const ReferencePage: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useInvestigation();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copySnippet = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    addToast('info', 'Copied to Clipboard', 'Syntax snippet copied');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const docSections: DocSection[] = [
    // SYSTEM
    {
      id: 'sys-info',
      category: 'system',
      title: 'system.info()',
      description: 'Acquires comprehensive system architecture, kernel build, hardware identifiers, and boot timestamp.',
      syntax: 'system.info()',
      parameters: [],
      example: `// Collect host baseline
system.info()
system.hostname()
system.os()`,
      crossPlatformNote: 'Queries Windows WMI / Win32_OperatingSystem and Linux /proc/version + uname(2).'
    },
    {
      id: 'sys-users',
      category: 'system',
      title: 'system.users()',
      description: 'Enumerates logged-on sessions, user privileges, active terminal sessions, and token groups.',
      syntax: 'system.users()',
      parameters: [],
      example: `system.users()`,
      crossPlatformNote: 'Parses Windows LsaEnumerateLogonSessions and Linux utmp/wtmp records.'
    },
    // PROCESS
    {
      id: 'proc-list',
      category: 'process',
      title: 'process.list()',
      description: 'Extracts full process snapshot including PIDs, PPIDs, parent names, command-line arguments, and hashes.',
      syntax: 'process.list()',
      parameters: [],
      example: `// Inspect running process table
process.list()`,
      crossPlatformNote: 'Uses Windows CreateToolhelp32Snapshot / NtQuerySystemInformation and Linux /proc/*/stat.'
    },
    {
      id: 'proc-find',
      category: 'process',
      title: 'process.find(name_or_regex)',
      description: 'Filters processes matching executable name or regex pattern, returning PID handles and memory regions.',
      syntax: 'process.find(string pattern)',
      parameters: [
        { name: 'pattern', type: 'string', required: true, description: 'Executable name, wildcard, or regex pattern' }
      ],
      example: `process.find("suspicious.exe")
process.find("powershell.*")`,
      crossPlatformNote: 'Matches case-insensitively on Windows and case-sensitively on Ubuntu.'
    },
    {
      id: 'proc-details',
      category: 'process',
      title: 'process.details(pid)',
      description: 'Returns thread metadata, loaded DLLs/shared objects, memory maps, and open handle descriptors.',
      syntax: 'process.details(int pid)',
      parameters: [
        { name: 'pid', type: 'integer', required: true, description: 'Target process identifier' }
      ],
      example: `process.details(4128)`,
      crossPlatformNote: 'Acquires PEB / loaded modules on Windows and /proc/[pid]/maps on Linux.'
    },
    // FILES
    {
      id: 'file-search',
      category: 'files',
      title: 'file.search(pattern, path)',
      description: 'Recursively searches targeted directories for matching filenames, extensions, or wildcard patterns.',
      syntax: 'file.search(string pattern, string path = ".")',
      parameters: [
        { name: 'pattern', type: 'string', required: true, description: 'File pattern e.g. "*.dll", "*.exe"' },
        { name: 'path', type: 'string', required: false, description: 'Target search directory' }
      ],
      example: `file.search("*.dll", "C:/Windows/Temp")
file.search("*.so", "/usr/lib")`,
      crossPlatformNote: 'Normalizes forward slashes and backslashes transparently across OS boundaries.'
    },
    {
      id: 'file-hash',
      category: 'files',
      title: 'file.hash(path, algorithm)',
      description: 'Computes cryptographic digest of target file (SHA-256 by default, supports BLAKE3).',
      syntax: 'file.hash(string path, string algorithm = "SHA-256")',
      parameters: [
        { name: 'path', type: 'string', required: true, description: 'Absolute or relative file path' },
        { name: 'algorithm', type: 'string', required: false, description: '"SHA-256", "BLAKE3", or "DUAL"' }
      ],
      example: `file.hash("C:/Windows/Temp/stager_drop.dll")`,
      crossPlatformNote: 'Computes raw block-level hash without altering file access timestamps ($MFT / stat).'
    },
    {
      id: 'file-entropy',
      category: 'files',
      title: 'file.entropy(path)',
      description: 'Calculates Shannon entropy score (0.0 to 8.0) to identify packed, obfuscated, or encrypted payloads.',
      syntax: 'file.entropy(string path)',
      parameters: [
        { name: 'path', type: 'string', required: true, description: 'Target binary file path' }
      ],
      example: `file.entropy("C:/Windows/Temp/suspicious.exe")`,
      crossPlatformNote: 'Scores > 7.2 typically indicate packing, encryption, or compressed payloads.'
    },
    // NETWORK
    {
      id: 'net-conn',
      category: 'network',
      title: 'network.connections()',
      description: 'Enumerates active TCP/UDP sockets, listener ports, foreign IP addresses, and owning PIDs.',
      syntax: 'network.connections()',
      parameters: [],
      example: `network.interfaces()
network.connections()
network.routes()`,
      crossPlatformNote: 'Calls GetExtendedTcpTable on Windows and queries /proc/net/tcp, /proc/net/udp on Linux.'
    },
    // LOGS
    {
      id: 'log-collect',
      category: 'logs',
      title: 'log.collect(channel, limit)',
      description: 'Harvests event records from OS logging channels (Security, Application, System, or Linux auditd).',
      syntax: 'log.collect(string channel, int limit = 500)',
      parameters: [
        { name: 'channel', type: 'string', required: true, description: '"Security", "System", or "Auditd"' },
        { name: 'limit', type: 'integer', required: false, description: 'Maximum event entries to acquire' }
      ],
      example: `log.collect("Security", 100)
log.collect("Auditd", 200)`,
      crossPlatformNote: 'Queries EVTX channels via EvtQuery API on Windows; parses /var/log/audit/audit.log on Linux.'
    },
    // EVIDENCE
    {
      id: 'evd-collect',
      category: 'evidence',
      title: 'evidence.collect()',
      description: 'Freezes current telemetry snapshot into an isolated forensic evidence container with cryptographic seal.',
      syntax: 'evidence.collect()',
      parameters: [],
      example: `evidence.collect()
evidence.hash()
evidence.export("case-001")`,
      crossPlatformNote: 'Generates immutable JSON + binary envelope with dual SHA-256 and BLAKE3 signatures.'
    }
  ];

  const filteredDocs = docSections.filter((doc) => {
    if (selectedCategory !== 'all' && doc.category !== selectedCategory) return false;
    if (search) {
      const q = search.toLowerCase();
      return doc.title.toLowerCase().includes(q) || doc.description.toLowerCase().includes(q) || doc.syntax.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-card">
        <div>
          <div className="text-[10px] font-mono uppercase font-bold tracking-widest text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block mb-1">
            LANGUAGE SPECIFICATION
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            JOCKY Language Reference
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            Formal documentation, function signatures, and cross-platform runtime guarantees for JOCKY DSL v2.4
          </p>
        </div>

        <button
          onClick={() => navigate('/studio')}
          className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-xl shadow-sm transition-all inline-flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Code2 className="w-4 h-4" />
          Open JOCKY Studio
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-card flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search language reference..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {['all', 'system', 'process', 'files', 'network', 'logs', 'evidence'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs rounded-lg font-medium capitalize transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white font-semibold shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Documentation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono bg-slate-100 px-2 py-0.5 rounded">
                  {doc.category}
                </span>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Cross-Platform
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 font-mono text-blue-700">
                  {doc.title}
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {doc.description}
                </p>
              </div>

              {/* Syntax Block with Copy */}
              <div className="bg-slate-900 rounded-lg p-3 font-mono text-xs text-cyan-300 flex items-center justify-between border border-slate-800">
                <code>{doc.syntax}</code>
                <button
                  onClick={() => copySnippet(doc.id, doc.syntax)}
                  className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Copy syntax"
                >
                  {copiedId === doc.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Parameters */}
              {doc.parameters.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Arguments
                  </div>
                  <div className="space-y-1 text-xs">
                    {doc.parameters.map((p, idx) => (
                      <div key={idx} className="bg-slate-50 p-2 rounded border border-slate-100 font-mono">
                        <span className="font-bold text-slate-800">{p.name}</span>
                        <span className="text-blue-600 font-semibold ml-1">({p.type})</span>:
                        <span className="text-slate-600 ml-1 font-sans">{p.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Cross-Platform Execution Note */}
              <div className="text-[11px] bg-blue-50/50 border border-blue-100 rounded-lg p-2.5 text-slate-700">
                <strong className="text-blue-900">Runtime Guarantee: </strong>
                {doc.crossPlatformNote}
              </div>
            </div>

            {/* Quick Test in Studio Button */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
              <button
                onClick={() => navigate('/studio')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
              >
                Try in Studio <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
