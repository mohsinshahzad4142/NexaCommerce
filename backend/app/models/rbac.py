from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Text, Table
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base

class Permission(Base):
    __tablename__ = "permissions"

    id = Column(Integer, primary_key=True, index=True)
    resource = Column(String(50), nullable=False, index=True) # e.g., 'products', 'orders', 'users', 'reports', 'settings'
    action = Column(String(50), nullable=False, index=True)   # 'view', 'create', 'edit', 'delete', 'export', 'refund', 'manage_settings'
    name = Column(String(100), unique=True, nullable=False)   # e.g., 'orders:refund'
    description = Column(String(255), nullable=True)


class RolePermission(Base):
    __tablename__ = "role_permissions"

    id = Column(Integer, primary_key=True, index=True)
    role_id = Column(Integer, ForeignKey("roles.id", ondelete="CASCADE"), nullable=False)
    permission_id = Column(Integer, ForeignKey("permissions.id", ondelete="CASCADE"), nullable=False)


class Role(Base):
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False, index=True) # 'Super Admin', 'Product Manager', etc.
    description = Column(Text, nullable=True)
    is_system_role = Column(Boolean, default=False) # Prevents deletion of core roles
    created_at = Column(DateTime, default=datetime.utcnow)

    permissions = relationship("Permission", secondary="role_permissions", backref="roles")


class UserRoleAssignment(Base):
    __tablename__ = "user_role_assignments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    role_id = Column(Integer, ForeignKey("roles.id", ondelete="CASCADE"), nullable=False)
    assigned_at = Column(DateTime, default=datetime.utcnow)