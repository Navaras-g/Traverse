"""enable pgvector and add listing embeddings

Revision ID: 7892e0783fc9
Revises: 916d14d19772
Create Date: 2026-08-08 11:58:13.900231

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from pgvector.sqlalchemy import Vector


# revision identifiers, used by Alembic.
revision: str = '7892e0783fc9'
down_revision: Union[str, Sequence[str], None] = '916d14d19772'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.execute("CREATE EXTENSION IF NOT EXISTS vector")
    op.add_column("listings", sa.Column("embedding", Vector(384), nullable=True))


def downgrade():
    op.drop_column("listings", "embedding")
    op.execute("DROP EXTENSION IF EXISTS vector")