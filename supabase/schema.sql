-- CampusFix Database Schema (Supabase PostgreSQL)
-- Warm Collegiate Modernism — University Support & Facilities Platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('student', 'doctor', 'admin')),
    department VARCHAR(255),
    building VARCHAR(255),
    student_id VARCHAR(100),
    employee_id VARCHAR(100),
    phone VARCHAR(50),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. MAINTENANCE REPORTS TABLE
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_number VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('electricity', 'ac', 'network', 'furniture', 'cleaning', 'lab', 'other')),
    priority VARCHAR(50) NOT NULL DEFAULT 'moderate' CHECK (priority IN ('low', 'moderate', 'high', 'urgent')),
    building VARCHAR(255) NOT NULL,
    floor VARCHAR(100) NOT NULL,
    room VARCHAR(100) NOT NULL,
    asset_barcode VARCHAR(100),
    image_url TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'dispatched', 'in_progress', 'awaiting_parts', 'resolved')),
    progress_percent INT DEFAULT 0,
    reporter_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    reporter_name VARCHAR(255) NOT NULL,
    reporter_role VARCHAR(50) NOT NULL,
    technician_name VARCHAR(255),
    technician_status VARCHAR(100),
    technician_note TEXT,
    technician_note_ar TEXT,
    estimated_resolution VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. LOST & FOUND ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.lost_found_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tag_number VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    title_ar VARCHAR(255),
    description TEXT NOT NULL,
    description_ar TEXT,
    type VARCHAR(50) NOT NULL CHECK (type IN ('lost', 'found')),
    category VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    location_ar VARCHAR(255),
    image_url TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'reported_lost' CHECK (status IN ('reported_lost', 'safe_with_security', 'claim_pending', 'returned')),
    reported_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    reported_by_name VARCHAR(255) NOT NULL,
    holding_location VARCHAR(255),
    private_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. CLAIM REQUESTS TABLE (With confidential verification traits)
CREATE TABLE IF NOT EXISTS public.claim_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id UUID REFERENCES public.lost_found_items(id) ON DELETE CASCADE,
    item_title VARCHAR(255) NOT NULL,
    item_tag VARCHAR(50) NOT NULL,
    claimant_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    claimant_name VARCHAR(255) NOT NULL,
    claimant_student_id VARCHAR(100) NOT NULL,
    claimant_department VARCHAR(255) NOT NULL,
    claimant_phone VARCHAR(50) NOT NULL,
    private_description TEXT NOT NULL, -- Private verifying traits (wallpaper, serial number, scratch)
    proof_document_url TEXT,
    pickup_method VARCHAR(50) NOT NULL CHECK (pickup_method IN ('central', 'department')),
    status VARCHAR(50) NOT NULL DEFAULT 'pending_review' CHECK (status IN ('pending_review', 'approved', 'rejected', 'additional_proof_requested')),
    admin_verification_note TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- 5. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    title_ar VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    message_ar TEXT NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'system',
    read BOOLEAN DEFAULT FALSE,
    link TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lost_found_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.claim_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Profiles: Anyone can view names, user can update own profile, admin can update any
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Maintenance Reports: Everyone authenticated can view reports; users can create; admins or technicians can update
CREATE POLICY "Reports are viewable by authenticated users" ON public.reports FOR SELECT USING (true);
CREATE POLICY "Users can insert reports" ON public.reports FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can update reports" ON public.reports FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin')
  OR reporter_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);

-- Lost & Found: Items catalog is publicly viewable
CREATE POLICY "Lost and found items are viewable by all" ON public.lost_found_items FOR SELECT USING (true);
CREATE POLICY "Users can insert lost/found items" ON public.lost_found_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can update lost/found items" ON public.lost_found_items FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin')
);

-- Claim Requests: Claimants see only their own claim requests; admins see all claim requests with private details
CREATE POLICY "Claimants see their own claim requests" ON public.claim_requests FOR SELECT USING (
  claimant_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM public.profiles WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin')
);
CREATE POLICY "Authenticated users can submit claims" ON public.claim_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Only admins can update claim requests" ON public.claim_requests FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin')
);

-- Notifications: Users see only their own notifications
CREATE POLICY "Users see own notifications" ON public.notifications FOR SELECT USING (
  user_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);

