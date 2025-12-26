
CREATE TYPE user_role AS ENUM (
  'student',       
  'parent',       
  'teacher',        
  'school_admin',  
  'super_admin'    
);

CREATE TYPE account_status AS ENUM (
  'pending',        
  'approved',        
  'rejected',       
  'suspended'       
);


CREATE TABLE school_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE schools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_group_id UUID REFERENCES school_groups(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  type TEXT, 
  address TEXT,
  phone TEXT,
  email TEXT,
  city TEXT,
  country TEXT DEFAULT 'France',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL, 
  grade_level TEXT, 
  academic_year TEXT, 
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE subjects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

DROP TABLE IF EXISTS profiles CASCADE;
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  bio TEXT,
  
  role user_role NOT NULL DEFAULT 'student',
  account_status account_status NOT NULL DEFAULT 'pending',
  
  school_id UUID REFERENCES schools(id) ON DELETE SET NULL,
  school_group_id UUID REFERENCES school_groups(id) ON DELETE SET NULL,
  
  grade_level TEXT, 
  subjects TEXT[], 
  
  validated_by UUID REFERENCES profiles(id) ON DELETE SET NULL, 
  validated_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  
  preferences JSONB DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE student_parent_relations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  parent_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  relation_type TEXT, -- "père", "mère", "tuteur", etc.
  is_primary_contact BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT unique_student_parent UNIQUE(student_id, parent_id)
);

CREATE TABLE class_enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT unique_class_student UNIQUE(class_id, student_id)
);

CREATE TABLE teacher_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE NOT NULL,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE NOT NULL,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT unique_teacher_class_subject UNIQUE(teacher_id, class_id, subject_id)
);

CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL DEFAULT 'Nouvelle conversation',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
 
ALTER TABLE conversations
ADD COLUMN subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
ADD COLUMN class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
ADD COLUMN is_group_chat BOOLEAN DEFAULT false;


CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_status ON profiles(account_status);
CREATE INDEX idx_profiles_school ON profiles(school_id);
CREATE INDEX idx_schools_group ON schools(school_group_id);
CREATE INDEX idx_classes_school ON classes(school_id);
CREATE INDEX idx_enrollments_student ON class_enrollments(student_id);
CREATE INDEX idx_enrollments_class ON class_enrollments(class_id);
CREATE INDEX idx_teacher_assignments_teacher ON teacher_assignments(teacher_id);
CREATE INDEX idx_teacher_assignments_class ON teacher_assignments(class_id);
CREATE INDEX idx_student_parent_student ON student_parent_relations(student_id);
CREATE INDEX idx_student_parent_parent ON student_parent_relations(parent_id);


CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_school_groups_updated_at
  BEFORE UPDATE ON school_groups
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_schools_updated_at
  BEFORE UPDATE ON schools
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_classes_updated_at
  BEFORE UPDATE ON classes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


ALTER TABLE school_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_parent_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Les utilisateurs peuvent voir leur propre profil"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Les super admins peuvent tout voir"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'super_admin'
    )
  );

CREATE POLICY "Les admins d'établissement voient les profils de leur école"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles admin
      WHERE admin.id = auth.uid()
      AND admin.role = 'school_admin'
      AND admin.school_id = profiles.school_id
    )
  );

CREATE POLICY "Les utilisateurs peuvent mettre à jour leur propre profil"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Les admins peuvent valider les comptes"
  ON profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles admin
      WHERE admin.id = auth.uid()
      AND (
        admin.role = 'super_admin'
        OR (admin.role = 'school_admin' AND admin.school_id = profiles.school_id)
      )
    )
  );

CREATE POLICY "Tout le monde peut voir les écoles"
  ON schools FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Seuls les super admins peuvent modifier les écoles"
  ON schools FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'super_admin'
    )
  );

CREATE POLICY "Tout le monde peut voir les groupes scolaires"
  ON school_groups FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Seuls les super admins peuvent modifier les groupes"
  ON school_groups FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'super_admin'
    )
  );

CREATE POLICY "Les utilisateurs voient les classes de leur école"
  ON classes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.school_id = classes.school_id
    )
  );

CREATE POLICY "Tout le monde peut voir les matières"
  ON subjects FOR SELECT
  TO authenticated
  USING (true);


INSERT INTO subjects (name, description) VALUES
  ('Mathématiques', 'Mathématiques générales'),
  ('Français', 'Langue et littérature française'),
  ('Anglais', 'Langue anglaise'),
  ('Histoire-Géographie', 'Histoire et géographie'),
  ('Sciences Physiques', 'Physique et chimie'),
  ('SVT', 'Sciences de la vie et de la terre'),
  ('Informatique', 'Sciences informatiques'),
  ('Philosophie', 'Philosophie'),
  ('EPS', 'Éducation physique et sportive'),
  ('Arts Plastiques', 'Arts visuels')
ON CONFLICT (name) DO NOTHING;


CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    role,
    account_status
  )
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'student'),
    'pending' 
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();