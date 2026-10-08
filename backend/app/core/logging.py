import logging
import sys
import json
from datetime import datetime, timezone

class ForensicLogFormatter(logging.Formatter):
    """Structured JSON formatter for forensic logging and audit compliance."""
    def format(self, record: logging.LogRecord) -> str:
        log_entry = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "module": record.module,
            "funcName": record.funcName,
            "lineNo": record.lineno,
        }
        if hasattr(record, "client_ip"):
            log_entry["client_ip"] = record.client_ip
        if hasattr(record, "case_id"):
            log_entry["case_id"] = record.case_id
        if hasattr(record, "action"):
            log_entry["action"] = record.action
        if record.exc_info:
            log_entry["exception"] = self.formatException(record.exc_info)
        return json.dumps(log_entry)

def setup_logging(log_level: str = "INFO") -> logging.Logger:
    logger = logging.getLogger("jocky")
    logger.setLevel(getattr(logging, log_level.upper(), logging.INFO))
    
    # Avoid duplicate handlers
    if not logger.handlers:
        console_handler = logging.StreamHandler(sys.stdout)
        console_handler.setLevel(getattr(logging, log_level.upper(), logging.INFO))
        console_handler.setFormatter(ForensicLogFormatter())
        logger.addHandler(console_handler)
    
    return logger

logger = setup_logging()
