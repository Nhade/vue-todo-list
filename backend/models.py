from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid
from db import Base


class Project(Base):
    __tablename__ = "projects"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)

    todos = relationship("Todo", back_populates="project", cascade="all, delete-orphan")


class Todo(Base):
    __tablename__ = "todos"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    description = Column(String)
    due = Column(DateTime)
    priority = Column(String)
    done = Column(Boolean, default=False, nullable=False)

    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id"), nullable=False)
    project = relationship("Project", back_populates="todos")
