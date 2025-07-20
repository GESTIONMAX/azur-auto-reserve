-- Create vehicle_info table for storing vehicle data
CREATE TABLE IF NOT EXISTS public.vehicle_info (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plate TEXT NOT NULL UNIQUE,
    marque TEXT,
    modele TEXT,
    carrosserie TEXT,
    couleur TEXT,
    energie TEXT,
    annee INTEGER,
    puissance_fiscale INTEGER,
    puissance_din INTEGER,
    nombre_places INTEGER,
    date_mise_en_circulation DATE,
    derniere_mise_a_jour TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    donnees_brutes JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for quick lookups by plate
CREATE INDEX IF NOT EXISTS idx_vehicle_info_plate ON public.vehicle_info(plate);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at on each update
DROP TRIGGER IF EXISTS set_timestamp_vehicle_info ON public.vehicle_info;
CREATE TRIGGER set_timestamp_vehicle_info
BEFORE UPDATE ON public.vehicle_info
FOR EACH ROW
EXECUTE PROCEDURE update_modified_column();

-- RLS (Row Level Security) policy
ALTER TABLE public.vehicle_info ENABLE ROW LEVEL SECURITY;

-- Allow all operations for authenticated users
CREATE POLICY "Allow all operations for authenticated users" ON public.vehicle_info
FOR ALL
TO authenticated
USING (true);

-- Allow read-only access for anonymous users
CREATE POLICY "Allow read for anonymous users" ON public.vehicle_info
FOR SELECT
TO anon
USING (true);

-- Comment on table and columns
COMMENT ON TABLE public.vehicle_info IS 'Stores vehicle information';
COMMENT ON COLUMN public.vehicle_info.plate IS 'Vehicle license plate (unique identifier)';
COMMENT ON COLUMN public.vehicle_info.donnees_brutes IS 'Raw data of vehicle information';
