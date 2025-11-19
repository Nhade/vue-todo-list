from datetime import datetime
from uuid import UUID

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session

from db import SessionLocal
from models import Todo, Project

app = FastAPI()

origins = ["http://localhost:5173", "https://localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Pydantic schemas
class TodoCreate(BaseModel):
    name: str
    description: str | None = None
    due: datetime | None = None
    priority: str | None = None
    project_id: UUID


class TodoRead(BaseModel):
    id: UUID
    name: str
    description: str | None = None
    due: datetime | None = None
    priority: str | None = None
    done: bool
    project_id: UUID

    class Config:
        from_attributes = True


class TodoUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    due: datetime | None = None
    priority: str | None = None
    done: bool | None = None
    project_id: UUID | None = None


class ProjectRead(BaseModel):
    id: UUID
    name: str

    class Config:
        from_attributes = True


class ProjectCreate(BaseModel):
    name: str


# DB dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI"}


# CRUD
@app.get("/projects", response_model=list[ProjectRead])
def list_projects(db: Session = Depends(get_db)):
    return db.query(Project).all()


@app.post("/projects", response_model=ProjectRead, status_code=201)
def create_project(payload: ProjectCreate, db: Session = Depends(get_db)):
    project = Project(**payload.dict())
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


@app.delete("/projects/{project_id}", status_code=204)
def delete_project(project_id: UUID, db: Session = Depends(get_db)):
    project = db.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(project)
    db.commit()
    return


@app.get("/todos", response_model=list[TodoRead])
def list_todos(project_id: UUID | None = None, db: Session = Depends(get_db)):
    query = db.query(Todo)
    if project_id:
        query = query.filter(Todo.project_id == project_id)
    return query.all()


@app.post("/todos", response_model=TodoRead, status_code=201)
def create_todo(payload: TodoCreate, db: Session = Depends(get_db)):
    todo = Todo(**payload.dict(), done=False)
    db.add(todo)
    db.commit()
    db.refresh(todo)
    return todo


@app.patch("/todos/{todo_id}", response_model=TodoRead)
def update_todo(todo_id: UUID, payload: TodoUpdate, db: Session = Depends(get_db)):
    todo = db.get(Todo, todo_id)
    if not todo:
        raise HTTPException(status_code=404, detail="Not found")
    update_data = payload.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(todo, key, value)
    db.commit()
    db.refresh(todo)
    return todo


@app.delete("/todos/{todo_id}", status_code=204)
def delete_todo(todo_id: UUID, db: Session = Depends(get_db)):
    todo = db.get(Todo, todo_id)
    if not todo:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(todo)
    db.commit()
    return
