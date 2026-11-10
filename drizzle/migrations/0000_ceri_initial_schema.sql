CREATE TABLE public.callback_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  source text NOT NULL DEFAULT 'rueckruf',
  name text NOT NULL,
  phone text NOT NULL,
  topic text,
  preferred_time text,
  address text,
  message text,
  ai_level text,
  status text NOT NULL DEFAULT 'neu'
);
GRANT SELECT, UPDATE ON public.callback_requests TO authenticated;
GRANT ALL ON public.callback_requests TO service_role;
ALTER TABLE public.callback_requests ENABLE ROW LEVEL SECURITY;

CREATE TYPE public.app_role AS ENUM ('admin','user');
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) $$;

CREATE OR REPLACE FUNCTION public.assign_first_admin()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles(user_id, role) VALUES (NEW.id, 'admin');
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER on_auth_user_first_admin AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.assign_first_admin();

CREATE POLICY "admins read requests" ON public.callback_requests FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins update requests" ON public.callback_requests FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.gallery_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  title text NOT NULL,
  category text NOT NULL DEFAULT 'Verteilerbau',
  description text,
  before_path text NOT NULL,
  after_path text NOT NULL,
  published boolean NOT NULL DEFAULT true
);
GRANT SELECT ON public.gallery_projects TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gallery_projects TO authenticated;
GRANT ALL ON public.gallery_projects TO service_role;
ALTER TABLE public.gallery_projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public reads published" ON public.gallery_projects FOR SELECT TO anon, authenticated USING (published OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins insert" ON public.gallery_projects FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins update" ON public.gallery_projects FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins delete" ON public.gallery_projects FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "projekte admin read" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'projekte' AND public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "projekte admin insert" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'projekte' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "projekte admin delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'projekte' AND public.has_role(auth.uid(), 'admin'));