from typing import Dict, Any, List
import networkx as nx

class ForensicGraphBuilder:
    """Builds forensic correlation graphs using NetworkX."""

    @staticmethod
    def build_case_graph(
        processes: List[Dict[str, Any]],
        files: List[Dict[str, Any]],
        networks: List[Dict[str, Any]],
        logs: List[Dict[str, Any]],
        findings: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        G = nx.DiGraph()

        # Add process nodes
        for p in processes[:10]: # limit to top items for clean graph
            p_id = f"proc-{p.get('pid', '0')}"
            G.add_node(
                p_id,
                label=f"{p.get('name', 'Process')} (PID {p.get('pid', 0)})",
                type="process",
                risk=p.get("risk", "normal"),
                details=f"Path: {p.get('path', 'Unknown')}",
                subtext=f"User: {p.get('user', 'SYSTEM')}"
            )

        # Add file nodes
        for f in files[:10]:
            f_id = f"file-{f.get('id', '0')}"
            G.add_node(
                f_id,
                label=f.get("name", "File"),
                type="file",
                risk=f.get("risk", "clean"),
                details=f"Size: {f.get('size', '0 B')} | Entropy: {f.get('entropy', 0.0)}",
                subtext=f"Status: {f.get('evidence_status', 'cataloged')}"
            )

        # Add network nodes
        for net in networks[:10]:
            n_id = f"net-{net.get('id', '0')}"
            G.add_node(
                n_id,
                label=f"{net.get('dest_ip', '0.0.0.0')}:{net.get('dest_port', 0)} ({net.get('protocol', 'TCP')})",
                type="network",
                risk=net.get("risk", "normal"),
                details=f"Geo: {net.get('destination_geo', 'Internal')}",
                subtext=f"Status: {net.get('status', 'ESTABLISHED')}"
            )

        # Add log nodes
        for l in logs[:10]:
            l_id = f"log-{l.get('id', '0')}"
            G.add_node(
                l_id,
                label=f"Event {l.get('event_id', 0)} ({l.get('source', 'System')})",
                type="log",
                risk=l.get("severity", "info"),
                details=str(l.get("message", ""))[:60],
                subtext=f"Time: {l.get('timestamp', '')}"
            )

        # Add finding nodes
        for fnd in findings[:10]:
            fnd_id = f"fnd-{fnd.get('id', '0')}"
            G.add_node(
                fnd_id,
                label=fnd.get("title", "Finding"),
                type="finding",
                risk=fnd.get("severity", "medium"),
                details=fnd.get("rule_name", "Forensic Rule"),
                subtext=f"Confidence: {fnd.get('confidence', 80)}%"
            )

        # Build correlated edges
        # Process -> File
        for p in processes[:5]:
            p_id = f"proc-{p.get('pid', '0')}"
            for f in files[:5]:
                f_id = f"file-{f.get('id', '0')}"
                if G.has_node(p_id) and G.has_node(f_id):
                    G.add_edge(p_id, f_id, relationship="accesses_file")
                    break

        # File -> Finding
        for f in files[:5]:
            f_id = f"file-{f.get('id', '0')}"
            for fnd in findings[:5]:
                fnd_id = f"fnd-{fnd.get('id', '0')}"
                if G.has_node(f_id) and G.has_node(fnd_id):
                    G.add_edge(f_id, fnd_id, relationship="triggers_finding")
                    break

        # Process -> Network
        for p in processes[:5]:
            p_id = f"proc-{p.get('pid', '0')}"
            for net in networks[:5]:
                n_id = f"net-{net.get('id', '0')}"
                if net.get("pid") == p.get("pid") and G.has_node(p_id) and G.has_node(n_id):
                    G.add_edge(p_id, n_id, relationship="opens_socket")
                elif G.has_node(p_id) and G.has_node(n_id):
                    G.add_edge(p_id, n_id, relationship="network_traffic")
                    break

        # Network -> Log
        for net in networks[:5]:
            n_id = f"net-{net.get('id', '0')}"
            for l in logs[:5]:
                l_id = f"log-{l.get('id', '0')}"
                if G.has_node(n_id) and G.has_node(l_id):
                    G.add_edge(n_id, l_id, relationship="logged_as")
                    break

        # Format output for frontend CorrelationGraphData
        nodes = []
        for n, data in G.nodes(data=True):
            nodes.append({
                "id": str(n),
                "label": data.get("label", str(n)),
                "type": data.get("type", "process"),
                "risk": data.get("risk", "normal"),
                "details": data.get("details", ""),
                "subtext": data.get("subtext", "")
            })

        edges = []
        for u, v, data in G.edges(data=True):
            edges.append({
                "from": str(u),
                "to": str(v),
                "relationship": data.get("relationship", "correlated_with")
            })

        return {"nodes": nodes, "edges": edges}
