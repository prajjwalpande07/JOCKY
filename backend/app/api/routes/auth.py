from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.user import User
from app.schemas.auth import UserCreate, UserLogin, Token, UserResponse, RefreshTokenRequest
from app.core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    create_refresh_token,
    decode_token,
    get_current_user
)
from app.services.audit_service import AuditService

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED, summary="Register User")
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email address already exists."
        )

    user = User(
        name=user_in.name,
        email=user_in.email,
        password_hash=get_password_hash(user_in.password),
        role=user_in.role or "INVESTIGATOR"
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token_data = {"sub": user.email, "role": user.role, "user_id": user.id, "name": user.name}
    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)

    AuditService.create_log(
        db,
        action="User Registered",
        object_name=f"User {user.email}",
        user=user.name,
        result="SUCCESS",
        details=f"Account registered with role {user.role}"
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "refresh_token": refresh_token,
        "role": user.role,
        "user_id": user.id,
        "name": user.name,
        "email": user.email
    }

@router.post("/login", response_model=Token, summary="Login User")
def login(login_in: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_in.email).first()
    if not user or not verify_password(login_in.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password credentials."
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is deactivated."
        )

    token_data = {"sub": user.email, "role": user.role, "user_id": user.id, "name": user.name}
    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)

    AuditService.create_log(
        db,
        action="User Authenticated",
        object_name=f"User {user.email}",
        user=user.name,
        result="SUCCESS",
        details="User successfully authenticated via JWT."
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "refresh_token": refresh_token,
        "role": user.role,
        "user_id": user.id,
        "name": user.name,
        "email": user.email
    }

@router.get("/me", response_model=UserResponse, summary="Get Current User Profile")
def get_me(current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == current_user["email"]).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user

@router.post("/refresh", response_model=Token, summary="Refresh JWT Access Token")
def refresh_token(req: RefreshTokenRequest, db: Session = Depends(get_db)):
    payload = decode_token(req.refresh_token)
    if payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token type for refresh endpoint."
        )

    user = db.query(User).filter(User.email == payload.get("sub")).first()
    if not user or not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found or inactive")

    token_data = {"sub": user.email, "role": user.role, "user_id": user.id, "name": user.name}
    access_token = create_access_token(token_data)
    new_refresh = create_refresh_token(token_data)

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "refresh_token": new_refresh,
        "role": user.role,
        "user_id": user.id,
        "name": user.name,
        "email": user.email
    }
