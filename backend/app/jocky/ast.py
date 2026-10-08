from typing import List, Optional, Any, Dict

class ASTNode:
    def __init__(
        self,
        node_type: str,
        name: Optional[str] = None,
        value: Optional[Any] = None,
        children: Optional[List["ASTNode"]] = None,
        line: Optional[int] = None,
        attributes: Optional[Dict[str, Any]] = None
    ):
        self.type = node_type
        self.name = name
        self.value = value
        self.children = children if children is not None else []
        self.line = line
        self.attributes = attributes if attributes is not None else {}

    def to_dict(self) -> Dict[str, Any]:
        result: Dict[str, Any] = {"type": self.type}
        if self.name is not None:
            result["name"] = self.name
        if self.value is not None:
            result["value"] = self.value
        if self.line is not None:
            result["line"] = self.line
        if self.attributes:
            result["attributes"] = self.attributes
        if self.children:
            result["children"] = [child.to_dict() for child in self.children]
        return result

    def add_child(self, child: "ASTNode"):
        self.children.append(child)

class ProgramNode(ASTNode):
    def __init__(self, name: str = "ForensicRoot", children: Optional[List[ASTNode]] = None):
        super().__init__("Program", name=name, children=children)

class FunctionCallNode(ASTNode):
    def __init__(
        self,
        namespace: str,
        function_name: str,
        args: List[Any],
        line: int,
        attributes: Optional[Dict[str, Any]] = None
    ):
        name = f"{namespace}.{function_name}"
        attrs = attributes or {}
        attrs.update({
            "module": namespace,
            "function": function_name,
            "arguments": args
        })
        children = [
            ASTNode("Identifier", value=namespace),
            ASTNode("Method", value=function_name),
            *[ASTNode("Argument", value=arg) for arg in args]
        ]
        super().__init__("FunctionCall", name=name, children=children, line=line, attributes=attrs)
        self.namespace = namespace
        self.function_name = function_name
        self.arguments = args
