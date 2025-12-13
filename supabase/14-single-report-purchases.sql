-- ========================================
-- SINGLE REPORT PURCHASES TABLE
-- ========================================
-- Track one-time report purchases for customers
-- who buy individual property reports without subscribing

CREATE TABLE IF NOT EXISTS single_report_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_session_id TEXT UNIQUE NOT NULL,
  stripe_payment_intent_id TEXT,
  customer_email TEXT NOT NULL,
  property_address TEXT NOT NULL,
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7),
  zoning_district_id UUID REFERENCES zoning_districts(id),
  amount_paid INTEGER NOT NULL, -- in cents ($39.00 = 3900)
  pdf_generated BOOLEAN DEFAULT false,
  pdf_sent BOOLEAN DEFAULT false,
  pdf_url TEXT, -- Supabase storage URL if we store PDFs for re-download
  generated_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_single_report_email 
ON single_report_purchases(customer_email);

CREATE INDEX IF NOT EXISTS idx_single_report_session 
ON single_report_purchases(stripe_session_id);

CREATE INDEX IF NOT EXISTS idx_single_report_created 
ON single_report_purchases(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_single_report_address 
ON single_report_purchases(property_address);

-- Comments for documentation
COMMENT ON TABLE single_report_purchases IS 'Tracks one-time zoning report purchases ($39 each)';
COMMENT ON COLUMN single_report_purchases.stripe_session_id IS 'Stripe checkout session ID';
COMMENT ON COLUMN single_report_purchases.stripe_payment_intent_id IS 'Stripe payment intent ID';
COMMENT ON COLUMN single_report_purchases.customer_email IS 'Email address where report was sent';
COMMENT ON COLUMN single_report_purchases.property_address IS 'Full address of the property';
COMMENT ON COLUMN single_report_purchases.zoning_district_id IS 'Reference to zoning district found';
COMMENT ON COLUMN single_report_purchases.amount_paid IS 'Amount paid in cents (3900 = $39.00)';
COMMENT ON COLUMN single_report_purchases.pdf_generated IS 'Whether PDF was successfully generated';
COMMENT ON COLUMN single_report_purchases.pdf_sent IS 'Whether email was successfully sent';
COMMENT ON COLUMN single_report_purchases.pdf_url IS 'Storage URL if PDF is saved for re-download';
COMMENT ON COLUMN single_report_purchases.error_message IS 'Error message if generation or sending failed';

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_single_report_purchases_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_single_report_purchases_timestamp ON single_report_purchases;
CREATE TRIGGER update_single_report_purchases_timestamp
BEFORE UPDATE ON single_report_purchases
FOR EACH ROW
EXECUTE FUNCTION update_single_report_purchases_updated_at();

-- Enable Row Level Security
ALTER TABLE single_report_purchases ENABLE ROW LEVEL SECURITY;

-- Policy: Allow service role full access (for webhooks)
DROP POLICY IF EXISTS "Service role has full access to single_report_purchases" ON single_report_purchases;
CREATE POLICY "Service role has full access to single_report_purchases"
  ON single_report_purchases
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policy: Users can view their own purchases by email (if we add this feature later)
DROP POLICY IF EXISTS "Users can view their own single report purchases" ON single_report_purchases;
CREATE POLICY "Users can view their own single report purchases"
  ON single_report_purchases
  FOR SELECT
  TO authenticated
  USING (customer_email = auth.jwt() ->> 'email');

-- Statistics view for admin dashboard (optional)
CREATE OR REPLACE VIEW single_report_stats AS
SELECT
  COUNT(*) as total_reports,
  COUNT(DISTINCT customer_email) as unique_customers,
  SUM(amount_paid) / 100.0 as total_revenue,
  COUNT(*) FILTER (WHERE pdf_sent = true) as successful_deliveries,
  COUNT(*) FILTER (WHERE pdf_sent = false) as failed_deliveries,
  COUNT(*) FILTER (WHERE error_message IS NOT NULL) as errors,
  DATE_TRUNC('day', created_at) as report_date
FROM single_report_purchases
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY report_date DESC;

COMMENT ON VIEW single_report_stats IS 'Daily statistics for single report purchases';
