DELIMITER $$

DROP PROCEDURE IF EXISTS patch_todotrabajo_schema $$
CREATE PROCEDURE patch_todotrabajo_schema()
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'users'
      AND COLUMN_NAME = 'is_active'
  ) THEN
    ALTER TABLE users
      ADD COLUMN is_active TINYINT(1) NOT NULL DEFAULT 1 AFTER tipo_cuenta;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'users'
      AND COLUMN_NAME = 'approval_status'
  ) THEN
    ALTER TABLE users
      ADD COLUMN approval_status VARCHAR(20) NOT NULL DEFAULT 'approved' AFTER is_active;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'users'
      AND COLUMN_NAME = 'reset_token'
  ) THEN
    ALTER TABLE users
      ADD COLUMN reset_token VARCHAR(255) NULL AFTER is_active;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'users'
      AND COLUMN_NAME = 'reset_token_expires'
  ) THEN
    ALTER TABLE users
      ADD COLUMN reset_token_expires DATETIME NULL AFTER reset_token;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'job_postings'
      AND COLUMN_NAME = 'is_active'
  ) THEN
    ALTER TABLE job_postings
      ADD COLUMN is_active TINYINT(1) NOT NULL DEFAULT 1 AFTER requiere_salario;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'job_postings'
      AND COLUMN_NAME = 'approval_status'
  ) THEN
    ALTER TABLE job_postings
      ADD COLUMN approval_status VARCHAR(20) NOT NULL DEFAULT 'pending' AFTER is_active;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'companies'
      AND COLUMN_NAME = 'logo_url'
  ) THEN
    ALTER TABLE companies
      ADD COLUMN logo_url VARCHAR(255) NULL AFTER direccion;
  END IF;
END $$

CALL patch_todotrabajo_schema() $$
DROP PROCEDURE IF EXISTS patch_todotrabajo_schema $$

DELIMITER ;
