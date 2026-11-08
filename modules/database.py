import sqlite3
from pathlib import Path
from datetime import datetime

DB_PATH = Path(__file__).resolve().parent.parent / "clinic_records.db"

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    # Patients Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS patients (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            age INTEGER NOT NULL,
            gender TEXT NOT NULL,
            contact TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # Diagnostic Records Table (matches save_diagnostic_record columns)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS diagnostic_records (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            patient_name TEXT NOT NULL,
            contact TEXT NOT NULL,
            disease_title TEXT NOT NULL,
            risk_score REAL NOT NULL,
            report_summary TEXT,
            remedies TEXT,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # Appointments Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS appointments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            booking_ref TEXT UNIQUE NOT NULL,
            patient_name TEXT NOT NULL,
            doctor_name TEXT NOT NULL,
            hospital TEXT NOT NULL,
            slot_time TEXT NOT NULL,
            fee REAL NOT NULL,
            city TEXT NOT NULL,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    conn.commit()
    conn.close()

def save_patient(name: str, age: int, gender: str, contact: str):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO patients (name, age, gender, contact) VALUES (?, ?, ?, ?)",
        (name, age, gender, contact)
    )
    conn.commit()
    conn.close()

def save_diagnostic_record(patient_name: str, contact: str, disease_title: str, risk_score: float, report_summary: str, remedies: str):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        """
        INSERT INTO diagnostic_records 
        (patient_name, contact, disease_title, risk_score, report_summary, remedies, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """,
        (patient_name, contact, disease_title, risk_score, report_summary, remedies, datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
    )
    conn.commit()
    conn.close()

def save_appointment(booking_ref: str, patient_name: str, doctor_name: str, hospital: str, slot_time: str, fee: float, city: str):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        """
        INSERT OR REPLACE INTO appointments 
        (booking_ref, patient_name, doctor_name, hospital, slot_time, fee, city, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (booking_ref, patient_name, doctor_name, hospital, slot_time, fee, city, datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
    )
    conn.commit()
    conn.close()