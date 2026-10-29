CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- table USERS

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role Varchar(20) NOT NULL DEFAULT 'USER' CHECK (role IN ('USER', 'ANALYST', 'ADMIN')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- table ASSETS

CREATE TABLE IF NOT EXISTS assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    ip_address INET NOT NULL,
    type VARCHAR(30) NOT NULL CHECK (type IN ('SERVER', 'DATABASE', 'WEB_APP', 'CONTAINER')),
    environment VARCHAR(20) NOT NULL CHECK (environment IN ('PRODUCTION', 'STAGING', 'DEVELOPMENT')),
    created_by UUID NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_asset_user FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- table VULNERABILITIES

CREATE TABLE IF NOT EXISTS vulnerabilities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    cve_id VARCHAR(20),
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    status VARCHAR(20) NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'IN_PROGRESS', 'FIXED', 'MITIGATED')),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_vulnerability_asset FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE
);

-- index de performance

CREATE INDEX IF NOT EXISTS idx_assets_user ON assets(created_by);
CREATE INDEX IF NOT EXISTS idx_vulnerabilities_asset ON vulnerabilities(asset_id);
CREATE INDEX IF NOT EXISTS idx_vulnerabilities_severity ON vulnerabilities(severity);