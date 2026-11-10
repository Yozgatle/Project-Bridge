import { createServerFn } from "@tanstack/react-start";

// Public gallery: signs URLs server-side only for published projects.
export const getPublishedGallery = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin
    .from("gallery_projects")
    .select("id,title,category,description,before_path,after_path")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(6);
  return Promise.all(
    (data ?? []).map(async (r) => {
      const { data: s } = await supabaseAdmin.storage
        .from("projekte")
        .createSignedUrls([r.before_path, r.after_path], 60 * 60 * 24);
      return {
        id: r.id,
        title: r.title,
        category: r.category,
        description: r.description,
        before: s?.[0]?.signedUrl ?? "",
        after: s?.[1]?.signedUrl ?? "",
      };
    }),
  );
});
