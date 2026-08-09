-- ============================================================
-- care-mesh: 002_triage.sql
-- Triage sessions and symptom assessments
-- ============================================================

-- Urgency levels (standard ESI-inspired scale)
CREATE TYPE urgency_level AS ENUM ('critical', 'emergent', 'urgent', 'less_urgent', 'non_urgent');

-- Triage sessions — one per patient visit/contact
CREATE TABLE IF NOT EXISTS triage_sessions (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id      UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    initiated_by    UUID REFERENCES users(id) ON DELETE SET NULL,
    urgency_level   urgency_level,
    chief_complaint TEXT,
    ai_summary      TEXT,              -- Gemini-generated summary
    ai_raw_response JSONB,             -- Full AI response payload
    score           SMALLINT,          -- Computed triage score (0-100)
    is_complete     BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Individual symptom assessments within a session
CREATE TABLE IF NOT EXISTS symptom_assessments (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    triage_session_id   UUID NOT NULL REFERENCES triage_sessions(id) ON DELETE CASCADE,
    symptom_name        VARCHAR(255) NOT NULL,
    severity            SMALLINT CHECK (severity BETWEEN 1 AND 10),
    duration_hours      NUMERIC(8, 2),
    notes               TEXT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Vital signs recorded during triage
CREATE TABLE IF NOT EXISTS vital_signs (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    triage_session_id   UUID NOT NULL REFERENCES triage_sessions(id) ON DELETE CASCADE,
    recorded_by         UUID REFERENCES users(id) ON DELETE SET NULL,
    temperature_c       NUMERIC(5, 2),
    heart_rate_bpm      SMALLINT,
    respiratory_rate    SMALLINT,
    blood_pressure_sys  SMALLINT,
    blood_pressure_dia  SMALLINT,
    oxygen_saturation   NUMERIC(5, 2),
    weight_kg           NUMERIC(6, 2),
    height_cm           NUMERIC(6, 2),
    recorded_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_triage_sessions_patient   ON triage_sessions(patient_id);
CREATE INDEX idx_triage_sessions_urgency   ON triage_sessions(urgency_level);
CREATE INDEX idx_symptom_session           ON symptom_assessments(triage_session_id);
CREATE INDEX idx_vitals_session            ON vital_signs(triage_session_id);
