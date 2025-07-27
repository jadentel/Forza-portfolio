# Use an official Python runtime as a parent image
FROM python:3.9-slim as base
WORKDIR /app
COPY ./requirements.txt .
RUN python -m pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# Make port 5001 available to the world outside this container
EXPOSE 5001

# Define environment variable
ENV FLASK_APP=run.py

FROM base as production
COPY . .
CMD ["flask", "run"]

