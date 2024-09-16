import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "j4ylrsin",
  dataset: "production",
  useCdn: true, // set to false if you want to use the latest version of assets
  apiVersion: "2023-03-24",
});

export async function getModules() {
  const assets: Array<Module> = await client.fetch(`*[_type == "module"] {
        _id,
        _type,
        title,
        subtitle,
        preview_image { asset->{url} }
      }`);
  return assets;
}

export async function getModule(id: string) {
  if (!id) return null;

  const asset = await client.getDocument<Module>(id);

  if (!asset) return null;

  return asset;
}
