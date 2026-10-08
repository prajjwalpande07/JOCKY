import time
from typing import Dict, Any, Optional
from app.jocky.lexer import JockyLexer
from app.jocky.parser import JockyParser
from app.jocky.validator import JockyValidator
from app.jocky.ir import ForensicIRGenerator

class JockyCompiler:
    """Multi-stage compiler pipeline for JOCKY DSL."""

    @classmethod
    def compile(cls, code: str, target_platform: str = "cross_platform") -> Dict[str, Any]:
        start_time = time.perf_counter()

        # 1. Validation
        validation = JockyValidator.validate(code)
        if not validation["valid"]:
            exec_time = int((time.perf_counter() - start_time) * 1000)
            return {
                "isValid": False,
                "syntaxStatus": "Syntax Error",
                "compilerStatus": "Failed",
                "operationsCount": 0,
                "estimatedEvidenceItems": 0,
                "tokensCount": 0,
                "targetPlatform": target_platform,
                "ast": {"type": "Program", "name": "ForensicRoot", "children": []},
                "irCode": "; Compilation failed due to syntax/safety violations.",
                "bytecodeInstructions": [],
                "compilationTimeMs": max(1, exec_time),
                "errors": validation["errors"]
            }

        # 2. Lexical Analysis
        lexer = JockyLexer(code)
        tokens = lexer.tokenize()
        tokens_count = len(tokens)

        # 3. Parsing to AST
        parser = JockyParser(tokens)
        ast_root = parser.parse()
        ops_count = len(ast_root.children)

        # 4. Generate IR and Bytecode
        ir_instructions, fir_code, bytecode_instructions = ForensicIRGenerator.generate(
            ast_root, target_platform=target_platform
        )

        # Estimate evidence yield based on operation types
        estimated_items = 0
        for child in ast_root.children:
            mod = child.attributes.get("module", "").lower() if hasattr(child, "attributes") else ""
            if mod == "process":
                estimated_items += 45
            elif mod == "file":
                estimated_items += 80
            elif mod == "network":
                estimated_items += 25
            elif mod == "log":
                estimated_items += 60
            else:
                estimated_items += 10

        exec_time = int((time.perf_counter() - start_time) * 1000)

        return {
            "isValid": True,
            "syntaxStatus": "Valid",
            "compilerStatus": "Ready",
            "operationsCount": ops_count,
            "estimatedEvidenceItems": max(1, estimated_items),
            "tokensCount": ops_count * 8 + 14,
            "targetPlatform": target_platform,
            "ast": ast_root.to_dict(),
            "irCode": fir_code,
            "bytecodeInstructions": bytecode_instructions,
            "compilationTimeMs": max(1, exec_time),
            "errors": []
        }
