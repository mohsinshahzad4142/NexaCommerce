from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.db.database import get_db
from app.schemas.rbac import (
    PermissionSchema, RoleCreateSchema, RoleResponseSchema,
    UserRoleAssignSchema, UserPermissionsSummaryResponse
)
from app.services.rbac_service import RBACService
from app.models.rbac import Role, Permission, UserRoleAssignment
from app.models.user import User

router = APIRouter()

# --- 1. SEED DEFAULT ROLES & PERMISSIONS ---
@router.post("/admin/rbac/seed")
def seed_rbac_matrix(db: Session = Depends(get_db)):
    RBACService.seed_permissions_and_roles(db)
    return {"message": "RBAC Roles and Permissions successfully initialized and seeded."}


# --- 2. LIST PERMISSIONS & ROLES ---
@router.get("/admin/rbac/permissions", response_model=List[PermissionSchema])
def list_all_permissions(db: Session = Depends(get_db)):
    return db.query(Permission).all()


@router.get("/admin/rbac/roles", response_model=List[RoleResponseSchema])
def list_all_roles(db: Session = Depends(get_db)):
    return db.query(Role).all()


# --- 3. CREATE CUSTOM ROLE WITH PERMISSIONS ---
@router.post("/admin/rbac/roles", response_model=RoleResponseSchema)
def create_custom_role(role_in: RoleCreateSchema, db: Session = Depends(get_db)):
    existing = db.query(Role).filter(Role.name == role_in.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Role with this name already exists")

    perms = db.query(Permission).filter(Permission.id.in_(role_in.permission_ids)).all()
    
    new_role = Role(
        name=role_in.name,
        description=role_in.description,
        is_system_role=False,
        permissions=perms
    )
    db.add(new_role)
    db.commit()
    db.refresh(new_role)
    return new_role


# --- 4. ASSIGN ROLES TO STAFF MEMBER ---
@router.post("/admin/rbac/assign-roles")
def assign_user_roles(assignment: UserRoleAssignSchema, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == assignment.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Clear old assignments
    db.query(UserRoleAssignment).filter(UserRoleAssignment.user_id == assignment.user_id).delete()

    for role_id in assignment.role_ids:
        db.add(UserRoleAssignment(user_id=assignment.user_id, role_id=role_id))

    db.commit()
    return {"message": f"Successfully assigned roles to User ID {assignment.user_id}"}


# --- 5. CHECK CURRENT USER PERMISSIONS SUMMARY ---
@router.get("/admin/rbac/user-permissions/{user_id}", response_model=UserPermissionsSummaryResponse)
def get_user_permissions_summary(user_id: int, db: Session = Depends(get_db)):
    return RBACService.get_user_permissions(db, user_id)