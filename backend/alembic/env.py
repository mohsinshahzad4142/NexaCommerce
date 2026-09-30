from logging.config import fileConfig
import os
import sys
from sqlalchemy import engine_from_config
from sqlalchemy import pool
from alembic import context

# Add backend directory to sys.path
sys.path.insert(0, os.path.realpath(os.path.join(os.path.dirname(__file__), '..')))

from app.db.database import Base
from app.core.config import settings

# Import all models to ensure metadata registration
import app.models.accounting
import app.models.analytics
import app.models.automation
import app.models.cart
import app.models.category
import app.models.coupon
import app.models.dashboard
import app.models.integration
import app.models.inventory
import app.models.marketing
import app.models.mobile_app
import app.models.multitenant_vendor
import app.models.notifications
import app.models.order
import app.models.plugin
import app.models.product
import app.models.rbac
import app.models.security
import app.models.seo
import app.models.settings
import app.models.shipping
import app.models.user

config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Dynamic DB URL override from FastAPI config
db_url = getattr(settings, "DATABASE_URL", getattr(settings, "database_url", "sqlite:///./sql_app.db"))
config.set_main_option("sqlalchemy.url", str(db_url))

target_metadata = Base.metadata

def run_migrations_offline() -> None:
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online() -> None:
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )
    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata
        )
        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()