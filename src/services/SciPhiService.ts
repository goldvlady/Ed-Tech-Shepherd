import axios from 'axios';
// Assuming SCIPHI_API_KEY is set as an environment variable or directly in your script
const SCIPHI_API_KEY = 'e1879d67b3c897086ee23d840e50207f';
interface SearchRagOptions {
  query: string;
  search_provider?: string;
  llm_model?: string;
  temperature?: number;
  top_p?: number;
}
interface SearchRagResponse {
  response: string;
  other_queries: string[];
  search_results: Array<{
    url: string;
    title: string;
    dataset: string;
    metadata: string;
    text: string;
  }>;
}
class SciPhiService {
  private baseUrl: string = 'https://api.sciphi.ai/search_rag';
  private apiKey: string = SCIPHI_API_KEY;
  async searchRag(options: SearchRagOptions): Promise<SearchRagResponse> {
    try {
      const response: any = await axios.post(
        this.baseUrl,
        {
          query: options.query,
          search_provider: options.search_provider || 'all',
          llm_model: options.llm_model || 'SciPhi/Sensei-7B-V2',
          temperature: options.temperature || 0.2,
          top_p: options.top_p || 0.95
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`API call failed: ${error.message}`);
      } else {
        throw new Error('An unexpected error occurred');
      }
    }
  }
}
export default SciPhiService;
