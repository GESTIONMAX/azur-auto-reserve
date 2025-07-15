-- Create the vehicle_info table to store vehicle information
CREATE TABLE IF NOT EXISTS vehicle_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plate TEXT NOT NULL UNIQUE,
  marque TEXT,
  modele TEXT,
  carrosserie TEXT,
  couleur TEXT,
  energie TEXT,
  annee TEXT,
  puissance_fiscale TEXT,
  puissance_din TEXT,
  nombre_places TEXT,
  date_mise_en_circulation TEXT,
  donnees_brutes JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index on plate for faster lookups
CREATE INDEX IF NOT EXISTS idx_vehicle_info_plate ON vehicle_info(plate);

-- Add comment to the table
COMMENT ON TABLE vehicle_info IS 'Table to cache vehicle information from external API';

-- Create a trigger to update the updated_at field automatically
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON vehicle_info
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- Enable Row Level Security
ALTER TABLE vehicle_info ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Policy allowing authenticated users full access
CREATE POLICY "Authenticated users can do everything"
  ON vehicle_info
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy allowing anonymous users read-only access
CREATE POLICY "Anonymous users can view vehicle data"
  ON vehicle_info
  FOR SELECT
  TO anon
  USING (true);
