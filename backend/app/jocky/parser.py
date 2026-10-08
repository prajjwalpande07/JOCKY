from typing import List, Optional, Any
from app.jocky.lexer import Token, TokenType
from app.jocky.ast import ASTNode, ProgramNode, FunctionCallNode

class ParseError(Exception):
    def __init__(self, message: str, line: int = 1, column: int = 1):
        super().__init__(f"Line {line}:{column}: {message}")
        self.message = message
        self.line = line
        self.column = column

class JockyParser:
    """Parses JOCKY tokens into an abstract syntax tree (AST)."""
    def __init__(self, tokens: List[Token]):
        self.tokens = tokens
        self.pos = 0

    def _current(self) -> Token:
        if self.pos < len(self.tokens):
            return self.tokens[self.pos]
        return self.tokens[-1]

    def _peek(self, offset: int = 1) -> Token:
        idx = self.pos + offset
        if idx < len(self.tokens):
            return self.tokens[idx]
        return self.tokens[-1]

    def _advance(self) -> Token:
        tok = self._current()
        if self.pos < len(self.tokens) - 1:
            self.pos += 1
        return tok

    def _match(self, *expected_types: TokenType) -> bool:
        if self._current().type in expected_types:
            self._advance()
            return True
        return False

    def parse(self) -> ProgramNode:
        root = ProgramNode(name="ForensicRoot", children=[])

        while self._current().type != TokenType.EOF:
            # Skip comments
            if self._current().type == TokenType.COMMENT:
                self._advance()
                continue

            node = self._parse_statement()
            if node:
                root.add_child(node)

        return root

    def _parse_statement(self) -> Optional[ASTNode]:
        curr = self._current()

        # Handle namespace.function(...) call
        if curr.type == TokenType.IDENTIFIER:
            namespace = curr.value
            line = curr.line
            self._advance()

            if self._current().type == TokenType.DOT:
                self._advance() # consume dot
                func_tok = self._current()
                if func_tok.type == TokenType.IDENTIFIER:
                    func_name = func_tok.value
                    self._advance() # consume function name

                    args = []
                    if self._current().type == TokenType.LPAREN:
                        self._advance() # consume '('

                        while self._current().type not in (TokenType.RPAREN, TokenType.EOF):
                            arg_val = self._parse_argument()
                            if arg_val is not None:
                                args.append(arg_val)

                            if self._current().type == TokenType.COMMA:
                                self._advance()
                            elif self._current().type == TokenType.RPAREN:
                                break
                            else:
                                self._advance()

                        if self._current().type == TokenType.RPAREN:
                            self._advance() # consume ')'

                    return FunctionCallNode(
                        namespace=namespace,
                        function_name=func_name,
                        args=args,
                        line=line
                    )
            # If not a dot, return generic expression statement
            return ASTNode("ExpressionStatement", name=namespace, line=line)

        # Skip unknown tokens
        self._advance()
        return None

    def _parse_argument(self) -> Any:
        tok = self._current()
        if tok.type in (TokenType.STRING, TokenType.NUMBER, TokenType.IDENTIFIER):
            self._advance()
            return tok.value
        self._advance()
        return None
