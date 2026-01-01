alter table public.schools enable row level security;

create policy "Public read schools"
on public.schools
for select
using (true);

-- ============================================
-- SOLUTION SIMPLE POUR LE DÉVELOPPEMENT
-- ============================================

-- 1. Supprimer toutes les policies
DROP POLICY IF EXISTS "Les utilisateurs peuvent voir leur propre profil" ON profiles;
DROP POLICY IF EXISTS "Les super admins peuvent tout voir" ON profiles;
DROP POLICY IF EXISTS "Les admins d'établissement voient les profils de leur école" ON profiles;
DROP POLICY IF EXISTS "Les utilisateurs peuvent mettre à jour leur propre profil" ON profiles;
DROP POLICY IF EXISTS "Les admins peuvent valider les comptes" ON profiles;

-- 2. DÉSACTIVER COMPLÈTEMENT RLS (recommandé pour le dev)
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Si vous avez besoin de RLS pour les autres tables :
ALTER TABLE school_groups DISABLE ROW LEVEL SECURITY;
ALTER TABLE schools DISABLE ROW LEVEL SECURITY;
ALTER TABLE classes DISABLE ROW LEVEL SECURITY;
ALTER TABLE subjects DISABLE ROW LEVEL SECURITY;
ALTER TABLE student_parent_relations DISABLE ROW LEVEL SECURITY;
ALTER TABLE class_enrollments DISABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_assignments DISABLE ROW LEVEL SECURITY;

-- 3. VÉRIFICATION
SELECT 
  tablename, 
  rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'schools', 'school_groups');

SELECT ':white_check_mark: RLS désactivé pour le développement' as status;

-- NOTE : En PRODUCTION, réactivez RLS avec des policies correctes !

 -- Désactiver RLS sur toutes les tables
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE school_groups DISABLE ROW LEVEL SECURITY;
ALTER TABLE schools DISABLE ROW LEVEL SECURITY; 
 -- ============================================
-- DÉSACTIVER LE TRIGGER PROBLÉMATIQUE
-- ============================================

-- 1. Supprimer complètement le trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 2. Vérifier que c'est bien supprimé
SELECT 'Trigger supprimé avec succès !' as status;

-- On gérera maintenant la création du profil directement dans l'API signup
-- ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;  