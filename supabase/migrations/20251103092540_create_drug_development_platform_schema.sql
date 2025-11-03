/*
  # Drug Development Platform Schema

  1. New Tables
    - `development_processes`
      - `id` (uuid, primary key)
      - `title` (text) - Process name
      - `phase` (text) - Development phase (Pre-formulation, Formulation, Scale-up, etc.)
      - `description` (text) - Detailed description
      - `steps` (jsonb) - Array of process steps
      - `timeline` (text) - Typical timeline
      - `key_considerations` (text) - Important factors
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `troubleshooting_guides`
      - `id` (uuid, primary key)
      - `title` (text) - Problem title
      - `category` (text) - Issue category (Dissolution, Stability, Processing, etc.)
      - `problem_description` (text) - Detailed problem description
      - `root_causes` (jsonb) - Array of potential causes
      - `solutions` (jsonb) - Array of solutions
      - `case_studies` (text) - Real-world examples
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `regulatory_resources`
      - `id` (uuid, primary key)
      - `title` (text) - Resource title
      - `region` (text) - Regulatory region (FDA, EMA, ICH, etc.)
      - `document_type` (text) - Type of document (Guideline, Q&A, Policy, etc.)
      - `summary` (text) - Brief summary
      - `key_points` (jsonb) - Main takeaways
      - `url` (text) - External reference link
      - `effective_date` (date) - When it became effective
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `user_bookmarks`
      - `id` (uuid, primary key)
      - `user_id` (uuid) - References auth.users
      - `resource_type` (text) - Type of resource bookmarked
      - `resource_id` (uuid) - ID of bookmarked resource
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Public read access for main content tables
    - Authenticated users can manage their own bookmarks
*/

-- Create development_processes table
CREATE TABLE IF NOT EXISTS development_processes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  phase text NOT NULL,
  description text NOT NULL,
  steps jsonb DEFAULT '[]'::jsonb,
  timeline text DEFAULT '',
  key_considerations text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE development_processes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view development processes"
  ON development_processes FOR SELECT
  USING (true);

-- Create troubleshooting_guides table
CREATE TABLE IF NOT EXISTS troubleshooting_guides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL,
  problem_description text NOT NULL,
  root_causes jsonb DEFAULT '[]'::jsonb,
  solutions jsonb DEFAULT '[]'::jsonb,
  case_studies text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE troubleshooting_guides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view troubleshooting guides"
  ON troubleshooting_guides FOR SELECT
  USING (true);

-- Create regulatory_resources table
CREATE TABLE IF NOT EXISTS regulatory_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  region text NOT NULL,
  document_type text NOT NULL,
  summary text NOT NULL,
  key_points jsonb DEFAULT '[]'::jsonb,
  url text DEFAULT '',
  effective_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE regulatory_resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view regulatory resources"
  ON regulatory_resources FOR SELECT
  USING (true);

-- Create user_bookmarks table
CREATE TABLE IF NOT EXISTS user_bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  resource_type text NOT NULL,
  resource_id uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, resource_type, resource_id)
);

ALTER TABLE user_bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bookmarks"
  ON user_bookmarks FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own bookmarks"
  ON user_bookmarks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own bookmarks"
  ON user_bookmarks FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Insert sample data for development_processes
INSERT INTO development_processes (title, phase, description, steps, timeline, key_considerations) VALUES
('API Characterization & Preformulation', 'Pre-formulation', 'Comprehensive evaluation of Active Pharmaceutical Ingredient properties to guide formulation development', 
'[
  {"step": "Physical characterization", "details": "Particle size, morphology, crystal form"},
  {"step": "Chemical stability assessment", "details": "pH stability, oxidation, hydrolysis studies"},
  {"step": "Solubility studies", "details": "pH-solubility profile, co-solvent screening"},
  {"step": "Compatibility studies", "details": "API-excipient compatibility via DSC, FTIR"}
]'::jsonb,
'2-4 months',
'Critical for formulation strategy selection. Polymorphism screening essential for generic products to match RLD'),

('Immediate Release Tablet Development', 'Formulation Development', 'Design and optimization of IR tablets ensuring bioequivalence to Reference Listed Drug',
'[
  {"step": "Formulation design", "details": "Select excipients based on API properties"},
  {"step": "Prototype preparation", "details": "Direct compression or wet granulation"},
  {"step": "Dissolution optimization", "details": "Match RLD dissolution profile (f2 > 50)"},
  {"step": "Stability testing", "details": "ICH stability conditions"}
]'::jsonb,
'4-6 months',
'Dissolution profile matching is critical for bioequivalence. Consider BCS classification for biowaiver opportunities'),

('Bioequivalence Study Design', 'Clinical Development', 'Plan and execute BE studies to demonstrate therapeutic equivalence to RLD',
'[
  {"step": "Protocol development", "details": "Design crossover study with appropriate washout"},
  {"step": "Analytical method validation", "details": "Bioanalytical method for PK analysis"},
  {"step": "Study execution", "details": "Conduct fasted/fed BE studies"},
  {"step": "Statistical analysis", "details": "90% CI for AUC and Cmax within 80-125%"}
]'::jsonb,
'8-12 months',
'Study design must follow FDA BE guidance. Food effect studies may be required based on labeling'),

('Commercial Scale-Up', 'Scale-up & Tech Transfer', 'Transfer validated formulation to commercial manufacturing scale',
'[
  {"step": "Equipment qualification", "details": "IQ/OQ/PQ of commercial equipment"},
  {"step": "Process parameter scaling", "details": "Adjust mixing time, compression force"},
  {"step": "Validation batches", "details": "3 consecutive commercial batches"},
  {"step": "Stability commitment", "details": "Long-term stability on commercial batches"}
]'::jsonb,
'6-9 months',
'Scale-up changes must not impact dissolution. Process validation per ICH Q7 requirements');

-- Insert sample data for troubleshooting_guides
INSERT INTO troubleshooting_guides (title, category, problem_description, root_causes, solutions, case_studies) VALUES
('Slow Dissolution Rate', 'Dissolution', 'Tablet fails to meet dissolution specifications or does not match RLD profile', 
'[
  {"cause": "Poor API wetting", "explanation": "Hydrophobic API surface prevents dissolution media penetration"},
  {"cause": "Inappropriate disintegrant selection", "explanation": "Insufficient or incompatible super-disintegrant"},
  {"cause": "High compression force", "explanation": "Over-compression reduces porosity and water uptake"},
  {"cause": "Polymorphic form differences", "explanation": "Less soluble polymorph than RLD"}
]'::jsonb,
'[
  {"solution": "Add surfactant", "implementation": "Include 0.1-1% SLS or polysorbate in formulation"},
  {"solution": "Optimize disintegrant", "implementation": "Screen croscarmellose, crospovidone, sodium starch glycolate at 2-8%"},
  {"solution": "Reduce compression force", "implementation": "Lower hardness target while maintaining acceptable friability"},
  {"solution": "Particle size reduction", "details": "Micronize API or use wet granulation for better dispersion"}
]'::jsonb,
'Metformin tablet: Initial f2=42 vs RLD. Root cause: inadequate disintegration. Solution: Increased croscarmellose from 3% to 6% and added 0.25% SLS. Result: f2=68, successful BE study'),

('Content Uniformity Failure', 'Processing', 'Individual tablet potency outside 85-115% range or RSD >6%', 
'[
  {"cause": "Inadequate blending", "explanation": "Insufficient mixing time or improper blender loading"},
  {"cause": "Low dose API (<25mg)", "explanation": "Challenging to achieve uniform distribution"},
  {"cause": "Segregation during transfer", "explanation": "Particle size differences causing separation"},
  {"cause": "Poor flow properties", "explanation": "Inconsistent die filling"}
]'::jsonb,
'[
  {"solution": "Extend blending time", "implementation": "Validate blend uniformity at multiple intervals"},
  {"solution": "Geometric dilution", "implementation": "Pre-blend API with portion of excipient before final blend"},
  {"solution": "Use dry granulation", "implementation": "Roller compaction creates uniform granules"},
  {"solution": "Add glidant/lubricant", "details": "Optimize colloidal silica and magnesium stearate levels"}
]'::jsonb,
'Low dose levothyroxine tablet: CU failures due to poor API distribution. Solution: Three-step blending process with geometric dilution and extended final blend time (15 min). Validated with 10 blend samples achieving RSD <3%'),

('Stability Failure - Assay Decrease', 'Stability', 'API degradation during stability testing below 95% specification', 
'[
  {"cause": "Oxidative degradation", "explanation": "API susceptible to oxygen in presence of moisture"},
  {"cause": "Moisture-induced hydrolysis", "explanation": "Insufficient moisture protection"},
  {"cause": "Incompatible excipients", "explanation": "Excipients catalyze API degradation"},
  {"cause": "Light exposure", "explanation": "Photolabile API"}
]'::jsonb,
'[
  {"solution": "Add antioxidant", "implementation": "Include BHT, BHA, or ascorbic acid 0.01-0.1%"},
  {"solution": "Reduce moisture content", "implementation": "Control granulation moisture, use low-moisture excipients"},
  {"solution": "Optimize packaging", "implementation": "Use HDPE bottles with desiccant or alu-alu blisters"},
  {"solution": "Replace excipient", "details": "Switch to lower-moisture grade or different supplier"}
]'::jsonb,
'Enalapril tablet: 8% degradation at 6 months 40°C/75%RH. Root cause: Reactive lactose. Solution: Replaced lactose with microcrystalline cellulose and added 0.05% BHT. Stability improved to <2% degradation at 12 months');

-- Insert sample data for regulatory_resources
INSERT INTO regulatory_resources (title, region, document_type, summary, key_points, url, effective_date) VALUES
('Bioequivalence Studies with Pharmacokinetic Endpoints for Generic Drugs', 'FDA', 'Guidance', 'Comprehensive guidance on BE study design and requirements for ANDAs',
'[
  "Single-dose, randomized, crossover design is standard",
  "90% confidence interval for AUC and Cmax must be within 80-125%",
  "Both fasted and fed studies may be required based on labeling",
  "Pilot BE studies acceptable with adequate justification",
  "Reference-scaled average BE for highly variable drugs (sIV >30%)"
]'::jsonb,
'https://www.fda.gov/regulatory-information/search-fda-guidance-documents',
'2021-12-01'),

('ICH Q1A(R2) Stability Testing Guidelines', 'ICH', 'Guideline', 'International harmonized requirements for stability testing of new drug substances and products',
'[
  "Long-term: 25±2°C/60±5%RH for minimum 12 months",
  "Accelerated: 40±2°C/75±5%RH for minimum 6 months",
  "Intermediate conditions may be required if significant change at accelerated",
  "Minimum 3 batches for registration",
  "Testing intervals: 0, 3, 6, 9, 12, 18, 24 months for long-term"
]'::jsonb,
'https://www.ich.org/page/quality-guidelines',
'2003-02-01'),

('ANDA Submissions - Refuse to Receive Standards', 'FDA', 'Policy', 'Standards for accepting ANDA submissions for scientific review',
'[
  "Submission must be in eCTD format",
  "All CMC sections must be complete",
  "BE studies must meet acceptance criteria or provide scientific justification",
  "Adequate stability data required (minimum 6 months accelerated + 6 months long-term)",
  "Dissolution methods must be validated and discriminatory"
]'::jsonb,
'https://www.fda.gov/drugs/abbreviated-new-drug-application-anda',
'2020-06-01'),

('EMA Guideline on Dissolution Testing', 'EMA', 'Guideline', 'Requirements for dissolution test development and specifications for immediate release products',
'[
  "Dissolution testing should discriminate formulation differences",
  "Three-point dissolution curve comparison recommended",
  "f2 similarity factor >50 indicates similar profiles",
  "Sink conditions preferred (≤1/3 saturation solubility)",
  "Biorelevant media may be appropriate for BCS II/IV drugs"
]'::jsonb,
'https://www.ema.europa.eu/en/dissolution-test-immediate-release-solid-oral-dosage-forms',
'2010-01-01'),

('BCS Biowaiver Guidance', 'FDA', 'Guidance', 'Criteria for waiving in vivo BE studies based on Biopharmaceutics Classification System',
'[
  "BCS Class I drugs (high solubility, high permeability) eligible for biowaiver",
  "Drug must be highly soluble across pH 1-6.8",
  "Dissolution >85% in 30 minutes in all media",
  "IR products only; not applicable to NTI drugs",
  "Excipients must not impact bioavailability"
]'::jsonb,
'https://www.fda.gov/regulatory-information/search-fda-guidance-documents/waiver-vivo-bioavailability-and-bioequivalence-studies-immediate-release-solid-oral-dosage-forms',
'2017-12-01');
