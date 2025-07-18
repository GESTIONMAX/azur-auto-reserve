-- Create vehicle_info table to store information about vehicles
create table public.vehicle_info (
  id uuid not null default gen_random_uuid (),
  plate text not null,
  marque text null,
  modele text null,
  carrosserie text null,
  couleur text null,
  energie text null,
  annee integer null,
  puissance_fiscale integer null,
  puissance_din integer null,
  nombre_places integer null,
  date_mise_en_circulation date null,
  derniere_mise_a_jour timestamp with time zone null default now(),
  donnees_brutes jsonb null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint vehicle_info_pkey primary key (id),
  constraint vehicle_info_plate_key unique (plate)
) TABLESPACE pg_default;

-- Create index on plate field for faster lookups
create index IF not exists idx_vehicle_info_plate on public.vehicle_info using btree (plate) TABLESPACE pg_default;

-- Create trigger to automatically update the updated_at timestamp on each row update
create trigger set_timestamp_vehicle_info BEFORE
update on vehicle_info for EACH row
execute FUNCTION update_updated_at_column ();

-- Create function to get vehicle information by plate number
CREATE OR REPLACE FUNCTION public.get_vehicle_info(plaque TEXT)
RETURNS JSONB AS $$
DECLARE
  vehicle_data JSONB;
BEGIN
  -- Check if we have the vehicle info in our cache
  SELECT donnees_brutes INTO vehicle_data 
  FROM vehicle_info 
  WHERE plate = plaque;
  
  -- If found in cache, return it
  IF vehicle_data IS NOT NULL THEN
    RETURN json_build_object(
      'success', true,
      'vehicle_data', vehicle_data,
      'source', 'cache'
    );
  END IF;
  
  -- If not found in cache, return an empty result
  -- Note: The actual API call will be handled by the frontend or a server-side function
  RETURN json_build_object(
    'success', false,
    'message', 'Vehicle information not found in cache'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.get_vehicle_info(plaque TEXT) IS 'Get vehicle information by plate number';
