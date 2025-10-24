from sqlalchemy import Column, String, Boolean, DateTime
from sqlalchemy.dialects.postgresql import UUID
import uuid
from db import Base


class Todo(Base):
    __tablename__ = "todos"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    description = Column(String)
    due = Column(DateTime)
    priority = Column(String)
    done = Column(Boolean, default=False, nullable=False)
