FROM python:3.12-slim

WORKDIR /app

COPY ./backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY ./alembic.ini .
COPY ./alembic /app/alembic
COPY ./backend /app/backend

EXPOSE 8000

CMD ["sh", "-c", "cd backend && alembic -c ../alembic.ini upgrade head && uvicorn main:app --host 0.0.0.0 --port 8000 --reload"]