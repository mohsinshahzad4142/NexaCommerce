from sqlalchemy.orm import Session
from fastapi import HTTPException, status, Depends
from typing import List, Dict, Any, Callable

from app.models.rbac import Role, Permission, RolePermission, UserRoleAssignment
from app.models.user import User

# CORE RESOURCES & ACTIONS DEFINITION
RESOURCES = ["products", "orders", "customers", "inventory", "reports", "settings", "marketing"]
ACTIONS = ["view", "create", "edit", "delete", "export", "refund", "manage_settings"]

# DEFAULT SYSTEM ROLES & PERMISSIONS MATRIX
DEFAULT_ROLES = {
    "Super Admin": {"description": "Full un-restricted administrative control", "all": True},
    "Admin": {"description": "General store admin (All operations except core system modifications)", "actions": ["view", "create", "edit", "delete", "export", "refund"]},
    "Manager": {"description": "Operations Manager handling day-to-day operations", "actions": ["view", "create", "edit", "export"]},
    "Product Manager": {"resources": ["products", "inventory"], "actions": ["view", "create", "edit", "delete", "export"]},
    "Order Manager": {"resources": ["orders", "reports"], "actions": ["view", "edit", "refund", "export"]},
    "Customer Support": {"resources": ["orders", "customers", "products"], "actions": ["view", "edit", "refund"]},
    "Warehouse Staff": {"resources": ["inventory", "products", "orders"], "actions": ["view", "edit"]},
    "Accountant": {"resources": ["orders", "reports", "settings"], "actions": ["view", "export"]}
}

class RBACService:

    @staticmethod
    def seed_permissions_and_roles(db: Session):
        # 1. Create All Action/Resource Permissions
        for res in RESOURCES:
            for act in ACTIONS:
                perm_name = f"{res}:{act}"
                existing = db.query(Permission).filter(Permission.name == perm_name).first()
                if not existing:
                    db.add(Permission(resource=res, action=act, name=perm_name, description=f"Permission to {act} on {res}"))
        db.commit()

        # 2. Seed Default Roles
        all_perms = db.query(Permission).all()
        perm_map = {p.name: p for p in all_perms}

        for role_name, config in DEFAULT_ROLES.items():
            role = db.query(Role).filter(Role.name == role_name).first()
            if not role:
                role = Role(name=role_name, description=config["description"], is_system_role=True)
                db.add(role)
                db.commit()
                db.refresh(role)

            # Assign Permissions based on matrix
            role_perms_to_add = []
            if config.get("all"):
                role_perms_to_add = all_perms
            else:
                target_resources = config.get("resources", RESOURCES)
                target_actions = config.get("actions", ACTIONS)
                for res in target_resources:
                    for act in target_actions:
                        p_name = f"{res}:{act}"
                        if p_name in perm_map:
                            role_perms_to_add.append(perm_map[p_name])

            # Sync permissions
            role.permissions = role_perms_to_add
            db.commit()

    @staticmethod
    def get_user_permissions(db: Session, user_id: int) -> Dict[str, Any]:
        assignments = db.query(UserRoleAssignment).filter(UserRoleAssignment.user_id == user_id).all()
        role_ids = [a.role_id for a in assignments]

        roles = db.query(Role).filter(Role.id.in_(role_ids)).all()
        role_names = [r.name for r in roles]

        # Check for Super Admin
        if "Super Admin" in role_names:
            all_perms = db.query(Permission).all()
            return {
                "user_id": user_id,
                "roles": role_names,
                "permissions": [p.name for p in all_perms]
            }

        permission_names = set()
        for r in roles:
            for p in r.permissions:
                permission_names.add(p.name)

        return {
            "user_id": user_id,
            "roles": role_names,
            "permissions": list(permission_names)
        }

    @staticmethod
    def verify_permission(db: Session, user_id: int, required_permission: str) -> bool:
        user_perm_data = RBACService.get_user_permissions(db, user_id)
        if "Super Admin" in user_perm_data["roles"]:
            return True
        return required_permission in user_perm_data["permissions"]


# FASTAPI DEPENDENCY GUARD FOR API ENDPOINTS
def require_permission(required_permission: str):
    def dependency(user_id: int = 1, db: Session = Depends()):
        # Note: In production 'user_id' comes from JWT Auth token middleware
        has_perm = RBACService.verify_permission(db, user_id, required_permission)
        if not has_perm:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access Denied: You lack the required permission '{required_permission}'"
            )
        return True
    return dependency