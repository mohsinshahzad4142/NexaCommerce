from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = 'e89057bf5423'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    with op.batch_alter_table('product_images', schema=None) as batch_op:
        batch_op.alter_column('product_id', existing_type=sa.INTEGER(), nullable=True)

    with op.batch_alter_table('product_reviews', schema=None) as batch_op:
        batch_op.alter_column('product_id', existing_type=sa.INTEGER(), nullable=True)
        batch_op.alter_column('customer_name', existing_type=sa.VARCHAR(length=100), type_=sa.String(length=255), existing_nullable=True)

    with op.batch_alter_table('product_variants', schema=None) as batch_op:
        batch_op.alter_column('product_id', existing_type=sa.INTEGER(), nullable=True)
        batch_op.create_index('ix_product_variants_sku', ['sku'], unique=False)

    with op.batch_alter_table('products', schema=None) as batch_op:
        batch_op.add_column(sa.Column('scheduled_at', sa.DateTime(), nullable=True))
        batch_op.alter_column('status', existing_type=sa.VARCHAR(length=20), type_=sa.String(length=50), existing_nullable=True)
        try:
            batch_op.drop_index('ix_products_name')
        except Exception:
            pass

def downgrade() -> None:
    with op.batch_alter_table('products', schema=None) as batch_op:
        batch_op.drop_column('scheduled_at')
        batch_op.alter_column('status', existing_type=sa.String(length=50), type_=sa.VARCHAR(length=20), existing_nullable=True)
        batch_op.create_index('ix_products_name', ['name'], unique=False)

    with op.batch_alter_table('product_variants', schema=None) as batch_op:
        batch_op.drop_index('ix_product_variants_sku')
        batch_op.alter_column('product_id', existing_type=sa.INTEGER(), nullable=False)

    with op.batch_alter_table('product_reviews', schema=None) as batch_op:
        batch_op.alter_column('customer_name', existing_type=sa.String(length=255), type_=sa.VARCHAR(length=100), existing_nullable=True)
        batch_op.alter_column('product_id', existing_type=sa.INTEGER(), nullable=False)

    with op.batch_alter_table('product_images', schema=None) as batch_op:
        batch_op.alter_column('product_id', existing_type=sa.INTEGER(), nullable=False)