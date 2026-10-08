import pytest
from app.jocky.lexer import JockyLexer, TokenType
from app.jocky.parser import JockyParser
from app.jocky.validator import JockyValidator
from app.jocky.compiler import JockyCompiler

def test_jocky_lexer():
    code = 'process.find("chrome.exe")'
    lexer = JockyLexer(code)
    tokens = lexer.tokenize()
    types = [t.type for t in tokens]
    assert TokenType.IDENTIFIER in types
    assert TokenType.DOT in types
    assert TokenType.STRING in types
    assert TokenType.LPAREN in types
    assert TokenType.RPAREN in types

def test_jocky_parser():
    code = 'process.list()\nfile.search("*.dll", "C:/Windows/Temp")'
    lexer = JockyLexer(code)
    tokens = lexer.tokenize()
    parser = JockyParser(tokens)
    ast = parser.parse()
    assert ast.type == "Program"
    assert len(ast.children) == 2
    assert ast.children[0].name == "process.list"
    assert ast.children[1].name == "file.search"

def test_jocky_validator_valid():
    code = 'process.list()\nnetwork.connections()'
    res = JockyValidator.validate(code)
    assert res["valid"] is True
    assert len(res["errors"]) == 0

def test_jocky_validator_unbalanced_paren():
    code = 'process.list('
    res = JockyValidator.validate(code)
    assert res["valid"] is False
    assert len(res["errors"]) > 0

def test_jocky_validator_dangerous_primitive_blocked():
    code = 'process.disable_antivirus()'
    res = JockyValidator.validate(code)
    assert res["valid"] is False
    assert any("violation" in err.lower() for err in res["errors"])

def test_api_compile_jocky_script(client):
    code = """// Automated Process and Network acquisition
process.list()
process.find("powershell.exe")
network.connections()
file.search("*.dll", "C:/Windows/Temp")
evidence.collect()
"""
    res = client.post("/api/jocky/compile", json={
        "code": code,
        "targetPlatform": "windows"
    })
    assert res.status_code == 200
    data = res.json()
    assert data["isValid"] is True
    assert data["syntaxStatus"] == "Valid"
    assert data["compilerStatus"] == "Ready"
    assert data["operationsCount"] == 5
    assert data["targetPlatform"] == "windows"
    assert "ast" in data
    assert "irCode" in data
    assert "bytecodeInstructions" in data
    assert len(data["bytecodeInstructions"]) == 5

def test_api_validate_jocky_script(client):
    res = client.post("/api/jocky/validate", json={
        "code": 'system.info()\nprocess.list()'
    })
    assert res.status_code == 200
    data = res.json()
    assert data["valid"] is True
    assert len(data["errors"]) == 0

def test_get_jocky_scripts(client):
    res = client.get("/api/jocky/scripts")
    assert res.status_code == 200
    data = res.json()
    assert len(data) >= 5
    first = data[0]
    assert "name" in first
    assert "code" in first
