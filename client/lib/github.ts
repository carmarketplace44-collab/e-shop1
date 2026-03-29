export interface GitHubProductData {
  products: Array<{
    id: string;
    name: string;
    price: number;
    currency: string;
    images: string[];
    category: string;
    is_featured: boolean;
    is_promoted: boolean;
    promotion_tag?: string;
    description: string;
    created_at: string;
  }>;
  categories: string[];
}

const GITHUB_API_BASE = "https://api.github.com";
const REPO_OWNER = "YOUR_USERNAME"; // Will be replaced by user
const REPO_NAME = "e-shop-data";
const FILE_PATH = "products.json";
const BRANCH = "main";

export class GitHubProductsManager {
  private token: string;
  private owner: string;
  private repo: string;

  constructor(
    token: string,
    owner: string = REPO_OWNER,
    repo: string = REPO_NAME
  ) {
    this.token = token;
    this.owner = owner;
    this.repo = repo;
  }

  async fetchProducts(): Promise<GitHubProductData> {
    try {
      const response = await fetch(
        `${GITHUB_API_BASE}/repos/${this.owner}/${this.repo}/contents/${FILE_PATH}?ref=${BRANCH}`,
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
            Accept: "application/vnd.github.v3.raw",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching products from GitHub:", error);
      throw error;
    }
  }

  async updateProducts(data: GitHubProductData): Promise<void> {
    try {
      // First, get the current file SHA
      const getResponse = await fetch(
        `${GITHUB_API_BASE}/repos/${this.owner}/${this.repo}/contents/${FILE_PATH}`,
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }
      );

      if (!getResponse.ok) {
        throw new Error(`Failed to get file info: ${getResponse.statusText}`);
      }

      const fileInfo = await getResponse.json();
      const sha = fileInfo.sha;

      // Update the file
      const updateResponse = await fetch(
        `${GITHUB_API_BASE}/repos/${this.owner}/${this.repo}/contents/${FILE_PATH}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: "Update products via e-shop admin panel",
            content: btoa(JSON.stringify(data, null, 2)),
            sha: sha,
            branch: BRANCH,
          }),
        }
      );

      if (!updateResponse.ok) {
        throw new Error(`Failed to update products: ${updateResponse.statusText}`);
      }
    } catch (error) {
      console.error("Error updating products on GitHub:", error);
      throw error;
    }
  }

  async validateToken(): Promise<boolean> {
    try {
      const response = await fetch(`${GITHUB_API_BASE}/user`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });

      return response.ok;
    } catch {
      return false;
    }
  }

  updateConfig(owner: string, repo: string) {
    this.owner = owner;
    this.repo = repo;
  }
}

export async function fetchProductsFromGitHub(
  token: string,
  owner: string = REPO_OWNER,
  repo: string = REPO_NAME
): Promise<GitHubProductData> {
  const manager = new GitHubProductsManager(token, owner, repo);
  return manager.fetchProducts();
}

export async function updateProductsOnGitHub(
  token: string,
  data: GitHubProductData,
  owner: string = REPO_OWNER,
  repo: string = REPO_NAME
): Promise<void> {
  const manager = new GitHubProductsManager(token, owner, repo);
  return manager.updateProducts(data);
}

export async function validateGitHubToken(token: string): Promise<boolean> {
  const manager = new GitHubProductsManager(token);
  return manager.validateToken();
}
