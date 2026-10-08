from enum import Enum, auto
from typing import List, Optional, Any

class TokenType(Enum):
    IDENTIFIER = auto()
    STRING = auto()
    NUMBER = auto()
    DOT = auto()
    COMMA = auto()
    LPAREN = auto()
    RPAREN = auto()
    COMMENT = auto()
    NEWLINE = auto()
    EOF = auto()

class Token:
    def __init__(self, type_: TokenType, value: Any, line: int, column: int):
        self.type = type_
        self.value = value
        self.line = line
        self.column = column

    def __repr__(self) -> str:
        return f"Token({self.type.name}, {repr(self.value)}, line={self.line}, col={self.column})"

    def to_dict(self) -> dict:
        return {
            "type": self.type.name,
            "value": self.value,
            "line": self.line,
            "column": self.column
        }

class JockyLexer:
    """Forensic lexical analyzer converting JOCKY source code into tokens."""
    def __init__(self, source_code: str):
        self.source = source_code
        self.length = len(source_code)
        self.pos = 0
        self.line = 1
        self.col = 1

    def _peek(self, offset: int = 0) -> Optional[str]:
        target = self.pos + offset
        if target < self.length:
            return self.source[target]
        return None

    def _advance(self) -> Optional[str]:
        if self.pos >= self.length:
            return None
        char = self.source[self.pos]
        self.pos += 1
        if char == '\n':
            self.line += 1
            self.col = 1
        else:
            self.col += 1
        return char

    def tokenize(self) -> List[Token]:
        tokens: List[Token] = []

        while self.pos < self.length:
            char = self._peek()

            # Skip whitespace (except newlines)
            if char in (' ', '\t', '\r'):
                self._advance()
                continue

            if char == '\n':
                self._advance()
                continue

            # Comments // or #
            if (char == '/' and self._peek(1) == '/') or char == '#':
                start_col = self.col
                comment_line = self.line
                comment_val = ""
                # Consume comment prefix
                if char == '/':
                    self._advance()
                    self._advance()
                else:
                    self._advance()
                while self.pos < self.length and self._peek() != '\n':
                    comment_val += self._advance() or ''
                tokens.append(Token(TokenType.COMMENT, comment_val.strip(), comment_line, start_col))
                continue

            # Dot
            if char == '.':
                tokens.append(Token(TokenType.DOT, '.', self.line, self.col))
                self._advance()
                continue

            # Comma
            if char == ',':
                tokens.append(Token(TokenType.COMMA, ',', self.line, self.col))
                self._advance()
                continue

            # Parentheses
            if char == '(':
                tokens.append(Token(TokenType.LPAREN, '(', self.line, self.col))
                self._advance()
                continue

            if char == ')':
                tokens.append(Token(TokenType.RPAREN, ')', self.line, self.col))
                self._advance()
                continue

            # Strings: "..." or '...'
            if char in ('"', "'"):
                quote = char
                start_col = self.col
                start_line = self.line
                self._advance()
                str_val = ""
                while self.pos < self.length and self._peek() != quote:
                    curr = self._advance()
                    if curr == '\\':
                        escaped = self._advance()
                        str_val += escaped if escaped else '\\'
                    else:
                        str_val += curr if curr else ''
                if self.pos < self.length and self._peek() == quote:
                    self._advance()
                tokens.append(Token(TokenType.STRING, str_val, start_line, start_col))
                continue

            # Numbers: digits or floats
            if char.isdigit():
                start_col = self.col
                start_line = self.line
                num_str = ""
                while self.pos < self.length and (self._peek().isdigit() or self._peek() == '.'):
                    if self._peek() == '.' and (self.pos + 1 < self.length and not self.source[self.pos + 1].isdigit()):
                        break
                    num_str += self._advance()
                val = float(num_str) if '.' in num_str else int(num_str)
                tokens.append(Token(TokenType.NUMBER, val, start_line, start_col))
                continue

            # Identifiers: [a-zA-Z_][a-zA-Z0-9_]*
            if char.isalpha() or char == '_':
                start_col = self.col
                start_line = self.line
                ident = ""
                while self.pos < self.length and (self._peek().isalnum() or self._peek() == '_'):
                    ident += self._advance()
                tokens.append(Token(TokenType.IDENTIFIER, ident, start_line, start_col))
                continue

            # Any other symbol
            self._advance()

        tokens.append(Token(TokenType.EOF, "", self.line, self.col))
        return tokens
