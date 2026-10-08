import re
from typing import Dict, List, Any

VALID_MODULES = {"system", "process", "network", "file", "log", "evidence", "report"}

DANGEROUS_PATTERNS = [
    (r"\bdisable_antivirus\b", "Prohibited security control evasion"),
    (r"\bbypass_edr\b", "Prohibited defensive counter-measure bypass"),
    (r"\bmimikatz\b|\bdump_lsass\b", "Prohibited credential theft instruction"),
    (r"\binject_dll\b|\bprocess_hollow\b", "Prohibited process injection technique"),
    (r"\bremote_exec\b|\bexec_payload\b", "Prohibited unauthorized payload execution"),
    (r"\bbyovd\b", "Prohibited driver exploit primitive"),
]

class JockyValidator:
    """Validates JOCKY script code for syntax errors, unknown modules, and prohibited actions."""

    @staticmethod
    def validate(code: str) -> Dict[str, Any]:
        errors: List[str] = []
        warnings: List[str] = []

        lines = code.split("\n")
        for idx, line in enumerate(lines, start=1):
            trimmed = line.strip()
            if not trimmed or trimmed.startsWith("//") if hasattr(trimmed, 'startsWith') else (not trimmed or trimmed.startswith("//") or trimmed.startswith("#")):
                continue

            # Check unbalanced parentheses
            open_p = trimmed.count("(")
            close_p = trimmed.count(")")
            if open_p != close_p:
                errors.append(f"Line {idx}: Unbalanced parentheses in '{trimmed}'")

            # Check quotes balance
            double_q = trimmed.count('"')
            single_q = trimmed.count("'")
            if (double_q % 2 != 0) or (single_q % 2 != 0):
                errors.append(f"Line {idx}: Unterminated string literal in '{trimmed}'")

            # Check module namespace
            if "." in trimmed:
                first_part = trimmed.split(".")[0].strip()
                if first_part not in VALID_MODULES:
                    warnings.append(
                        f"Line {idx}: Unknown module namespace '{first_part}'. Supported: {', '.join(sorted(VALID_MODULES))}"
                    )

            # Check safety patterns
            for pat, desc in DANGEROUS_PATTERNS:
                if re.search(pat, trimmed, re.IGNORECASE):
                    errors.append(f"Line {idx}: Security validation violation - {desc}")

        is_valid = len(errors) == 0
        return {
            "valid": is_valid,
            "errors": errors,
            "warnings": warnings
        }
