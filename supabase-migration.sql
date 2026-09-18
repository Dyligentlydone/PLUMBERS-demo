-- Supabase Migration for Plumber Pro
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  service_address TEXT NOT NULL,
  job_type TEXT NOT NULL,
  job_description TEXT NOT NULL,
  preferred_window TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'Scheduled' CHECK (status IN ('Scheduled', 'InProgress', 'Completed', 'Cancelled')),
  scheduled_arrival_window TEXT,
  eta_minutes INTEGER,
  cancellation_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_appointments_customer_id ON appointments(customer_id);
CREATE INDEX IF NOT EXISTS idx_appointments_phone ON appointments(phone);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_created_at ON appointments(created_at DESC);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_customers_updated_at ON customers;
CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_appointments_updated_at ON appointments;
CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust based on your auth needs)
-- For now, allowing all operations - you can restrict this later with authentication

-- Customers policies
CREATE POLICY "Allow all operations on customers" ON customers
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Appointments policies
CREATE POLICY "Allow all operations on appointments" ON appointments
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Insert sample data (optional - remove if you don't want sample data)
INSERT INTO customers (name, phone, email) VALUES
  ('John Smith', '517-555-0101', 'john.smith@email.com'),
  ('Sarah Johnson', '517-555-0102', 'sarah.j@email.com'),
  ('Mike Davis', '517-555-0103', NULL),
  ('Emily Brown', '517-555-0104', 'emily.brown@email.com')
ON CONFLICT (phone) DO NOTHING;

-- Insert sample appointments
INSERT INTO appointments (
  customer_id,
  customer_name,
  phone,
  email,
  service_address,
  job_type,
  job_description,
  preferred_window,
  scheduled_arrival_window,
  status,
  notes
)
SELECT 
  c.id,
  c.name,
  c.phone,
  c.email,
  '123 Main St, Lansing, MI 48933',
  'Drain Clog',
  'Kitchen sink backing up for 2 days',
  'Tomorrow, 2-4 PM',
  'Tomorrow, 2-4 PM',
  'Scheduled',
  'Customer mentioned hearing gurgling sounds'
FROM customers c WHERE c.phone = '517-555-0101'
ON CONFLICT DO NOTHING;

INSERT INTO appointments (
  customer_id,
  customer_name,
  phone,
  email,
  service_address,
  job_type,
  job_description,
  preferred_window,
  scheduled_arrival_window,
  status,
  notes
)
SELECT 
  c.id,
  c.name,
  c.phone,
  c.email,
  '456 Oak Ave, Lansing, MI 48912',
  'Water Heater Repair',
  'No hot water since this morning',
  'Today, 10 AM - 12 PM',
  'Today, 10 AM - 12 PM',
  'InProgress',
  'Water heater is 8 years old'
FROM customers c WHERE c.phone = '517-555-0102'
ON CONFLICT DO NOTHING;

INSERT INTO appointments (
  customer_id,
  customer_name,
  phone,
  email,
  service_address,
  job_type,
  job_description,
  preferred_window,
  scheduled_arrival_window,
  status
)
SELECT 
  c.id,
  c.name,
  c.phone,
  c.email,
  '789 Elm St, East Lansing, MI 48823',
  'Toilet Repair',
  'Toilet running constantly',
  'This week',
  'Friday, 1-3 PM',
  'Scheduled'
FROM customers c WHERE c.phone = '517-555-0103'
ON CONFLICT DO NOTHING;

-- Create a view for appointment statistics (useful for dashboard)
CREATE OR REPLACE VIEW appointment_stats AS
SELECT
  COUNT(*) FILTER (WHERE status = 'Scheduled') AS scheduled_count,
  COUNT(*) FILTER (WHERE status = 'InProgress') AS in_progress_count,
  COUNT(*) FILTER (WHERE status = 'Completed') AS completed_count,
  COUNT(*) FILTER (WHERE status = 'Cancelled') AS cancelled_count,
  COUNT(*) AS total_count,
  COUNT(*) FILTER (WHERE status = 'Completed' AND DATE(updated_at) = CURRENT_DATE) AS completed_today
FROM appointments;

-- Grant access to the view
GRANT SELECT ON appointment_stats TO anon, authenticated;

COMMENT ON TABLE customers IS 'Customer information for the plumbing business';
COMMENT ON TABLE appointments IS 'Service appointments and job details';
COMMENT ON VIEW appointment_stats IS 'Real-time statistics for the dashboard';

-- ============================================
-- Settings table (added for persistent config)
-- ============================================
CREATE TABLE IF NOT EXISTS settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  business_name TEXT NOT NULL DEFAULT 'Plumber Pro Services',
  business_phone TEXT NOT NULL DEFAULT '(555) 123-4567',
  business_email TEXT NOT NULL DEFAULT 'info@plumberpro.com',
  business_address TEXT NOT NULL DEFAULT '123 Main Street, Lansing, MI 48933',
  pricing_drain_clog_low INTEGER NOT NULL DEFAULT 150,
  pricing_drain_clog_high INTEGER NOT NULL DEFAULT 300,
  pricing_water_heater_low INTEGER NOT NULL DEFAULT 300,
  pricing_water_heater_high INTEGER NOT NULL DEFAULT 800,
  pricing_pipe_leak_low INTEGER NOT NULL DEFAULT 250,
  pricing_pipe_leak_high INTEGER NOT NULL DEFAULT 600,
  pricing_toilet_repair_low INTEGER NOT NULL DEFAULT 150,
  pricing_toilet_repair_high INTEGER NOT NULL DEFAULT 350,
  notify_new_appointments BOOLEAN NOT NULL DEFAULT true,
  notify_cancellations BOOLEAN NOT NULL DEFAULT true,
  notify_daily_summary BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert default settings row
INSERT INTO settings (id) VALUES ('default') ON CONFLICT (id) DO NOTHING;

-- RLS for settings
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations on settings" ON settings
  FOR ALL USING (true) WITH CHECK (true);

-- Updated_at trigger for settings
DROP TRIGGER IF EXISTS update_settings_updated_at ON settings;
CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
