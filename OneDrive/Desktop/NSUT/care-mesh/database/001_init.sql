-- ============================================================
-- care-mesh: 001_init.sql
-- Initial schema — users and patients
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Roles for system users (care providers)
CREATE TYPE user_role AS ENUM ('admin', 'doctor', 'nurse', 'coordinator', 'patient');

-- Users (care providers + system admins)
CREATE TABLE IF NOT EXISTS users (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email         VARCHAR(255) NOT NULL UNIQUE,
    hashed_password TEXT NOT NULL,
    full_name     VARCHAR(255) NOT NULL,
    role          user_role NOT NULL DEFAULT 'coordinator',
    is_active     BOOLEAN NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Patients
CREATE TABLE IF NOT EXISTS patients (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mrn           VARCHAR(64) UNIQUE,               -- Medical Record Number
    first_name    VARCHAR(128) NOT NULL,
    last_name     VARCHAR(128) NOT NULL,
    date_of_birth DATE,
    gender        VARCHAR(32),
    phone         VARCHAR(32),
    email         VARCHAR(255),
    address       TEXT,
    emergency_contact_name  VARCHAR(255),
    emergency_contact_phone VARCHAR(32),
    created_by    UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_users_email        ON users(email);
CREATE INDEX idx_patients_mrn       ON patients(mrn);
CREATE INDEX idx_patients_last_name ON patients(last_name);
