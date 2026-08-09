-- ============================================================
-- care-mesh: 003_care_plans.sql
-- Care plans and provider assignments
-- ============================================================

CREATE TYPE care_plan_status AS ENUM ('draft', 'active', 'on_hold', 'completed', 'cancelled');
CREATE TYPE task_status      AS ENUM ('pending', 'in_progress', 'completed', 'cancelled');

-- Care plans linked to a patient (and optionally a triage session)
CREATE TABLE IF NOT EXISTS care_plans (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id          UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    triage_session_id   UUID REFERENCES triage_sessions(id) ON DELETE SET NULL,
    created_by          UUID REFERENCES users(id) ON DELETE SET NULL,
    title               VARCHAR(255) NOT NULL,
    description         TEXT,
    status              care_plan_status NOT NULL DEFAULT 'draft',
    ai_recommendations  TEXT,          -- Gemini-generated recommendations
    start_date          DATE,
    end_date            DATE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Individual tasks within a care plan
CREATE TABLE IF NOT EXISTS care_tasks (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    care_plan_id    UUID NOT NULL REFERENCES care_plans(id) ON DELETE CASCADE,
    assigned_to     UUID REFERENCES users(id) ON DELETE SET NULL,
    title           VARCHAR(255) NOT NULL,
    description     TEXT,
    status          task_status NOT NULL DEFAULT 'pending',
    due_date        TIMESTAMPTZ,
    completed_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Provider assignments to patients
CREATE TABLE IF NOT EXISTS patient_provider_assignments (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id      UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    provider_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role            VARCHAR(64),       -- e.g. 'primary_physician', 'care_coordinator'
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    assigned_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(patient_id, provider_id)
);

-- Indexes
CREATE INDEX idx_care_plans_patient    ON care_plans(patient_id);
CREATE INDEX idx_care_plans_status     ON care_plans(status);
CREATE INDEX idx_care_tasks_plan       ON care_tasks(care_plan_id);
CREATE INDEX idx_care_tasks_assigned   ON care_tasks(assigned_to);
CREATE INDEX idx_assignments_patient   ON patient_provider_assignments(patient_id);
CREATE INDEX idx_assignments_provider  ON patient_provider_assignments(provider_id);
