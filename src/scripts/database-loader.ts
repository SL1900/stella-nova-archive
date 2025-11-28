import type { ItemData } from "./structs/item-data";

type FileType = "json" | "webp" | "jpg" | "png";

interface FetchedFile {
  url: string;
  item: ItemData;
}

const baseUrl: string = "https://api.github.com";
const owner: string = "BB-69";
const repo: string = "stella-nova-archive-db";
const token: string = import.meta.env.VITE_GITHUB_TOKEN || "";

function GetHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `token ${token}`;
  }

  return headers;
}

async function _TestRepositoryAccess(): Promise<void> {
  try {
    const rootUrl = `https://api.github.com/repos/${owner}/${repo}/contents`;
    console.log("Testing URL:", rootUrl);

    const response = await fetch(rootUrl, {
      headers: GetHeaders(),
    });

    console.log("Response status:", response.status);

    if (response.ok) {
      const rootContents = await response.json();
      console.log("Root contents:", rootContents);
    } else {
      const errorText = await response.text();
      console.log("Error response:", errorText);
    }
  } catch (error) {
    console.error("Test failed:", error);
  }
}

_TestRepositoryAccess();

async function FetchContent(f: any, type: FileType) {
  switch (type) {
    case "json":
      const itemResponse = await fetch(f.download_url);
      return await itemResponse.json();
    case "webp":
    case "jpg":
    case "png":
      return f.download_url;
  }
}

async function FetchFilesFromFolder(
  folderPath: string,
  fileType: FileType
): Promise<FetchedFile[]> {
  try {
    const url = `${baseUrl}/repos/${owner}/${repo}/contents/${folderPath}`;

    const response = await fetch(url, {
      headers: GetHeaders(),
    });

    if (!response.ok) {
      throw new Error(
        `GitHub API error: ${response.status} ${response.statusText}`
      );
    }

    const files = await response.json();
    const fileList = Array.isArray(files) ? files : [files];

    const items = await Promise.all(
      fileList
        .filter(
          (f: any) =>
            f.type === "file" &&
            f.name.toLowerCase().endsWith(`.${fileType}`) &&
            f.download_url
        )
        .map(async (file: any): Promise<FetchedFile> => {
          const item = await FetchContent(file, fileType);
          return {
            url: file.download_url,
            item,
          };
        })
    );

    return items;
  } catch (error) {
    console.error("Error fetching files:", error);
    throw error;
  }
}

export { FetchFilesFromFolder };
