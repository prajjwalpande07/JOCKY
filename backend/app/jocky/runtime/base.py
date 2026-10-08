from abc import ABC, abstractmethod
from typing import Dict, Any, List

class BaseRuntime(ABC):
    """Abstract base class for cross-platform forensic runtime execution."""

    @abstractmethod
    def system_info(self) -> Dict[str, Any]:
        """Collect host system information."""
        pass

    @abstractmethod
    def process_list(self) -> List[Dict[str, Any]]:
        """Enumerate active processes safely."""
        pass

    @abstractmethod
    def process_find(self, pattern: str) -> List[Dict[str, Any]]:
        """Filter processes matching pattern."""
        pass

    @abstractmethod
    def file_search(self, pattern: str, directory: str = ".") -> List[Dict[str, Any]]:
        """Search files matching pattern in authorized directory."""
        pass

    @abstractmethod
    def file_hash(self, file_path: str) -> Dict[str, Any]:
        """Compute SHA-256 for evidence file."""
        pass

    @abstractmethod
    def network_connections(self) -> List[Dict[str, Any]]:
        """Enumerate active network sockets."""
        pass

    @abstractmethod
    def log_collect(self, channel: str = "System") -> List[Dict[str, Any]]:
        """Collect event logs."""
        pass

    def execute_ir(self, ir_instruction: Dict[str, Any]) -> Any:
        """Dispatch intermediate representation operation to platform runtime."""
        op = ir_instruction.get("operation", "")
        params = ir_instruction.get("parameters", {})

        if op == "SYSTEM_INFO":
            return self.system_info()
        elif op == "PROCESS_LIST":
            return self.process_list()
        elif op == "PROCESS_FIND":
            return self.process_find(params.get("pattern", ""))
        elif op == "FILE_SEARCH":
            return self.file_search(params.get("pattern", "*"), params.get("path", "."))
        elif op == "FILE_HASH":
            return self.file_hash(params.get("path", ""))
        elif op == "NETWORK_CONNECTIONS":
            return self.network_connections()
        elif op == "LOG_COLLECT":
            return self.log_collect(params.get("channel", "System"))
        else:
            return {"status": "NOOP", "operation": op}
