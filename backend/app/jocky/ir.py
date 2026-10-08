from datetime import datetime, timezone
from typing import List, Dict, Any, Tuple
from app.jocky.ast import ProgramNode, FunctionCallNode

class ForensicIRGenerator:
    """Translates JOCKY AST into platform-independent Forensic Intermediate Representation (FIR)."""

    @classmethod
    def generate(cls, ast: ProgramNode, target_platform: str = "cross_platform") -> Tuple[List[Dict[str, Any]], str, List[str]]:
        ir_instructions: List[Dict[str, Any]] = []
        bytecode_lines: List[str] = []
        
        fir_text_lines: List[str] = [
            "; JOCKY Forensic Intermediate Representation (FIR v2.4)",
            f"; Target Platform Architecture: {target_platform.upper()}",
            f"; Timestamp: {datetime.now(timezone.utc).isoformat()}",
            f"; Operations Count: {len(ast.children)}",
            "",
            ".section .metadata",
            f'  FIR_ARCH        "{target_platform}"',
            '  FIR_PRIVILEGE   "ELEVATED_FORENSIC_ACQUISITION"',
            '  FIR_HASH_ALGO   "SHA256_BLAKE3_DUAL"',
            "",
            ".section .bytecode"
        ]

        for idx, child in enumerate(ast.children):
            if isinstance(child, FunctionCallNode) or child.type == "FunctionCall":
                mod = child.attributes.get("module", "system").upper()
                fn = child.attributes.get("function", "info").upper()
                raw_args = child.attributes.get("arguments", [])
                
                op_name = f"FIR_OP_{mod}_{fn}"
                
                # Format parameters
                params: Dict[str, Any] = {}
                if mod == "PROCESS":
                    if fn == "FIND" and raw_args:
                        params["pattern"] = raw_args[0]
                    elif fn in ("DETAILS", "LINEAGE", "MEMORY_DUMP", "THREADS", "HANDLES") and raw_args:
                        params["pid"] = raw_args[0]
                        if len(raw_args) > 1:
                            params["target_path"] = raw_args[1]
                elif mod == "FILE":
                    if fn == "SEARCH":
                        params["pattern"] = raw_args[0] if raw_args else "*"
                        if len(raw_args) > 1:
                            params["path"] = raw_args[1]
                    elif fn in ("LIST", "METADATA", "HASH", "ENTROPY") and raw_args:
                        params["path"] = raw_args[0]
                elif mod == "NETWORK":
                    if fn == "FILTER_REMOTE" and raw_args:
                        params["remote_ip"] = raw_args[0]
                    elif fn == "PCAP_CAPTURE" and raw_args:
                        params["interface"] = raw_args[0]
                        params["duration_sec"] = raw_args[1] if len(raw_args) > 1 else 60
                elif mod == "LOG":
                    if raw_args:
                        params["channel"] = raw_args[0]
                elif mod == "EVIDENCE":
                    if fn == "EXPORT" and raw_args:
                        params["target_case"] = raw_args[0]
                    elif fn == "HASH" and raw_args:
                        params["algorithm"] = raw_args[0]

                ir_item = {
                    "operation": f"{mod}_{fn}",
                    "target": mod,
                    "parameters": params,
                    "platform": target_platform.upper(),
                    "reg": f"%reg_{idx}"
                }
                ir_instructions.append(ir_item)

                formatted_args = f" [{', '.join(repr(str(a)) for a in raw_args)}]" if raw_args else ""
                bc_instruction = f"  {op_name:<28}%reg_{idx}{formatted_args}"
                bytecode_lines.append(bc_instruction)
                fir_text_lines.append(bc_instruction)
            else:
                stmt_name = child.name or "RAW_STMT"
                bc_instruction = f'  FIR_OP_RAW_STMT             "{stmt_name}"'
                bytecode_lines.append(bc_instruction)
                fir_text_lines.append(bc_instruction)
                ir_instructions.append({
                    "operation": "RAW_STMT",
                    "target": "SYSTEM",
                    "parameters": {"statement": stmt_name},
                    "platform": target_platform.upper(),
                    "reg": f"%reg_{idx}"
                })

        fir_text_lines.extend([
            "",
            ".section .integrity",
            '  FIR_SIGN_CONTAINER      "TAMPER_EVIDENT_MERKLE_TREE"',
            "  FIR_RETURN_STATUS       %r_success"
        ])

        fir_text = "\n".join(fir_text_lines)
        return ir_instructions, fir_text, bytecode_lines
